import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  streamText,
  DataStreamWriter,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { fullSystemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';

export const maxDuration = 60;

// Parse content to extract introduction, before_work, and steps for pagination
function parseMyContent(content: string): {
  introduction: string;
  beforeWork: string;
  steps: Array<{ number: number; content: string }>;
  totalSteps: number;
  boundingBox?: { centerX: number; centerY: number };
} {
  console.log("Parsing content (length):", content.length);
  
  const result = {
    introduction: '',
    beforeWork: '',
    steps: [] as Array<{ number: number; content: string }>,
    totalSteps: 0,
    boundingBox: undefined
  };
  
  // Extract introduction
  const introMatch = content.match(/<introduction>([\s\S]*?)<\/introduction>/);
  if (introMatch && introMatch[1]) {
    result.introduction = introMatch[1].trim();
  }
  
  // Extract before_work
  const beforeWorkMatch = content.match(/<before_work>([\s\S]*?)<\/before_work>/);
  if (beforeWorkMatch && beforeWorkMatch[1]) {
    result.beforeWork = beforeWorkMatch[1].trim();
  }
  
  // Extract all steps
  const stepRegex = /<step_(\d+)>([\s\S]*?)<\/step_\1>/g;
  let match;
  
  while ((match = stepRegex.exec(content)) !== null) {
    const stepNumber = parseInt(match[1], 10);
    const stepContent = match[2].trim();
    
    result.steps.push({
      number: stepNumber,
      content: stepContent
    });
  }
  
  // Sort steps by number to ensure correct order
  result.steps.sort((a, b) => a.number - b.number);
  
  // Calculate total steps
  result.totalSteps = result.steps.length;
  
  // Extrat image coordinates if present
  const boundingBoxMatch = content.match(/<bounding_box>center:\s*(\d+),\s*(\d+)<\/bounding_box>/);
  if (boundingBoxMatch) {
    result.boundingBox = {
      centerX: parseInt(boundingBoxMatch[1]),
      centerY: parseInt(boundingBoxMatch[2])
    };
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: async (dataStream: DataStreamWriter) => {
        let assistantId: string | undefined = undefined;

        const result = streamText({
          model: myProvider.languageModel(selectedChatModel),
          system: fullSystemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  'requestSuggestions',
                ],
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({
              session,
              dataStream,
            }),
          },
          onFinish: async ({ response, text }) => {
            let finalParsedContent = '';
            try {
              var { introduction, beforeWork, steps, totalSteps } = parseMyContent(text);

              if (session.user?.id) {
                let potentialId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });
                assistantId = potentialId ?? undefined;

                if (!assistantId) {
                  console.error('No assistant message ID found in response!');
                  assistantId = generateUUID();
                }

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } else {
                assistantId = generateUUID();
              }

              // Create a structured payload with all parsed content
              const parsedData = {
                content: {
                  type: 'pagination',
                  introduction,
                  beforeWork,
                  steps,
                  totalSteps
                }
              };

              // Send the structured data instead of just introduction + beforeWork
              dataStream.write(`0:${JSON.stringify(JSON.stringify(parsedData))}\n`);
            } catch (error) {
              console.error('Error during onFinish processing or parsing:', error);
              const errorMessageContent = `Error processing response: ${error instanceof Error ? error.message : 'Unknown error'}`;
              dataStream.write(`0:${JSON.stringify(errorMessageContent)}\n`);
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        try {
          await result.consumeStream();
        } catch (streamError) {
          console.error("Error consuming stream:", streamError);
          throw streamError;
        }
      },
      onError: (error) => {
        console.error("createDataStreamResponse error:", error);
        return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    console.error("POST handler error:", error);
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { google } from '@ai-sdk/google';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // Using gemini-1.5-flash-8b instead of gemini-2.5-pro-exp-03-25
        'chat-model': google('gemini-2.0-flash-001'),
        'chat-model-reasoning': wrapLanguageModel({
          model: google('gemini-2.0-flash-001'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('gemini-2.0-flash-001'),
        'artifact-model': google('gemini-2.0-flash-001'),
      },
    });

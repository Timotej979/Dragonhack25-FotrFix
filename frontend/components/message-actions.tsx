import type { Message } from 'ai';
import { useSWRConfig } from 'swr';
import { useCopyToClipboard } from 'usehooks-ts';

import type { Vote } from '@/lib/db/schema';

import { CopyIcon, ThumbDownIcon, ThumbUpIcon , NextIcon, PreviousIcon} from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { memo } from 'react';
import equal from 'fast-deep-equal';
import { toast } from 'sonner';
import { on } from 'events';
import { is } from 'drizzle-orm';

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
  stepIndex,
  totalSteps,
  isFirstStep, // Use isFirstStep prop
  isLastStep, // Use isLastStep prop
  onPrevious,
  onNext,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
  stepIndex: number; // Current step index
  totalSteps: number; // Total number of steps
  isFirstStep: boolean; // Whether it's the first step
  isLastStep: boolean; // Whether it's the last step
  onPrevious: () => void; // Handler for Previous button
  onNext: () => void; // Handler for Next button
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === 'user') return null;

  // Let the props control these variables - do not overwrite them
  console.log("Is first step:", isFirstStep, "Is last step:", isLastStep, "Current step:", stepIndex, "Total steps:", totalSteps);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col gap-2">
        {/* First row of buttons */}
        <div className="flex flex-row gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="py-1 px-2 h-fit text-muted-foreground"
                variant="outline"
                onClick={async () => {
                  const textFromParts = message.parts
                    ?.filter((part) => part.type === 'text')
                    .map((part) => part.text)
                    .join('\n')
                    .trim();

                  if (!textFromParts) {
                    toast.error("There's no text to copy!");
                    return;
                  }

                  await copyToClipboard(textFromParts);
                  toast.success('Copied to clipboard!');
                }}
              >
                <CopyIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-upvote"
                className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
                disabled={vote?.isUpvoted}
                variant="outline"
                onClick={async () => {
                  const upvote = fetch('/api/vote', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      chatId,
                      messageId: message.id,
                      type: 'up',
                    }),
                  });

                  toast.promise(upvote, {
                    loading: 'Upvoting Response...',
                    success: () => {
                      mutate<Array<Vote>>(
                        `/api/vote?chatId=${chatId}`,
                        (currentVotes) => {
                          if (!currentVotes) return [];

                          const votesWithoutCurrent = currentVotes.filter(
                            (vote) => vote.messageId !== message.id,
                          );

                          return [
                            ...votesWithoutCurrent,
                            {
                              chatId,
                              messageId: message.id,
                              isUpvoted: true,
                            },
                          ];
                        },
                        { revalidate: false },
                      );

                      return 'Upvoted Response!';
                    },
                    error: 'Failed to upvote response.',
                  });
                }}
              >
                <ThumbUpIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upvote Response</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                data-testid="message-downvote"
                className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
                variant="outline"
                disabled={vote && !vote.isUpvoted}
                onClick={async () => {
                  const downvote = fetch('/api/vote', {
                    method: 'PATCH',
                    body: JSON.stringify({
                      chatId,
                      messageId: message.id,
                      type: 'down',
                    }),
                  });

                  toast.promise(downvote, {
                    loading: 'Downvoting Response...',
                    success: () => {
                      mutate<Array<Vote>>(
                        `/api/vote?chatId=${chatId}`,
                        (currentVotes) => {
                          if (!currentVotes) return [];

                          const votesWithoutCurrent = currentVotes.filter(
                            (vote) => vote.messageId !== message.id,
                          );

                          return [
                            ...votesWithoutCurrent,
                            {
                              chatId,
                              messageId: message.id,
                              isUpvoted: false,
                            },
                          ];
                        },
                        { revalidate: false },
                      );

                      return 'Downvoted Response!';
                    },
                    error: 'Failed to downvote response.',
                  });
                }}
              >
                <ThumbDownIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Downvote Response</TooltipContent>
          </Tooltip>
        </div>

        {/* Second row of buttons: Next and Previous */}
        <div className="flex flex-row gap-2 justify-center pt-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={`py-1 px-2 h-fit ${
                  isFirstStep
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-yellow-100 text-yellow-500'
                }`}
                variant="outline"
                disabled={isFirstStep} // Disable when it's the first step
                onClick={() => {
                  console.log("Previous button clicked");
                  onPrevious(); // Call the onPrevious handler passed as a prop
                  toast.success('Previous step');
                }}
              >
                <PreviousIcon />
                <span className="mr-1">Previous</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={`py-1 px-2 h-fit ${
                  isLastStep
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-yellow-100 text-yellow-500'
                }`}
                variant="outline"
                disabled={isLastStep} // Disable when it's the last step
                onClick={() => {
                  console.log("Next button clicked");
                  onNext(); // Call the onNext handler passed as a prop
                  toast.success('Next step');
                }}
              >
                <span className="mr-1">Next</span>
                <NextIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  },
);

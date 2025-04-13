'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState } from 'react';
import type { Vote } from '@/lib/db/schema';
import { DocumentToolCall, DocumentToolResult } from './document';
import { PencilEditIcon, SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { MessageActions } from './message-actions';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MessageEditor } from './message-editor';
import { DocumentPreview } from './document-preview';
import { MessageReasoning } from './message-reasoning';
import { UseChatHelpers } from '@ai-sdk/react';
import Image from 'next/image';
import { is } from 'drizzle-orm';




const PurePreviewMessage = ({
  chatId,
  message,
  vote,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  chatId: string;
  message: UIMessage;
  vote: Vote | undefined;
  isLoading: boolean;
  setMessages: UseChatHelpers['setMessages'];
  reload: UseChatHelpers['reload'];
  isReadonly: boolean;
}) => {
  var [currentStep, setCurrentStep] = useState(0); // Track the current step

  // Preprocess message parts to split by "Step"
  const steps = message.parts
    ?.filter((part) => part.type === 'text') // Only process text parts
    .flatMap((part) => part.text.split(/(?=Step)/)) // Split by "Step" keyword
    .map((step) => step.trim()) // Trim whitespace
    .filter((step) => step.length > 0); // Remove empty steps

  const totalSteps = steps.length;
    // Calculate isFirstStep and isLastStep based on currentStep and totalSteps
  var isFirstStep = currentStep === 0;
  var isLastStep = currentStep === totalSteps - 1;

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn('flex items-start gap-3 mb-4', {
            'flex-row-reverse': message.role === 'user',
          })}
        >
          <div className="flex-shrink-0">
            <Image
              src={
                message.role === 'user'
                  ? `https://avatar.vercel.sh/user-avatar`
                  : `/images/FotrFix-1.png`
              }
              alt={`${message.role} avatar`}
              width={message.role === 'user' ? 40 : 48}
              height={message.role === 'user' ? 40 : 48}
              className="rounded-full"
            />
          </div>

          <div
            className={cn(
              'flex flex-col gap-4 w-full max-w-2xl',
              {
                'items-end text-right': message.role === 'user',
                'items-start text-left': message.role !== 'user',
              }
            )}
          >
            {/* Render only the current step */}
            {message.parts?.map((part, index) => {
              if (index !== currentStep) return null; // Skip other steps

              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === 'text') {
                return (
                  <div key={key} className="flex flex-row gap-2 items-start">
                    <div
                      data-testid="message-content"
                      className={cn('flex flex-col gap-4 px-3 py-2 rounded-xl', {
                        'bg-primary text-primary-foreground': message.role === 'user',
                        'bg-muted': message.role === 'assistant',
                      })}
                    >
                      <Markdown>{part.text}</Markdown>
                    </div>
                  </div>
                );
              }

              if (type === 'reasoning') {
                return (
                  <MessageReasoning
                    key={key}
                    isLoading={isLoading}
                    reasoning={part.reasoning}
                  />
                );
              }

              // Handle other part types (e.g., tool-invocation) here if needed
            })}


            
            {!isReadonly && (
              <MessageActions
              key={`action-${message.id}`}
              chatId={chatId}
              message={message}
              vote={vote}
              isLoading={isLoading}
              stepIndex={currentStep} // Pass the current step index
              totalSteps={totalSteps} // Pass the total number of steps
              isFirstStep={isFirstStep} // Pass isFirstStep as a prop
              isLastStep={isLastStep} // Pass isLastStep as a prop
              onPrevious={() => {
                console.log("Previous clicked. Current step before:", currentStep);
                setCurrentStep((prev) => {
                  const newStep = Math.max(prev - 1, 0); // Ensure it doesn't go below 0
                  if(newStep === 0) {
                    isFirstStep = true;
                  }
                  console.log("Current step after:", newStep);
                  return newStep;
                });
              }} // Handler for Previous
              onNext={() => {
                console.log("Next clicked. Current step before:", currentStep);
                setCurrentStep((prev) => {
                  const newStep = Math.min(prev + 1, totalSteps - 1); // Ensure it doesn't exceed totalSteps - 1
                  if(newStep === totalSteps - 1) {
                    isLastStep = true;
                  }
                  console.log("isLastStep", isLastStep);

                  console.log("Current step after:", newStep);
                  return newStep;
                });
              }} // Handler for Next
            />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;
    if (!equal(prevProps.vote, nextProps.vote)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 1 } }}
      data-role={role}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0">
        <Image
          src="/images/FotrFix-1.png"
          alt="assistant avatar"
          width={48}
          height={48}
          className="rounded-full"
        />

        </div>

        <div className="flex gap-4 bg-muted px-3 py-2 rounded-xl">
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>

          <div className="flex flex-col gap-2 text-muted-foreground">
            Hmm...
          </div>
        </div>
      </div>
    </motion.div>
  );
};

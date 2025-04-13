'use client';

import type { UIMessage } from 'ai';
import cx from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useState, useEffect } from 'react';
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

// Define pagination content interface
interface PaginationContent {
  type: 'pagination';
  introduction: string;
  beforeWork: string;
  steps: Array<{ number: number; content: string }>;
  totalSteps: number;
}

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
  const [currentStep, setCurrentStep] = useState(0); // Track the current step
  const [paginationData, setPaginationData] = useState<PaginationContent | null>(null);
  
  // Parse message content to extract pagination data if available
  useEffect(() => {
    if (message.role === 'assistant' && message.parts) {
      const textParts = message.parts.filter(part => part.type === 'text');
      
      if (textParts.length > 0) {
        try {
          // Try to parse the message content as JSON
          const content = textParts[0].text;
          
          // The content might be double-stringified JSON
          const parsedData = JSON.parse(content);
          const parsedContent = typeof parsedData === 'string' 
            ? JSON.parse(parsedData) 
            : parsedData;
          
          // Check if it matches our pagination format
          if (parsedContent?.content?.type === 'pagination') {
            setPaginationData(parsedContent.content);
            console.log("Pagination data found:", parsedContent.content);
          } else {
            console.log("Message doesn't contain pagination data");
          }
        } catch (error) {
          console.log("Not a JSON message or pagination data:", error);
        }
      }
    }
  }, [message]);

  // Get total steps for pagination controls
  const totalSteps = paginationData 
    ? paginationData.steps.length + 1 // +1 for intro/beforeWork
    : 1;
  
  // Calculate isFirstStep and isLastStep
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Render the appropriate content based on currentStep
  const renderContent = () => {
    // If we have pagination data
    if (paginationData) {
      if (currentStep === 0) {
        // On first step, show introduction and beforeWork
        return (
          <div className="flex flex-col gap-4">
            {paginationData.introduction && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                <Markdown>{paginationData.introduction}</Markdown>
              </div>
            )}
            {paginationData.beforeWork && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Before We Begin</h3>
                <Markdown>{paginationData.beforeWork}</Markdown>
              </div>
            )}
          </div>
        );
      } else {
        // On other steps, show the corresponding step content
        const stepIndex = currentStep - 1; // Adjust for 0-indexing
        const step = paginationData.steps[stepIndex];
        
        if (step) {
          return (
            <div>
              <h3 className="text-lg font-semibold mb-2">Step {step.number}</h3>
              <Markdown>{step.content}</Markdown>
            </div>
          );
        }
      }
    }
    
    // Fallback to regular message rendering if no pagination data
    return message.parts?.map((part, index) => {
      const { type } = part;
      const key = `message-${message.id}-part-${index}`;

      if (type === 'text') {
        return (
          <div key={key} className="flex flex-row gap-2 items-start">
            <div
              data-testid="message-content"
              className="flex flex-col gap-4 px-3 py-2 rounded-xl"
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
      
      return null; // Ignore other part types
    });
  };

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
            {/* Render content based on pagination state */}
            <div
              data-testid="message-content"
              className={cn('flex flex-col gap-4 px-3 py-2 rounded-xl', {
                'bg-primary text-primary-foreground': message.role === 'user',
                'bg-muted': message.role === 'assistant',
              })}
            >
              {renderContent()}
            </div>
            
            {/* Render pagination controls only for assistant messages with pagination data */}
            {!isReadonly && message.role === 'assistant' && paginationData && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
                stepIndex={currentStep} 
                totalSteps={totalSteps}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                onPrevious={() => {
                  console.log("Previous clicked. Current step before:", currentStep);
                  setCurrentStep((prev) => Math.max(prev - 1, 0));
                }}
                onNext={() => {
                  console.log("Next clicked. Current step before:", currentStep);
                  setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
                }}
              />
            )}
            
            {/* Keep regular actions for non-pagination content */}
            {!isReadonly && message.role === 'assistant' && !paginationData && (
              <MessageActions
                key={`action-${message.id}`}
                chatId={chatId}
                message={message}
                vote={vote}
                isLoading={isLoading}
                stepIndex={0}
                totalSteps={1}
                isFirstStep={true}
                isLastStep={true}
                onPrevious={() => {}}
                onNext={() => {}}
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

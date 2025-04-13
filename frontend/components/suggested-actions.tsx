'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo, useEffect, useState } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  useEffect(() => {
    const handleFocus = () => setIsKeyboardActive(true);
    const handleBlur = () => setIsKeyboardActive(false);

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    // Cleanup event listeners
    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  const suggestedActions = [
    {
      title: 'How to fix',
      label: 'a leaking toilet?',
      action: 'How to fix a leaking toilet?',
    },
    {
      title: 'How to repair',
      label: `or patch drywall?`,
      action: `How to repair or patch drywall?`,
    },
  ];

  // Hide suggested actions when the keyboard is active
  if (isKeyboardActive) {
    return null;
  }

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full auto-rows-auto"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block h-auto' : 'block h-auto'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-4 text-sm flex flex-row sm:flex-col w-full h-full min-h-[70px] max-h-fit justify-start items-start gap-1"
          >
            <span className="font-medium line-clamp-1">{suggestedAction.title}</span>
            <span className="text-muted-foreground line-clamp-2">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
'use client';

import { Alert, Stack, Text, Button, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong',
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <Center style={{ minHeight: '400px' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <Alert
          icon={<IconAlertCircle size={24} />}
          title={title}
          color="red"
          variant="light"
        >
          <Stack gap="md">
            <Text size="sm">{message}</Text>
            {onRetry && (
              <Button color="red" onClick={onRetry} size="sm">
                Try Again
              </Button>
            )}
          </Stack>
        </Alert>
      </motion.div>
    </Center>
  );
}

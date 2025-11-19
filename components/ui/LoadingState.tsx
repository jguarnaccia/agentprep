'use client';

import { Loader, Center, Stack, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LoadingState({ message = 'Loading...', size = 'md' }: LoadingStateProps) {
  return (
    <Center style={{ minHeight: '400px' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Stack align="center" gap="md">
          <Loader size={size} />
          <Text c="dimmed">{message}</Text>
        </Stack>
      </motion.div>
    </Center>
  );
}

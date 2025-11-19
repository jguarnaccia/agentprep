'use client';

import { Container, Card, Text, Group, Stack, Title, Paper, Button, Badge } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface LessonTemplateProps {
  title: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  content: ReactNode;
  navigation?: {
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
  };
  sidebar?: ReactNode;
}

const difficultyColors = {
  easy: 'green',
  medium: 'yellow',
  hard: 'red',
};

export function LessonTemplate({ 
  title, 
  category, 
  difficulty, 
  content, 
  navigation, 
  sidebar 
}: LessonTemplateProps) {
  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper shadow="sm" p="xl" radius="md" mb="xl">
          <Group justify="space-between" align="start">
            <Stack gap="xs">
              <Group gap="xs">
                {category && (
                  <Badge variant="light" color="blue">
                    {category}
                  </Badge>
                )}
                {difficulty && (
                  <Badge variant="filled" color={difficultyColors[difficulty]}>
                    {difficulty.toUpperCase()}
                  </Badge>
                )}
              </Group>
              <Title order={1}>{title}</Title>
            </Stack>
          </Group>
        </Paper>
      </motion.div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: sidebar ? '1fr 300px' : '1fr', gap: '1.5rem' }}>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card shadow="sm" padding="xl" radius="md">
            {content}
          </Card>

          {/* Navigation */}
          {navigation && (
            <Group justify="space-between" mt="xl">
              <Button
                variant="outline"
                onClick={navigation.onPrevious}
                disabled={!navigation.hasPrevious}
              >
                ← Previous
              </Button>
              <Button
                onClick={navigation.onNext}
                disabled={!navigation.hasNext}
              >
                Next →
              </Button>
            </Group>
          )}
        </motion.div>

        {/* Sidebar */}
        {sidebar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div style={{ position: 'sticky', top: 20 }}>
              <Paper shadow="sm" p="lg" radius="md">
                {sidebar}
              </Paper>
            </div>
          </motion.div>
        )}
      </div>
    </Container>
  );
}

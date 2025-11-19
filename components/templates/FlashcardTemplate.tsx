'use client';

import { Container, Card, Stack, Title, Text, Group, ActionIcon, Badge } from '@mantine/core';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

interface FlashcardTemplateProps {
  front: ReactNode;
  back: ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  currentCard: number;
  totalCards: number;
  onNext: () => void;
  onPrevious: () => void;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  controls?: ReactNode;
}

export function FlashcardTemplate({
  front,
  back,
  isFlipped,
  onFlip,
  currentCard,
  totalCards,
  onNext,
  onPrevious,
  category,
  difficulty,
  controls,
}: FlashcardTemplateProps) {
  const difficultyColors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red',
  };

  return (
    <Container size="md" py="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2}>Flashcard Study</Title>
            <Text size="sm" c="dimmed">
              Card {currentCard} of {totalCards}
            </Text>
          </div>
          <Group gap="xs">
            {category && (
              <Badge variant="light" color="blue">
                {category}
              </Badge>
            )}
            {difficulty && (
              <Badge variant="filled" color={difficultyColors[difficulty]}>
                {difficulty}
              </Badge>
            )}
          </Group>
        </Group>
      </motion.div>

      {/* Flashcard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ perspective: '1000px' }}
      >
        <div
          onClick={onFlip}
          style={{
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '400px',
            position: 'relative',
          }}
        >
          {/* Front */}
          <Card
            shadow="lg"
            padding="xl"
            radius="md"
            style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack align="center" justify="center" style={{ textAlign: 'center' }}>
              {front}
              <Text size="xs" c="dimmed" mt="xl">
                Click to flip
              </Text>
            </Stack>
          </Card>

          {/* Back */}
          <Card
            shadow="lg"
            padding="xl"
            radius="md"
            style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              minHeight: '400px',
              transform: 'rotateY(180deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack align="center" justify="center" style={{ textAlign: 'center' }}>
              {back}
              <Text size="xs" c="dimmed" mt="xl">
                Click to flip back
              </Text>
            </Stack>
          </Card>
        </div>
      </motion.div>

      {/* Navigation */}
      <Group justify="center" mt="xl" gap="xl">
        <ActionIcon
          size="xl"
          variant="filled"
          color="blue"
          onClick={onPrevious}
          disabled={currentCard === 1}
        >
          <IconArrowLeft size={24} />
        </ActionIcon>

        <Text fw={600} size="lg">
          {currentCard} / {totalCards}
        </Text>

        <ActionIcon
          size="xl"
          variant="filled"
          color="red"
          onClick={onNext}
          disabled={currentCard === totalCards}
        >
          <IconArrowRight size={24} />
        </ActionIcon>
      </Group>

      {/* Controls */}
      {controls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card shadow="sm" padding="lg" radius="md" mt="xl">
            {controls}
          </Card>
        </motion.div>
      )}
    </Container>
  );
}

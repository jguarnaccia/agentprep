'use client';

import { Container, Title, Stack, Paper, Tabs } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GameTemplateProps {
  title: string;
  subtitle?: string;
  tabs?: {
    value: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
  }[];
  defaultTab?: string;
}

export function GameTemplate({ 
  title, 
  subtitle, 
  tabs,
  defaultTab 
}: GameTemplateProps) {
  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Stack align="center" gap="xs" mb="xl">
          <Title order={1}>{title}</Title>
          {subtitle && (
            <Title order={3} fw={400} c="dimmed">
              {subtitle}
            </Title>
          )}
        </Stack>
      </motion.div>

      {/* Game Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {tabs ? (
          <Tabs defaultValue={defaultTab || tabs[0]?.value} variant="pills">
            <Tabs.List grow mb="xl">
              {tabs.map((tab) => (
                <Tabs.Tab
                  key={tab.value}
                  value={tab.value}
                  leftSection={tab.icon}
                >
                  {tab.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {tabs.map((tab) => (
              <Tabs.Panel key={tab.value} value={tab.value}>
                <Paper shadow="md" p="xl" radius="md">
                  {tab.content}
                </Paper>
              </Tabs.Panel>
            ))}
          </Tabs>
        ) : (
          <Paper shadow="md" p="xl" radius="md">
            Game content here
          </Paper>
        )}
      </motion.div>
    </Container>
  );
}

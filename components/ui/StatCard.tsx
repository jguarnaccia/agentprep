'use client';

import { Card, Group, Text, ThemeIcon, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onClick?: () => void;
}

export function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color = 'blue',
  onClick 
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        shadow="sm" 
        padding="lg" 
        radius="md" 
        onClick={onClick}
        style={{ 
          cursor: onClick ? 'pointer' : 'default',
          height: '100%',
        }}
      >
        <Group justify="space-between" mb="xs">
          <ThemeIcon color={color} size="lg" radius="md">
            {icon}
          </ThemeIcon>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
        </Group>
        
        <Text size="xl" fw={700}>
          {value}
        </Text>
        
        {subtitle && (
          <Text size="sm" c="dimmed" mt={4}>
            {subtitle}
          </Text>
        )}
      </Card>
    </motion.div>
  );
}

'use client';

import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color?: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

export function FeatureCard({
  title,
  description,
  icon,
  color = 'blue',
  badge,
  href,
  onClick,
}: FeatureCardProps) {
  const card = (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        onClick={onClick}
        style={{
          cursor: onClick || href ? 'pointer' : 'default',
          height: '100%',
          position: 'relative',
        }}
      >
        {badge && (
          <Badge
            color={color}
            variant="filled"
            style={{ position: 'absolute', top: 12, right: 12 }}
          >
            {badge}
          </Badge>
        )}

        <Stack gap="md">
          <Group gap="md">
            <div style={{ color: `var(--mantine-color-${color}-6)` }}>
              {icon}
            </div>
          </Group>

          <div>
            <Text fw={600} size="lg" mb="xs">
              {title}
            </Text>
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          </div>

          <Text
            size="sm"
            fw={600}
            c={color}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            Get Started →
          </Text>
        </Stack>
      </Card>
    </motion.div>
  );

  return href ? (
    <Link href={href} style={{ textDecoration: 'none' }}>
      {card}
    </Link>
  ) : (
    card
  );
}

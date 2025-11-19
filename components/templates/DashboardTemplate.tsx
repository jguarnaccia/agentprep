'use client';

import { Container, Grid, Card, Text, Group, Badge, Progress, Stack, Title, Paper, SimpleGrid } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
  progress?: number;
}

interface DashboardTemplateProps {
  stats: StatCardProps[];
  recentActivity?: ReactNode;
  quickActions?: ReactNode;
  progressOverview?: ReactNode;
}

const StatCard = ({ title, value, icon, color, subtitle, progress }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card 
      shadow="sm" 
      padding="lg" 
      radius="md"
      style={{
        background: 'linear-gradient(135deg, #111317 0%, #16181D 100%)',
        border: '1px solid #1F2937',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Group justify="space-between" mb="md">
        <div style={{ 
          color: color === 'red' ? '#EF4444' : color === 'green' ? '#10B981' : color === 'orange' ? '#F59E0B' : '#3B82F6',
          background: color === 'red' ? 'rgba(239, 68, 68, 0.1)' : color === 'green' ? 'rgba(16, 185, 129, 0.1)' : color === 'orange' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          padding: '8px',
          borderRadius: '8px',
          border: `1px solid ${color === 'red' ? 'rgba(239, 68, 68, 0.2)' : color === 'green' ? 'rgba(16, 185, 129, 0.2)' : color === 'orange' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
        }}>
          {icon}
        </div>
        <Badge 
          color={color}
          variant="light"
          style={{
            background: color === 'red' ? 'rgba(239, 68, 68, 0.1)' : color === 'green' ? 'rgba(16, 185, 129, 0.1)' : color === 'orange' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            color: color === 'red' ? '#EF4444' : color === 'green' ? '#10B981' : color === 'orange' ? '#F59E0B' : '#3B82F6',
            border: `1px solid ${color === 'red' ? 'rgba(239, 68, 68, 0.2)' : color === 'green' ? 'rgba(16, 185, 129, 0.2)' : color === 'orange' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
          }}
        >
          {title}
        </Badge>
      </Group>
      <Title order={2} mb="xs" c="#F3F4F6">
        {value}
      </Title>
      {subtitle && (
        <Text size="sm" c="#9CA3AF">
          {subtitle}
        </Text>
      )}
      {progress !== undefined && (
        <Progress 
          value={progress} 
          color={color} 
          size="sm" 
          mt="md"
          styles={{
            root: {
              background: '#1F2937',
            },
          }}
        />
      )}
    </Card>
  </motion.div>
);

export function DashboardTemplate({ 
  stats, 
  recentActivity, 
  quickActions, 
  progressOverview 
}: DashboardTemplateProps) {
  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Title order={1} mb="xl" c="#F3F4F6">
          Dashboard
        </Title>
      </motion.div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </SimpleGrid>

      {/* Main Content Grid */}
      <Grid gutter="lg">
        {/* Left Column */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {/* Progress Overview */}
            {progressOverview && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Paper 
                  shadow="sm" 
                  p="xl" 
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, #111317 0%, #16181D 100%)',
                    border: '1px solid #1F2937',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Title order={3} mb="md" c="#F3F4F6">
                    Your Progress
                  </Title>
                  {progressOverview}
                </Paper>
              </motion.div>
            )}

            {/* Recent Activity */}
            {recentActivity && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Paper 
                  shadow="sm" 
                  p="xl" 
                  radius="md"
                  style={{
                    background: 'linear-gradient(135deg, #111317 0%, #16181D 100%)',
                    border: '1px solid #1F2937',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Title order={3} mb="md" c="#F3F4F6">
                    Recent Activity
                  </Title>
                  {recentActivity}
                </Paper>
              </motion.div>
            )}
          </Stack>
        </Grid.Col>

        {/* Right Column */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          {quickActions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Paper 
                shadow="sm" 
                p="xl" 
                radius="md" 
                style={{ 
                  position: 'sticky', 
                  top: 20,
                  background: 'linear-gradient(135deg, #111317 0%, #16181D 100%)',
                  border: '1px solid #1F2937',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Title order={3} mb="md" c="#F3F4F6">
                  Quick Actions
                </Title>
                {quickActions}
              </Paper>
            </motion.div>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

'use client';

import { Container, Card, Title, Text, Group, Stack, Button, Badge, Stepper } from '@mantine/core';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NegotiationStep {
  label: string;
  description: string;
  content: ReactNode;
}

interface NegotiationTemplateProps {
  title: string;
  scenario: string;
  currentStep: number;
  steps: NegotiationStep[];
  onStepChange: (step: number) => void;
  sidebar?: ReactNode;
}

export function NegotiationTemplate({
  title,
  scenario,
  currentStep,
  steps,
  onStepChange,
  sidebar,
}: NegotiationTemplateProps) {
  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card shadow="sm" padding="xl" radius="md" mb="xl">
          <Group justify="space-between" mb="md">
            <div>
              <Badge color="blue" variant="light" mb="xs">
                Contract Negotiation Simulator
              </Badge>
              <Title order={1}>{title}</Title>
            </div>
          </Group>
          <Text c="dimmed">{scenario}</Text>
        </Card>
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
            <Stepper 
              active={currentStep} 
              onStepClick={onStepChange}
              breakpoint="sm"
              mb="xl"
            >
              {steps.map((step, index) => (
                <Stepper.Step
                  key={index}
                  label={step.label}
                  description={step.description}
                >
                  {step.content}
                </Stepper.Step>
              ))}
            </Stepper>

            <Group justify="space-between" mt="xl">
              <Button
                variant="outline"
                onClick={() => onStepChange(currentStep - 1)}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button
                onClick={() => onStepChange(currentStep + 1)}
                disabled={currentStep === steps.length - 1}
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next Step'}
              </Button>
            </Group>
          </Card>
        </motion.div>

        {/* Sidebar */}
        {sidebar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div style={{ position: 'sticky', top: 20 }}>
              <Card shadow="sm" padding="lg" radius="md">
                {sidebar}
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </Container>
  );
}

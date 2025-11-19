'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Button, 
  Group, 
  Stack,
  Badge,
  SimpleGrid,
  Tabs,
  TextInput,
  Select,
  Checkbox,
  Modal,
  Divider,
  Alert,
  Progress,
} from '@mantine/core';
import { 
  IconBook, 
  IconCards, 
  IconBrain,
  IconInfoCircle,
  IconCheck,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';
import { StatCard, FeatureCard, LoadingState, ErrorState } from '@/components/ui';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function ExamplePage() {
  const [modalOpened, setModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleShowNotification = () => {
    notifications.show({
      title: 'Success!',
      message: 'This is how notifications work in Mantine',
      color: 'green',
      icon: <IconCheck size={18} />,
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState message="Loading example..." />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState
          message="Failed to load example page"
          onRetry={() => setError(false)}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container size="xl" py="xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <Stack gap="md" mb="xl">
            <Badge color="blue" size="lg">Example Components</Badge>
            <Title order={1}>AgentPrep UI Component Showcase</Title>
            <Text size="lg" c="dimmed">
              This page demonstrates all the components and patterns available in your new UI system.
            </Text>
          </Stack>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <Title order={2} mb="md">Stat Cards</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={<IconBook size={24} />}
                title="Questions"
                value="247"
                subtitle="832 total"
                color="blue"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={<IconCards size={24} />}
                title="Flashcards"
                value="1,203"
                subtitle="3,060 total"
                color="red"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={<IconBrain size={24} />}
                title="Success Rate"
                value="84%"
                subtitle="+12% this week"
                color="green"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <StatCard
                icon={<IconCheck size={24} />}
                title="Streak"
                value="7 days"
                subtitle="Keep going!"
                color="orange"
              />
            </motion.div>
          </SimpleGrid>
        </motion.div>

        {/* Feature Cards */}
        <Title order={2} mb="md">Feature Cards</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
          <FeatureCard
            title="Study Mode"
            description="Practice with 832 real questions covering all CBA topics."
            icon={<IconBook size={32} />}
            color="blue"
            href="/study"
          />
          <FeatureCard
            title="Flashcards"
            description="Study with 3,060 AI-generated flashcards."
            icon={<IconCards size={32} />}
            color="red"
            badge="NEW"
            href="/flashcards"
          />
          <FeatureCard
            title="Scenarios"
            description="Practice with real-world agent situations."
            icon={<IconBrain size={32} />}
            color="blue"
            href="/scenarios"
          />
        </SimpleGrid>

        {/* Buttons and Actions */}
        <Title order={2} mb="md">Buttons & Actions</Title>
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Stack gap="lg">
            <div>
              <Text size="sm" fw={600} mb="xs">Button Variants</Text>
              <Group gap="md">
                <Button color="blue">Primary</Button>
                <Button color="red">Secondary</Button>
                <Button variant="outline" color="blue">Outline</Button>
                <Button variant="light" color="red">Light</Button>
                <Button variant="subtle" color="gray">Subtle</Button>
              </Group>
            </div>

            <div>
              <Text size="sm" fw={600} mb="xs">Button Sizes</Text>
              <Group gap="md" align="center">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </Group>
            </div>

            <div>
              <Text size="sm" fw={600} mb="xs">Button States</Text>
              <Group gap="md">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button leftSection={<IconBook size={18} />}>With Icon</Button>
              </Group>
            </div>
          </Stack>
        </Card>

        {/* Forms */}
        <Title order={2} mb="md">Form Components</Title>
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Stack gap="md">
            <TextInput
              label="Text Input"
              placeholder="Enter your name"
              description="This is a helper text"
            />
            <Select
              label="Select Dropdown"
              placeholder="Choose an option"
              data={['Option 1', 'Option 2', 'Option 3']}
            />
            <Checkbox label="I agree to terms and conditions" />
            <Button color="blue">Submit</Button>
          </Stack>
        </Card>

        {/* Tabs */}
        <Title order={2} mb="md">Tabs</Title>
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Tabs defaultValue="first" variant="pills">
            <Tabs.List>
              <Tabs.Tab value="first">First Tab</Tabs.Tab>
              <Tabs.Tab value="second">Second Tab</Tabs.Tab>
              <Tabs.Tab value="third">Third Tab</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="first" pt="md">
              <Text>Content for first tab</Text>
            </Tabs.Panel>
            <Tabs.Panel value="second" pt="md">
              <Text>Content for second tab</Text>
            </Tabs.Panel>
            <Tabs.Panel value="third" pt="md">
              <Text>Content for third tab</Text>
            </Tabs.Panel>
          </Tabs>
        </Card>

        {/* Alerts */}
        <Title order={2} mb="md">Alerts & Notifications</Title>
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size={18} />} title="Info Alert" color="blue">
              This is an informational message.
            </Alert>
            <Alert icon={<IconCheck size={18} />} title="Success Alert" color="green">
              Your action was completed successfully!
            </Alert>
            <Alert icon={<IconInfoCircle size={18} />} title="Warning Alert" color="yellow">
              Please review this information carefully.
            </Alert>
            <Button onClick={handleShowNotification}>
              Show Notification
            </Button>
          </Stack>
        </Card>

        {/* Progress Bars */}
        <Title order={2} mb="md">Progress Indicators</Title>
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Stack gap="lg">
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Overall Progress</Text>
                <Text size="sm" c="dimmed">67%</Text>
              </Group>
              <Progress value={67} color="blue" size="lg" />
            </div>
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Salary Cap</Text>
                <Badge color="green">Mastered</Badge>
              </Group>
              <Progress value={92} color="green" />
            </div>
            <div>
              <Group justify="space-between" mb="xs">
                <Text size="sm">Luxury Tax</Text>
                <Badge color="blue">In Progress</Badge>
              </Group>
              <Progress value={68} color="blue" />
            </div>
          </Stack>
        </Card>

        {/* Modals */}
        <Title order={2} mb="md">Modals</Title>
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Button onClick={() => setModalOpened(true)}>Open Modal</Button>
          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title="Example Modal"
            size="lg"
          >
            <Stack gap="md">
              <Text>This is a modal component. It can contain any content you want.</Text>
              <TextInput label="Sample Input" placeholder="Enter something" />
              <Group justify="flex-end">
                <Button variant="outline" onClick={() => setModalOpened(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setModalOpened(false)}>
                  Confirm
                </Button>
              </Group>
            </Stack>
          </Modal>
        </Card>

        {/* Animations Demo */}
        <Title order={2} mb="md">Animation Examples</Title>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
          <motion.div variants={fadeInLeft} initial="hidden" animate="visible">
            <Card shadow="sm" padding="lg" radius="md">
              <Text fw={600} mb="xs">Fade In Left</Text>
              <Text size="sm" c="dimmed">This card slides in from the left</Text>
            </Card>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <Card shadow="sm" padding="lg" radius="md">
              <Text fw={600} mb="xs">Fade In Up</Text>
              <Text size="sm" c="dimmed">This card slides in from below</Text>
            </Card>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" animate="visible">
            <Card shadow="sm" padding="lg" radius="md">
              <Text fw={600} mb="xs">Fade In Right</Text>
              <Text size="sm" c="dimmed">This card slides in from the right</Text>
            </Card>
          </motion.div>
        </SimpleGrid>

        {/* Loading & Error States */}
        <Title order={2} mb="md">Loading & Error States</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
          <Card shadow="sm" padding="lg" radius="md">
            <Text fw={600} mb="md">Loading State</Text>
            <Button onClick={() => setLoading(true)}>Show Loading</Button>
          </Card>
          <Card shadow="sm" padding="lg" radius="md">
            <Text fw={600} mb="md">Error State</Text>
            <Button color="red" onClick={() => setError(true)}>Show Error</Button>
          </Card>
        </SimpleGrid>

        {/* Final Note */}
        <Alert icon={<IconInfoCircle size={18} />} color="blue" variant="light">
          <Text size="sm">
            This is just a sample of what's available. Check the Mantine documentation at 
            <Text span c="blue" fw={600}> mantine.dev </Text>
            for the complete component library.
          </Text>
        </Alert>
      </Container>
    </AppLayout>
  );
}

'use client';

import { AppShell, Burger, Group, Text, Avatar, Menu, UnstyledButton, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconDashboard,
  IconBook,
  IconCards,
  IconBrain,
  IconFileText,
  IconHistory,
  IconNotes,
  IconLogout,
  IconSettings,
  IconUser,
  IconChevronDown,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  color: string;
}

const navItems: NavItem[] = [
  { 
    label: 'Dashboard', 
    icon: <IconDashboard size={20} />, 
    href: '/dashboard', 
    color: 'blue' 
  },
  { 
    label: 'Study Mode', 
    icon: <IconBook size={20} />, 
    href: '/study', 
    color: 'blue' 
  },
  { 
    label: 'Flashcards', 
    icon: <IconCards size={20} />, 
    href: '/flashcards', 
    color: 'red' 
  },
  { 
    label: 'Scenarios', 
    icon: <IconBrain size={20} />, 
    href: '/scenarios', 
    color: 'blue' 
  },
  { 
    label: 'Study Guide', 
    icon: <IconFileText size={20} />, 
    href: '/guide', 
    color: 'blue' 
  },
  { 
    label: 'AI Test Generator', 
    icon: <IconBrain size={20} />, 
    href: '/ai-generator', 
    color: 'blue' 
  },
  { 
    label: 'My Tests', 
    icon: <IconHistory size={20} />, 
    href: '/my-tests', 
    color: 'blue' 
  },
  { 
    label: 'Notes', 
    icon: <IconNotes size={20} />, 
    href: '/notes', 
    color: 'blue' 
  },
];

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 280, 
        breakpoint: 'sm', 
        collapsed: { mobile: !opened } 
      }}
      padding="md"
      styles={{
        main: {
          background: '#0B0C10',
        },
        header: {
          background: '#111317',
          borderBottom: '1px solid #1F2937',
        },
        navbar: {
          background: '#111317',
          borderRight: '1px solid #1F2937',
        }
      }}
    >
      {/* Header */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="#F3F4F6" />
            <Group gap="xs">
              {/* Stadium Logo */}
              <div className="relative h-8 w-8 transition-transform hover:scale-110 flex items-center justify-center">
                <img 
                  src="/stadium-logo.png" 
                  alt="StadiumU Logo" 
                  style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                />
              </div>
              <Text 
                size="xl" 
                fw={900} 
                style={{
                  background: 'linear-gradient(to right, #EF4444, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                StadiumU
              </Text>
            </Group>
          </Group>

          {/* User Menu */}
          <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar 
                    style={{ background: 'linear-gradient(135deg, #EF4444 0%, #3B82F6 100%)' }}
                    radius="xl" 
                    size="md"
                  >
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500} c="#F3F4F6">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Agent Student'}
                    </Text>
                    <Text c="#9CA3AF" size="xs">
                      {user?.email || 'agent@stadiumU.com'}
                    </Text>
                  </div>
                  <IconChevronDown size={16} color="#9CA3AF" />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown style={{ background: '#16181D', border: '1px solid #1F2937' }}>
              <Menu.Label style={{ color: '#9CA3AF' }}>Account</Menu.Label>
              <Link href="/profile" style={{ textDecoration: 'none' }}>
                <Menu.Item 
                  leftSection={<IconUser size={16} />}
                  style={{ color: '#F3F4F6' }}
                >
                  Profile
                </Menu.Item>
              </Link>
              <Link href="/settings" style={{ textDecoration: 'none' }}>
                <Menu.Item 
                  leftSection={<IconSettings size={16} />}
                  style={{ color: '#F3F4F6' }}
                >
                  Settings
                </Menu.Item>
              </Link>
              
              <Menu.Divider style={{ borderColor: '#1F2937' }} />
              
              <Menu.Item 
                color="red" 
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
                style={{ color: '#EF4444' }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      {/* Sidebar Navigation */}
      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: rem(8) }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ textDecoration: 'none' }}
                >
                  <UnstyledButton
                    w="100%"
                    p="sm"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: isActive 
                        ? (item.color === 'red' ? '#EF4444' : '#3B82F6')
                        : 'transparent',
                      color: isActive ? '#FFFFFF' : '#9CA3AF',
                      transition: 'all 0.2s ease',
                      border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#16181D';
                        e.currentTarget.style.color = '#F3F4F6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9CA3AF';
                      }
                    }}
                  >
                    <Group gap="sm">
                      {item.icon}
                      <Text size="sm" fw={500}>
                        {item.label}
                      </Text>
                    </Group>
                  </UnstyledButton>
                </Link>
              );
            })}
          </div>
        </AppShell.Section>

        <AppShell.Section>
          <div 
            style={{ 
              padding: rem(16), 
              borderTop: '1px solid #1F2937',
              marginTop: rem(16)
            }}
          >
            <Text size="xs" c="#6B7280" ta="center">
              © 2025 StadiumU
            </Text>
            <Text size="xs" c="#6B7280" ta="center" mt={4}>
              NBA CBA Study Platform
            </Text>
          </div>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* Main Content */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

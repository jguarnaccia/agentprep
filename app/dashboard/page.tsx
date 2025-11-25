'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import { useDashboardData } from '@/lib/hooks/useDashboardData';
import DueForReviewWidget from '@/components/dashboard/DueForReviewWidget';
import AchievementsSection from '@/components/dashboard/AchievementsSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  Award,
  Clock,
  Zap,
  FileText,
  History,
  ChevronRight,
  Flame,
  CheckCircle2,
  Circle
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, recentActivity, loading, error } = useDashboardData();

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="relative mb-6 h-16 w-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
              </div>
              <p className="text-gray-400 text-lg">Loading your dashboard...</p>
            </motion.div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="min-h-screen bg-[#0B0C10] p-6">
            <Card className="border-red-900/30 bg-gradient-to-br from-red-950/20 to-gray-950/80">
              <CardContent className="p-6 text-center">
                <p className="text-red-400">Error loading dashboard: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Agent';
  const greeting = getGreeting();

  const studySections = [
    {
      title: 'Study Mode',
      description: 'Adaptive learning with mastery tracking',
      icon: <BookOpen className="h-6 w-6" />,
      href: '/study',
      color: 'from-blue-500 to-blue-600',
      stats: `${stats?.questionsAnswered || 0} answered`,
    },
    {
      title: 'Flashcards',
      description: '3D flip cards with progress tracking',
      icon: <Zap className="h-6 w-6" />,
      href: '/flashcards',
      color: 'from-red-500 to-red-600',
      stats: `${stats?.flashcardsMastered || 0} mastered`,
    },
    {
      title: 'Scenarios',
      description: 'Real-world case studies and situations',
      icon: <Brain className="h-6 w-6" />,
      href: '/scenarios',
      color: 'from-purple-500 to-purple-600',
      stats: `${stats?.scenariosCompleted || 0} completed`,
    },
    {
      title: 'Study Guide',
      description: 'Full NBA CBA reference',
      icon: <FileText className="h-6 w-6" />,
      href: '/guide',
      color: 'from-green-500 to-green-600',
      stats: 'All 42 articles',
    },
    {
      title: 'AI Test Generator',
      description: 'Create custom practice tests',
      icon: <Target className="h-6 w-6" />,
      href: '/ai-generator',
      color: 'from-indigo-500 to-indigo-600',
      stats: 'Unlimited tests',
    },
    {
      title: 'My Tests',
      description: 'View your test history and analytics',
      icon: <History className="h-6 w-6" />,
      href: '/my-tests',
      color: 'from-yellow-500 to-yellow-600',
      stats: `${stats?.testsCompleted || 0} taken`,
    },
  ];

  const mainStats = [
    {
      label: 'Questions Answered',
      value: stats?.questionsAnswered || 0,
      total: 832,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      percentage: Math.round(((stats?.questionsAnswered || 0) / 832) * 100),
    },
    {
      label: 'Flashcards Mastered',
      value: stats?.flashcardsMastered || 0,
      total: 3060,
      icon: <Zap className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      percentage: Math.round(((stats?.flashcardsMastered || 0) / 3060) * 100),
    },
    {
      label: 'Average Test Score',
      value: `${stats?.averageTestScore || 0}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Study Streak',
      value: `${stats?.studyStreak || 0} days`,
      icon: <Flame className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-[#0B0C10] p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-gray-400">Here's your study progress overview</p>
            </motion.div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mainStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl hover:border-blue-500/30 transition-all">
                    <CardContent className="p-6">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 mb-4`}>
                        <div className="text-white">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        {stat.label}
                      </div>
                      {stat.total && (
                        <>
                          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                              style={{ width: `${stat.percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            {stat.percentage}% of {stat.total}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* SRS Due for Review Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <DueForReviewWidget />
            </motion.div>

            {/* Achievements Section */}
            <AchievementsSection />

            {/* Mastery Breakdown */}
            {stats && (stats.masteryBreakdown.new > 0 || stats.masteryBreakdown.mastered > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Mastery Progress</h2>
                <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                        <div className="text-3xl font-bold text-gray-500 mb-1">
                          {stats.masteryBreakdown.new}
                        </div>
                        <div className="text-sm text-gray-400">New</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div className="text-3xl font-bold text-yellow-400 mb-1">
                          {stats.masteryBreakdown.learning}
                        </div>
                        <div className="text-sm text-gray-400">Learning</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <div className="text-3xl font-bold text-blue-400 mb-1">
                          {stats.masteryBreakdown.reviewing}
                        </div>
                        <div className="text-sm text-gray-400">Reviewing</div>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="text-3xl font-bold text-green-400 mb-1">
                          {stats.masteryBreakdown.mastered}
                        </div>
                        <div className="text-sm text-gray-400">Mastered</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Study Sections Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Study Sections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studySections.map((section, index) => (
                  <Link key={index} href={section.href}>
                    <Card className="h-full border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl hover:border-blue-500/30 transition-all hover:-translate-y-1 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${section.color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform`}>
                          <div className="text-white">
                            {section.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {section.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{section.stats}</span>
                          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
              <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                <CardContent className="p-6">
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div 
                          key={activity.id}
                          className="flex items-start gap-4 p-4 rounded-lg bg-gray-800/30 border border-gray-800 hover:border-gray-700 transition-all"
                        >
                          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{activity.description}</p>
                            <p className="text-sm text-gray-500">
                              {formatTimestamp(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
                        <Clock className="h-8 w-8 text-gray-600" />
                      </div>
                      <p className="text-gray-400 mb-2">No recent activity</p>
                      <p className="text-sm text-gray-600 mb-4">
                        Start studying to see your activity here
                      </p>
                      <Link href="/study">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Start Studying
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

// Helper functions
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getActivityIcon(type: string) {
  const iconClass = "h-5 w-5 text-white";
  switch (type) {
    case 'question':
      return <BookOpen className={iconClass} />;
    case 'flashcard':
      return <Zap className={iconClass} />;
    case 'test':
      return <Award className={iconClass} />;
    case 'note':
      return <FileText className={iconClass} />;
    case 'scenario':
      return <Brain className={iconClass} />;
    default:
      return <Circle className={iconClass} />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'question':
      return 'bg-blue-500/20 border border-blue-500/30';
    case 'flashcard':
      return 'bg-red-500/20 border border-red-500/30';
    case 'test':
      return 'bg-green-500/20 border border-green-500/30';
    case 'note':
      return 'bg-yellow-500/20 border border-yellow-500/30';
    case 'scenario':
      return 'bg-purple-500/20 border border-purple-500/30';
    default:
      return 'bg-gray-500/20 border border-gray-500/30';
  }
}

function formatTimestamp(timestamp: Date) {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return timestamp.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

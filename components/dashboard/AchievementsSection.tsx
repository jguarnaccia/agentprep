'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { useAchievements } from '@/lib/hooks/useAchievements';

export default function AchievementsSection() {
  const { achievements, loading } = useAchievements();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const achievementCards = [
    {
      id: 'streak_master',
      title: 'Streak Master (Tier 1)',
      icon: <Flame className="h-6 w-6" />,
      current: achievements?.currentStreak || 0,
      target: 7,
      unit: 'days',
      barColor: '#f97316', // Orange
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      textColor: 'text-orange-400',
    },
    {
      id: 'question_crusher',
      title: 'Question Crusher (Tier 1)',
      icon: <CheckCircle2 className="h-6 w-6" />,
      current: achievements?.questionsThisWeek || 0,
      target: 50,
      unit: 'this week',
      barColor: '#3b82f6', // Blue
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400',
    },
    {
      id: 'accuracy_expert',
      title: 'Accuracy Expert (Tier 1)',
      icon: <TrendingUp className="h-6 w-6" />,
      current: achievements?.overallAccuracy || 0,
      target: 70,
      unit: '%',
      barColor: '#10b981', // Green
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      textColor: 'text-green-400',
    },
    {
      id: 'study_champion',
      title: 'Study Champion (Tier 1)',
      icon: <Award className="h-6 w-6" />,
      current: achievements?.studySessionsThisWeek || 0,
      target: 5,
      unit: 'sessions',
      barColor: '#a855f7', // Purple
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Recent Achievements</h2>
          <p className="text-gray-400 text-sm">Your latest milestones</p>
        </div>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievementCards.map((achievement, index) => {
          // Calculate progress as percentage of target
          const progress = Math.min((achievement.current / achievement.target) * 100, 100);
          const remaining = Math.max(achievement.target - achievement.current, 0);
          const isCompleted = achievement.current >= achievement.target;
          
          // Debug logging
          console.log(`${achievement.title}: ${achievement.current}/${achievement.target} = ${progress.toFixed(1)}% filled`);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className={`border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl hover:border-gray-700 transition-all ${achievement.borderColor} overflow-hidden`}>
                <CardContent className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${achievement.bgColor} ${achievement.borderColor} border`}>
                        <div className={achievement.textColor}>
                          {achievement.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base">
                          {achievement.title}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {achievement.current}/{achievement.target}
                      </div>
                      <div className="text-xs text-gray-500">
                        {achievement.unit}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: achievement.barColor
                        }}
                      />
                    </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-sm text-gray-400">
                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Achievement unlocked!
                      </span>
                    ) : achievement.unit === 'days' ? (
                      `${remaining} more ${remaining === 1 ? 'day' : 'days'} to unlock`
                    ) : achievement.unit === '%' ? (
                      `${remaining}% more needed`
                    ) : (
                      `${remaining} more ${achievement.unit}`
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock,
  Edit2,
  Save,
  X
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = [
    {
      icon: <Award className="h-6 w-6" />,
      label: 'Questions Completed',
      value: '0',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: 'Study Streak',
      value: '0 days',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Total Study Time',
      value: '0 hrs',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Award className="h-6 w-6" />,
      label: 'Flashcards Mastered',
      value: '0',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="min-h-screen bg-[#0B0C10] p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
              <p className="text-gray-400">Manage your account and view your progress</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                  <CardContent className="p-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                      <div className="relative mb-4">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {user?.email?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Name */}
                      {!isEditing ? (
                        <>
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Agent Student'}
                          </h2>
                          <Button
                            onClick={() => setIsEditing(true)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-gray-800/50"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit Name
                          </Button>
                        </>
                      ) : (
                        <div className="w-full space-y-3">
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter your full name"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpdateProfile}
                              disabled={loading}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {loading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              onClick={() => {
                                setIsEditing(false);
                                setFullName(user?.user_metadata?.full_name || '');
                                setMessage(null);
                              }}
                              variant="ghost"
                              className="flex-1 hover:bg-gray-800"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Success/Error Message */}
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-3 p-2 rounded-lg text-sm w-full text-center ${
                            message.type === 'success' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {message.text}
                        </motion.div>
                      )}
                    </div>

                    {/* Account Info */}
                    <div className="space-y-3 pt-4 border-t border-gray-800">
                      <div className="flex items-center gap-3 text-gray-400">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-white">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-500">Member Since</p>
                          <p className="text-sm text-white">
                            {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <User className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-500">Account Type</p>
                          <p className="text-sm text-white">Free Plan</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats & Activity */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl hover:border-blue-500/30 transition-all">
                          <CardContent className="p-4">
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10 mb-3`}>
                              <div className="text-white">
                                {stat.icon}
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-400">
                              {stat.label}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
                          <Clock className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 mb-2">No recent activity</p>
                        <p className="text-sm text-gray-600">
                          Start studying to see your activity here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
                          <Award className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-gray-400 mb-2">No achievements yet</p>
                        <p className="text-sm text-gray-600">
                          Complete your first study session to earn achievements
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

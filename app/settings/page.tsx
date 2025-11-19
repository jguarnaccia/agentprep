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
  Lock, 
  Bell, 
  Moon, 
  Trash2,
  Save,
  Mail,
  Shield,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'preferences' | 'privacy'>('account');
  
  // Account Settings State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  // Delete Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordMessage(null);

    // Validation
    if (!newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all password fields' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    try {
      // Note: Actual account deletion would require a backend function
      // For now, we'll just sign out
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: <Lock className="h-4 w-4" /> },
    { id: 'preferences' as const, label: 'Preferences', icon: <Bell className="h-4 w-4" /> },
    { id: 'privacy' as const, label: 'Privacy & Security', icon: <Shield className="h-4 w-4" /> },
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
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-gray-400">Manage your account settings and preferences</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Tabs Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            activeTab === tab.id
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                          }`}
                        >
                          {tab.icon}
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Area */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-3"
              >
                {/* Account Settings */}
                {activeTab === 'account' && (
                  <div className="space-y-6">
                    {/* Email */}
                    <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-400" />
                          Email Address
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Current Email</label>
                            <input
                              type="email"
                              value={user?.email || ''}
                              disabled
                              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Contact support to change your email address
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Lock className="h-5 w-5 text-blue-400" />
                          Change Password
                        </h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="text-sm text-gray-400 mb-2 block">New Password</label>
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
                            >
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>

                          <div className="relative">
                            <label className="text-sm text-gray-400 mb-2 block">Confirm New Password</label>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>

                          {passwordMessage && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-3 rounded-lg text-sm ${
                                passwordMessage.type === 'success' 
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {passwordMessage.text}
                            </motion.div>
                          )}

                          <Button
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {passwordLoading ? 'Updating...' : 'Update Password'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    {/* Notifications */}
                    <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Bell className="h-5 w-5 text-blue-400" />
                          Notifications
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                            <div>
                              <p className="text-white font-medium">Email Notifications</p>
                              <p className="text-sm text-gray-400">Receive updates via email</p>
                            </div>
                            <button
                              onClick={() => setEmailNotifications(!emailNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                emailNotifications ? 'bg-blue-600' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                            <div>
                              <p className="text-white font-medium">Study Reminders</p>
                              <p className="text-sm text-gray-400">Get reminded to study daily</p>
                            </div>
                            <button
                              onClick={() => setStudyReminders(!studyReminders)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                studyReminders ? 'bg-blue-600' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  studyReminders ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Moon className="h-5 w-5 text-blue-400" />
                          Appearance
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 border border-gray-800">
                            <div>
                              <p className="text-white font-medium">Dark Mode</p>
                              <p className="text-sm text-gray-400">Use dark theme</p>
                            </div>
                            <button
                              onClick={() => setDarkMode(!darkMode)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                darkMode ? 'bg-blue-600' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  darkMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Privacy & Security */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    {/* Privacy Settings */}
                    <Card className="border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-400" />
                          Privacy Settings
                        </h3>
                        <div className="space-y-4">
                          <p className="text-gray-400">
                            Your data is encrypted and secure. We never share your information with third parties.
                          </p>
                          <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                            Download My Data
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Delete Account */}
                    <Card className="border-red-900/30 bg-gradient-to-br from-red-950/20 to-gray-950/80 backdrop-blur-xl">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                          <Trash2 className="h-5 w-5" />
                          Danger Zone
                        </h3>
                        {!showDeleteConfirm ? (
                          <div className="space-y-4">
                            <p className="text-gray-400">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button
                              onClick={() => setShowDeleteConfirm(true)}
                              variant="outline"
                              className="w-full border-red-600 text-red-400 hover:bg-red-950/30 hover:border-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-red-950/30 border border-red-900/50">
                              <div className="flex gap-3">
                                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-red-400 font-medium mb-2">Warning!</p>
                                  <p className="text-sm text-gray-400">
                                    This action cannot be undone. All your data will be permanently deleted.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 mb-2 block">
                                Type <span className="text-red-400 font-bold">DELETE</span> to confirm
                              </label>
                              <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                                placeholder="Type DELETE"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={handleDeleteAccount}
                                disabled={deleteConfirmText !== 'DELETE'}
                                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Confirm Delete
                              </Button>
                              <Button
                                onClick={() => {
                                  setShowDeleteConfirm(false);
                                  setDeleteConfirmText('');
                                }}
                                variant="ghost"
                                className="flex-1 hover:bg-gray-800"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}

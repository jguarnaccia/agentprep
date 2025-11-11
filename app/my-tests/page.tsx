'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { History, Calendar, Target, Award, ChevronRight, Sparkles } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

interface TestResult {
  id: string;
  session_id: string;
  answers: number[];
  score: number;
  total_questions: number;
  completed_at: string;
  test_config?: {
    topics: string[];
    difficulty: string;
    question_count: number;
  };
  questions?: any[];
}

export default function MyTests() {
  const router = useRouter();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    totalQuestions: 0,
    bestScore: 0
  });

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    setIsLoading(true);
    try {
      // Fetch all test results with their session data
      const { data: results, error } = await supabase
        .from('ai_test_results')
        .select(`
          *,
          ai_test_sessions_v2!inner (
            test_config,
            questions
          )
        `)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error loading tests:', error);
        return;
      }

      // Transform the data
      const transformedTests = results?.map((result: any) => ({
        id: result.id,
        session_id: result.session_id,
        answers: result.answers,
        score: result.score,
        total_questions: result.total_questions,
        completed_at: result.completed_at,
        test_config: result.ai_test_sessions_v2.test_config,
        questions: result.ai_test_sessions_v2.questions
      })) || [];

      setTests(transformedTests);

      // Calculate stats
      if (transformedTests.length > 0) {
        const totalTests = transformedTests.length;
        const totalScore = transformedTests.reduce((sum, t) => sum + t.score, 0);
        const totalQs = transformedTests.reduce((sum, t) => sum + t.total_questions, 0);
        const avgScore = Math.round((totalScore / totalQs) * 100);
        const bestPercentage = Math.max(
          ...transformedTests.map(t => Math.round((t.score / t.total_questions) * 100))
        );

        setStats({
          totalTests,
          averageScore: avgScore,
          totalQuestions: totalQs,
          bestScore: bestPercentage
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewTest = (test: TestResult) => {
    // Store test data in sessionStorage to view details
    sessionStorage.setItem('viewTestData', JSON.stringify(test));
    router.push(`/my-tests/${test.id}`);
  };

  const retakeTest = (test: TestResult) => {
    // Store questions in sessionStorage and navigate to test page
    if (test.questions && test.questions.length > 0) {
      sessionStorage.setItem('aiTestQuestions', JSON.stringify(test.questions));
      sessionStorage.setItem('aiTestSessionId', test.session_id);
      sessionStorage.setItem('isRetake', 'true'); // Mark as retake
      router.push('/ai-test');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getGradeBg = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500/20 border-green-400/30';
    if (percentage >= 80) return 'bg-blue-500/20 border-blue-400/30';
    if (percentage >= 70) return 'bg-yellow-500/20 border-yellow-400/30';
    return 'bg-red-500/20 border-red-400/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <div className="text-xl text-white">Loading your test history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-12 h-12 text-red-400" />
            <h1 className="text-5xl font-bold text-white">My Test History</h1>
          </div>
          <p className="text-xl text-red-200">
            Review your past AI-generated tests and track your progress
          </p>
        </div>

        {tests.length === 0 ? (
          /* Empty State */
          <div className="bg-gradient-to-br from-white/95 via-red-50/90 to-blue-50/95 backdrop-blur-lg rounded-2xl p-16 border border-red-200/30 text-center">
            <Sparkles className="w-20 h-20 text-red-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Tests Yet</h2>
            <p className="text-gray-700 mb-8 max-w-md mx-auto">
              Generate your first AI test to start building your test history and track your progress!
            </p>
            <button
              onClick={() => router.push('/ai-generator')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Generate Your First Test
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-red-200/30">
                <div className="flex items-center gap-3 mb-2">
                  <History className="w-6 h-6 text-red-400" />
                  <span className="text-sm text-blue-200">Total Tests</span>
                </div>
                <div className="text-4xl font-bold text-white">{stats.totalTests}</div>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-blue-200/30">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-blue-200">Average Score</span>
                </div>
                <div className="text-4xl font-bold text-white">{stats.averageScore}%</div>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-red-200/30">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-6 h-6 text-red-400" />
                  <span className="text-sm text-blue-200">Best Score</span>
                </div>
                <div className="text-4xl font-bold text-white">{stats.bestScore}%</div>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-blue-200/30">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-blue-200">Questions Answered</span>
                </div>
                <div className="text-4xl font-bold text-white">{stats.totalQuestions}</div>
              </div>
            </div>

            {/* Test List */}
            <div className="space-y-4">
              {tests.map((test) => {
                const percentage = Math.round((test.score / test.total_questions) * 100);
                const topics = test.test_config?.topics || [];
                const difficulties = test.test_config?.difficulties || ['medium'];
                const formats = test.test_config?.formats || ['multiple-choice'];

                return (
                  <div
                    key={test.id}
                    className="w-full bg-gradient-to-br from-white/95 via-blue-50/90 to-red-50/95 backdrop-blur-lg rounded-xl p-6 border border-blue-200/30 hover:bg-gradient-to-br hover:from-white/98 hover:via-blue-50/95 hover:to-red-50/98 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => viewTest(test)}
                        className="flex-1 text-left group"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`px-4 py-2 rounded-lg border-2 ${getGradeBg(percentage)}`}>
                            <div className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                              {percentage}%
                            </div>
                          </div>

                          <div>
                            <div className="text-white font-bold text-lg mb-1">
                              {test.score} / {test.total_questions} Correct
                            </div>
                            <div className="flex items-center gap-3 text-sm text-blue-200">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(test.completed_at)}
                              </span>
                              <span className="capitalize">• {difficulties.join(', ')} difficulty</span>
                              <span>• {test.total_questions} questions</span>
                              <span>• {formats.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {topics.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {topics.slice(0, 3).map((topic, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-xs font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                            {topics.length > 3 && (
                              <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-lg text-xs font-medium">
                                +{topics.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </button>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retakeTest(test);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Retake
                        </button>
                        <button
                          onClick={() => viewTest(test)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
                        >
                          View
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => router.push('/ai-generator')}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Generate New Test
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all border border-red-200/30"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

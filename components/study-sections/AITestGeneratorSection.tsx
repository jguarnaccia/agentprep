'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Plus,
  Settings,
  Play,
  Clock,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { generateAITest, saveTestResult, useAuth, useTestResults } from '@/lib/hooks/useStudyData';

interface TestConfig {
  numQuestions: number;
  topics: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  includeScenarios: boolean;
}

const availableTopics = [
  'Salary Cap',
  'Luxury Tax',
  'Free Agency',
  'Trade Rules',
  'Exceptions',
  'Player Contracts',
  'Draft Rules',
  'G League'
];

export function AITestGeneratorSection() {
  const router = useRouter();
  const { user } = useAuth();
  const { tests, loading: testsLoading } = useTestResults(user?.id || '');
  
  const [config, setConfig] = useState<TestConfig>({
    numQuestions: 25,
    topics: [],
    difficulty: 'Mixed',
    includeScenarios: false
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats from past tests
  const avgScore = tests.length > 0
    ? Math.round(tests.reduce((sum, test) => sum + Math.round((test.score / test.total_questions) * 100), 0) / tests.length)
    : 0;
  const totalQuestionsAnswered = tests.reduce((sum, test) => sum + test.total_questions, 0);

  const toggleTopic = (topic: string) => {
    if (config.topics.includes(topic)) {
      setConfig({
        ...config,
        topics: config.topics.filter(t => t !== topic)
      });
    } else {
      setConfig({
        ...config,
        topics: [...config.topics, topic]
      });
    }
  };

  const handleGenerate = async () => {
    if (!user) {
      alert('Please log in to generate tests');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate test from database
      const topic = config.topics.length > 0 ? config.topics.join(', ') : 'All Topics';
      
      const result = await generateAITest({
        topic,
        difficulty: config.difficulty,
        numQuestions: config.numQuestions,
        userId: user.id
      });

      if (result.error) {
        setError(result.error);
        setIsGenerating(false);
        return;
      }

      if (result.data && result.data.length > 0) {
        // Save test configuration for the study session
        const testData = {
          user_id: user.id,
          title: `${topic} - ${config.difficulty}`,
          topic,
          difficulty: config.difficulty,
          score: 0,
          total_questions: result.data.length,
          time_taken: 0,
          questions: result.data,
          answers: []
        };

        // Store in localStorage for the study session
        localStorage.setItem('currentTest', JSON.stringify(testData));
        
        // Navigate to study mode with the generated test
        router.push('/study?mode=test');
      } else {
        setError('No questions found for the selected criteria. Please try different settings.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate test. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Please Log In</h2>
          <p className="text-slate-300">You need to be logged in to generate tests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Test Generator</h1>
          </div>
          <p className="text-slate-300">Create custom practice tests tailored to your needs</p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-lg overflow-hidden"
        >
          {/* Quick Stats Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 p-6 text-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm opacity-90">Tests Generated</p>
                <p className="text-2xl font-bold">{testsLoading ? '...' : tests.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Avg Score</p>
                <p className="text-2xl font-bold">{testsLoading ? '...' : `${avgScore}%`}</p>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-90">Total Questions</p>
                <p className="text-2xl font-bold">{testsLoading ? '...' : totalQuestionsAnswered}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Number of Questions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Target className="w-4 h-4 text-blue-400" />
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 25, 50, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => setConfig({ ...config, numQuestions: num })}
                    disabled={isGenerating}
                    className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 ${
                      config.numQuestions === num
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-2xl font-bold">{num}</p>
                    <p className="text-xs mt-1">questions</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Settings className="w-4 h-4 text-blue-400" />
                Select Topics {config.topics.length > 0 && (
                  <span className="text-xs font-normal text-blue-400">
                    ({config.topics.length} selected)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    disabled={isGenerating}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all disabled:opacity-50 ${
                      config.topics.includes(topic)
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setConfig({ ...config, topics: availableTopics })}
                disabled={isGenerating}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50"
              >
                Select All Topics
              </button>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Zap className="w-4 h-4 text-blue-400" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-3">
                {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfig({ ...config, difficulty: level })}
                    disabled={isGenerating}
                    className={`p-4 rounded-xl border-2 transition-all disabled:opacity-50 ${
                      config.difficulty === level
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <p className="font-semibold">{level}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-4">
                <Plus className="w-4 h-4 text-blue-400" />
                Additional Options
              </label>
              <label className="flex items-center gap-3 p-4 bg-slate-700 rounded-xl border border-slate-600 cursor-pointer hover:bg-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={config.includeScenarios}
                  onChange={(e) => setConfig({ ...config, includeScenarios: e.target.checked })}
                  disabled={isGenerating}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <div>
                  <p className="font-medium text-white">Include Scenario Questions</p>
                  <p className="text-sm text-slate-300">Add case-based questions for deeper understanding</p>
                </div>
              </label>
            </div>

            {/* Test Preview */}
            <div className="p-6 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl border border-slate-600">
              <h3 className="text-sm font-semibold text-white mb-3">Test Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">
                    <span className="font-semibold">{config.numQuestions}</span> questions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">
                    <span className="font-semibold">{config.difficulty}</span> difficulty
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">
                    <span className="font-semibold">
                      {config.topics.length === 0 ? 'All' : config.topics.length}
                    </span> {config.topics.length === 1 ? 'topic' : 'topics'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-300">
                    ~<span className="font-semibold">{Math.round(config.numQuestions * 1.5)}</span> minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Validation Warning */}
            {config.topics.length === 0 && (
              <div className="flex items-start gap-3 p-4 bg-blue-900/30 border border-blue-500 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">No topics selected</p>
                  <p className="text-xs text-blue-100 mt-1">
                    Test will include questions from all available topics
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-500 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Error</p>
                  <p className="text-xs text-red-100 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-red-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Test...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Test
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6"
        >
          <h3 className="text-sm font-semibold text-white mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
              <span>Select specific topics you want to focus on for targeted practice</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></span>
              <span>Use "Mixed" difficulty to get a realistic assessment of your knowledge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
              <span>Start with 25 questions for a balanced practice session</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></span>
              <span>Review your test history in "My Tests" to track improvement</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

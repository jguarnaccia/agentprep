'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Calendar, Target, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  citation: string;
  topic: string;
  difficulty: string;
}

interface TestData {
  id: string;
  session_id: string;
  answers: number[];
  score: number;
  total_questions: number;
  completed_at: string;
  test_config?: {
    topics: string[];
    difficulties?: string[];
    difficulty?: string;
    formats?: string[];
    question_count: number;
  };
  questions?: Question[];
}

export default function TestDetail() {
  const router = useRouter();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load test data from sessionStorage
    const stored = sessionStorage.getItem('viewTestData');
    if (!stored) {
      router.push('/my-tests');
      return;
    }

    const data = JSON.parse(stored);
    setTestData(data);
    setIsLoading(false);
  }, [router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (isLoading || !testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <div className="text-xl text-white">Loading test details...</div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((testData.score / testData.total_questions) * 100);
  const questions = testData.questions || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/my-tests')}
          className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Test History
        </button>

        {/* Test Summary Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Test Results</h1>
              <div className="flex items-center gap-3 text-blue-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(testData.completed_at)}
                </span>
                {testData.test_config && (
                  <>
                    <span>•</span>
                    <span className="capitalize">
                      {testData.test_config.difficulties ? testData.test_config.difficulties.join(', ') : 'medium'} difficulty
                    </span>
                    {testData.test_config.formats && testData.test_config.formats.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{testData.test_config.formats.join(', ')}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-6xl font-bold text-white mb-2">{percentage}%</div>
              <div className="text-blue-200">
                {testData.score} / {testData.total_questions} Correct
              </div>
            </div>
          </div>

          {/* Topics */}
          {testData.test_config?.topics && testData.test_config.topics.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-blue-200 mb-2">Topics Covered:</div>
              <div className="flex flex-wrap gap-2">
                {testData.test_config.topics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-400/30 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">{testData.score}</div>
              <div className="text-sm text-green-200">Correct</div>
            </div>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-400/30 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-400">{testData.total_questions - testData.score}</div>
              <div className="text-sm text-red-200">Incorrect</div>
            </div>
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{testData.total_questions}</div>
              <div className="text-sm text-blue-200">Total</div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white mb-4">Question Review</h2>
          
          {questions.map((question, qIndex) => {
            const userAnswer = testData.answers[qIndex];
            const isCorrect = userAnswer === question.correct;

            return (
              <div
                key={question.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 ${
                  isCorrect
                    ? 'border-green-400/30'
                    : 'border-red-400/30'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0 ${
                    isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {qIndex + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                      <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      <span className="text-blue-200 text-sm">•</span>
                      <span className="text-blue-200 text-sm capitalize">{question.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-relaxed">
                      {question.question}
                    </h3>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => {
                    const isUserAnswer = userAnswer === optIndex;
                    const isCorrectAnswer = optIndex === question.correct;
                    
                    let bgColor = 'bg-white/5';
                    let borderColor = 'border-white/20';
                    let textColor = 'text-white/70';
                    
                    if (isCorrectAnswer) {
                      bgColor = 'bg-green-500/20';
                      borderColor = 'border-green-400/50';
                      textColor = 'text-green-300';
                    } else if (isUserAnswer && !isCorrect) {
                      bgColor = 'bg-red-500/20';
                      borderColor = 'border-red-400/50';
                      textColor = 'text-red-300';
                    }

                    return (
                      <div
                        key={optIndex}
                        className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${textColor}`}>{option}</span>
                          {isCorrectAnswer && (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          )}
                          {isUserAnswer && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-400/30">
                  <h4 className="text-blue-300 font-bold mb-2">Explanation</h4>
                  <p className="text-white/90 leading-relaxed mb-3">
                    {question.explanation}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-200">
                    <span className="font-medium">Source:</span>
                    <span>{question.citation}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              // Retake this test
              if (testData.questions && testData.questions.length > 0) {
                sessionStorage.setItem('aiTestQuestions', JSON.stringify(testData.questions));
                sessionStorage.setItem('aiTestSessionId', testData.session_id);
                sessionStorage.setItem('isRetake', 'true');
                router.push('/ai-test');
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Retake This Test
          </button>
          <button
            onClick={() => router.push('/my-tests')}
            className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
          >
            Back to History
          </button>
          <button
            onClick={() => router.push('/ai-generator')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Generate New Test
          </button>
        </div>
      </div>
    </div>
  );
}

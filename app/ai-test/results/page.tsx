'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TestResults {
  config: {
    topic: string;
    difficulty: string;
    questionCount: number;
    questionFormat: string;
  };
  questions: Question[];
  userAnswers: number[];
  timeSpent: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<TestResults | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const data = sessionStorage.getItem('aiTestResults');
    if (!data) {
      router.push('/ai-test');
      return;
    }
    setResults(JSON.parse(data));
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  const correctAnswers = results.userAnswers.filter(
    (answer, index) => answer === results.questions[index].correct
  ).length;
  const totalQuestions = results.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - correctAnswers;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (score >= 90) return 'Outstanding! 🌟';
    if (score >= 80) return 'Great job! 🎉';
    if (score >= 70) return 'Good work! 👍';
    if (score >= 60) return 'Keep practicing! 📚';
    return 'Review the material and try again! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Complete!</h1>
            <p className="text-lg text-gray-600">{getScoreMessage()}</p>
          </div>

          {/* Score Display */}
          <div className="flex items-center justify-center mb-8">
            <div className={`text-7xl font-bold ${getScoreColor()}`}>
              {score}%
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-900">{totalQuestions}</div>
              <div className="text-sm text-blue-700 font-medium mt-1">Total Questions</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-900">{correctAnswers}</div>
              <div className="text-sm text-green-700 font-medium mt-1">Correct</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-900">{incorrectAnswers}</div>
              <div className="text-sm text-red-700 font-medium mt-1">Incorrect</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-900">{formatTime(results.timeSpent)}</div>
              <div className="text-sm text-purple-700 font-medium mt-1">Time Spent</div>
            </div>
          </div>

          {/* Test Info */}
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                📚 {results.config.topic}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                🎯 {results.config.difficulty.charAt(0).toUpperCase() + results.config.difficulty.slice(1)}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                📝 {results.config.questionFormat.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
          
          <div className="space-y-4">
            {results.questions.map((question, index) => {
              const userAnswer = results.userAnswers[index];
              const isCorrect = userAnswer === question.correct;
              const isExpanded = expandedQuestions.has(index);

              return (
                <div
                  key={index}
                  className={`border-2 rounded-lg overflow-hidden transition-all ${
                    isCorrect ? 'border-green-200' : 'border-red-200'
                  }`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className={`w-full p-4 flex items-center justify-between ${
                      isCorrect ? 'bg-green-50' : 'bg-red-50'
                    } hover:opacity-80 transition-opacity`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                      )}
                      <span className={`font-semibold text-left ${
                        isCorrect ? 'text-green-900' : 'text-red-900'
                      }`}>
                        Question {index + 1}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 bg-white border-t">
                      <p className="text-gray-900 font-medium mb-4">{question.question}</p>
                      
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = question.correct === optIndex;
                          
                          let optionStyle = 'border-gray-200 text-gray-700';
                          if (isCorrectAnswer) {
                            optionStyle = 'border-green-500 bg-green-50 text-green-900';
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            optionStyle = 'border-red-500 bg-red-50 text-red-900';
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 border-2 rounded-lg ${optionStyle}`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className={`p-4 rounded-lg ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <h4 className={`font-semibold mb-2 ${
                          isCorrect ? 'text-green-900' : 'text-blue-900'
                        }`}>
                          Explanation:
                        </h4>
                        <p className={isCorrect ? 'text-green-900' : 'text-blue-900'}>
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/ai-test')}
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Generate New Test
          </button>
          <button
            onClick={() => router.push('/study')}
            className="flex-1 bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Study Mode
          </button>
        </div>
      </div>
    </div>
  );
}

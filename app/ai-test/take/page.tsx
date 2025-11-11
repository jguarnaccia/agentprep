'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TestData {
  questions: Question[];
  config: {
    topic: string;
    difficulty: string;
    questionCount: number;
    questionFormat: string;
  };
}

export default function TakeTestPage() {
  const router = useRouter();
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load test data from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem('aiTestData');
    if (!data) {
      router.push('/ai-test');
      return;
    }
    setTestData(JSON.parse(data));
    setStartTime(Date.now());
  }, [router]);

  // Timer
  useEffect(() => {
    if (!testData) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, testData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setUserAnswers([...userAnswers, selectedAnswer]);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!testData) return;

    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Test complete - navigate to results
      const results = {
        config: testData.config,
        questions: testData.questions,
        userAnswers,
        timeSpent: elapsedTime,
      };
      sessionStorage.setItem('aiTestResults', JSON.stringify(results));
      router.push('/ai-test/results');
    }
  };

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading test...</div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct;
  const progress = ((currentQuestionIndex + 1) / testData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {testData.config.topic}
              </h1>
              <p className="text-gray-600">
                {testData.config.difficulty.charAt(0).toUpperCase() + testData.config.difficulty.slice(1)} • {testData.config.questionFormat.replace('_', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono font-semibold">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} of {testData.questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correct;
              
              let buttonStyle = 'border-2 border-gray-200 hover:border-gray-300 text-gray-900';
              
              if (showExplanation) {
                if (isCorrectAnswer) {
                  buttonStyle = 'border-2 border-green-500 bg-green-50 text-green-900';
                } else if (isSelected && !isCorrectAnswer) {
                  buttonStyle = 'border-2 border-red-500 bg-red-50 text-red-900';
                } else {
                  buttonStyle = 'border-2 border-gray-200 text-gray-600';
                }
              } else if (isSelected) {
                buttonStyle = 'border-2 border-blue-600 bg-blue-50 text-blue-900';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg text-left transition-all flex items-center justify-between ${buttonStyle} ${
                    showExplanation ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {showExplanation && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showExplanation && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-6 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-lg font-semibold text-green-900">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="text-lg font-semibold text-red-900">Incorrect</span>
                  </>
                )}
              </div>
              <p className={`${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!showExplanation ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < testData.questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  'See Results'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

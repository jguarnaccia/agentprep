'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  citation: string;
  topic: string;
  difficulty: string;
  source: string;
}

export default function AITest() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load questions from sessionStorage
    const storedQuestions = sessionStorage.getItem('aiTestQuestions');
    const storedSessionId = sessionStorage.getItem('aiTestSessionId');

    if (!storedQuestions || !storedSessionId) {
      router.push('/ai-generator');
      return;
    }

    const parsedQuestions = JSON.parse(storedQuestions);
    setQuestions(parsedQuestions);
    setSessionId(storedSessionId);
    setAnswers(new Array(parsedQuestions.length).fill(null));
  }, [router]);

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return; // Don't allow changing answer after submission

    setSelectedAnswer(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setIsComplete(true);
    
    // Calculate score
    const score = answers.filter((ans, idx) => ans === questions[idx].correct).length;
    
    // Save results to database
    try {
      const response = await fetch('/api/save-test-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers,
          score,
          totalQuestions: questions.length
        })
      });
      
      if (!response.ok) {
        console.error('Failed to save test result');
      }
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <div className="text-xl text-white">Loading your AI test...</div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const score = answers.filter((ans, idx) => ans === questions[idx].correct).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center">
            <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-6" />
            <h1 className="text-5xl font-bold text-white mb-4">Test Complete!</h1>
            
            <div className="text-8xl font-bold text-white mb-4">
              {percentage}%
            </div>
            
            <p className="text-2xl text-blue-200 mb-8">
              You scored {score} out of {questions.length}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                <div className="text-3xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-green-200">Correct</div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-4 border border-red-400/30">
                <div className="text-3xl font-bold text-red-400">{questions.length - score}</div>
                <div className="text-sm text-red-200">Incorrect</div>
              </div>
              <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                <div className="text-3xl font-bold text-blue-400">{questions.length}</div>
                <div className="text-sm text-blue-200">Total</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => router.push('/ai-generator')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Generate New Test
              </button>
              <button
                onClick={() => router.push('/my-tests')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-teal-700 transition-all"
              >
                View Test History
              </button>
              <button
                onClick={() => router.push('/study')}
                className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/20"
              >
                Back to Study
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = showExplanation;
  const isCorrect = selectedAnswer === currentQuestion.correct;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span className="text-sm font-medium">Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-sm font-medium">{currentQuestion.difficulty.toUpperCase()} • {currentQuestion.topic}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-purple-400 flex-shrink-0 mt-1" />
            <h2 className="text-2xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === currentQuestion.correct;
              
              let bgColor = 'bg-white/5 hover:bg-white/10';
              let borderColor = 'border-white/20';
              let textColor = 'text-white';
              
              if (isAnswered) {
                if (isCorrectAnswer) {
                  bgColor = 'bg-green-500/20';
                  borderColor = 'border-green-400/50';
                } else if (isSelected) {
                  bgColor = 'bg-red-500/20';
                  borderColor = 'border-red-400/50';
                }
              } else if (isSelected) {
                bgColor = 'bg-blue-600/30';
                borderColor = 'border-blue-400/50';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${bgColor} ${borderColor} ${textColor} ${
                    isAnswered ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {isAnswered && isCorrectAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isAnswered && (
            <button
              onClick={submitAnswer}
              disabled={selectedAnswer === null}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
              }`}
            >
              Submit Answer
            </button>
          )}

          {/* Explanation */}
          {isAnswered && (
            <div className={`mt-6 p-6 rounded-xl border-2 ${
              isCorrect 
                ? 'bg-green-500/10 border-green-400/30' 
                : 'bg-red-500/10 border-red-400/30'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-400" />
                )}
                <h3 className={`text-xl font-bold ${
                  isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
              </div>
              
              <p className="text-white leading-relaxed mb-3">
                {currentQuestion.explanation}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-blue-200">
                <span className="font-medium">Source:</span>
                <span>{currentQuestion.citation}</span>
              </div>

              {/* Next Button */}
              <button
                onClick={nextQuestion}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  'Finish Test'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Question Navigation */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const isAnswered = answers[index] !== null;
              const isCurrent = index === currentIndex;
              const isCorrect = isAnswered && answers[index] === questions[index].correct;
              const isIncorrect = isAnswered && answers[index] !== questions[index].correct;
              
              return (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    isCurrent
                      ? 'bg-purple-600 text-white ring-2 ring-white/50'
                      : isCorrect
                      ? 'bg-green-500 text-white'
                      : isIncorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

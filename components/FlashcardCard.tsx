'use client';

import { useState, useEffect } from 'react';
import { Question } from '@/lib/types';
import { ChevronRight, ChevronLeft, Eye, ThumbsUp, RotateCcw } from 'lucide-react';
import { recordAttempt } from '@/lib/progress';

interface Props {
  question: Question;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function FlashcardCard({ question, onNext, onPrevious }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setShowAnswer(false);
    setHasRecorded(false);
  }, [question.id]);

  const handleGotIt = async () => {
    if (!hasRecorded) {
      setHasRecorded(true);
      await recordAttempt(question.id, true);
    }
    // Small delay to prevent flicker
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 100);
  };

  const handleNeedReview = async () => {
    if (!hasRecorded) {
      setHasRecorded(true);
      await recordAttempt(question.id, false);
    }
    // Small delay to prevent flicker
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 100);
  };

  const correctAnswer = question.options[question.correct];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px] flex flex-col">
      {/* Difficulty Badge */}
      <div className="mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {question.difficulty.toUpperCase()}
        </span>
        <span className="ml-2 text-sm text-gray-600">{question.category}</span>
      </div>

      {/* Flashcard Content */}
      <div className="flex-1 flex flex-col justify-center">
        {!showAnswer ? (
          // FRONT: Question Only
          <div className="text-center py-12">
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Question
              </h3>
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {question.question}
              </h2>
            </div>

            <button
              onClick={() => setShowAnswer(true)}
              className="mx-auto flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Eye className="w-6 h-6" />
              Show Answer
            </button>
          </div>
        ) : (
          // BACK: Answer + Explanation
          <div className="py-6">
            {/* Question (smaller on back) */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Question
              </h3>
              <p className="text-base text-gray-700 font-medium">
                {question.question}
              </p>
            </div>

            {/* Correct Answer */}
            <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-300">
              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-3">
                ✅ Correct Answer
              </h3>
              <p className="text-xl font-bold text-green-900 mb-4">
                {correctAnswer}
              </p>
              <div className="pt-4 border-t-2 border-green-200">
                <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
                  Explanation
                </h4>
                <p className="text-base text-gray-800 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>

            {/* Source */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Source: {question.source}
            </p>

            {/* Got It / Need Review Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleNeedReview}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors border-2 border-red-300"
              >
                <RotateCcw className="w-5 h-5" />
                Need Review
              </button>
              <button
                onClick={handleGotIt}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <ThumbsUp className="w-5 h-5" />
                Got It!
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-6 border-t-2 border-gray-200">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!onPrevious}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!onNext}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

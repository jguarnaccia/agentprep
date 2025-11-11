'use client';

import { useState, useEffect, useMemo } from 'react';
import { Question } from '@/lib/types';
import { Check, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { recordAttempt } from '@/lib/progress';

interface Props {
  question: Question;
  onNext?: () => void;
  onPrevious?: () => void;
  showExplanation?: boolean;
}

export function QuestionCard({ question, onNext, onPrevious, showExplanation = true }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Shuffle options but remember the correct answer's new position
  const shuffledOptions = useMemo(() => {
    const optionsWithIndex = question.options.map((option, index) => ({
      option,
      originalIndex: index,
      isCorrect: index === question.correct
    }));
    
    // Fisher-Yates shuffle
    for (let i = optionsWithIndex.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
    }
    
    return optionsWithIndex;
  }, [question.id, question.options, question.correct]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleAnswerSelect = async (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    setHasAnswered(true);
    
    // Record the attempt
    const isCorrectAnswer = shuffledOptions[index]?.isCorrect;
    await recordAttempt(question.id, isCorrectAnswer);
  };

  const isCorrect = selectedAnswer !== null && shuffledOptions[selectedAnswer]?.isCorrect;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
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

      {/* Question */}
      <h2 className="text-xl font-bold mb-6 text-gray-900">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {shuffledOptions.map((item, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = item.isCorrect;
          
          let bgColor = 'bg-gray-50 hover:bg-gray-100';
          let textColor = 'text-gray-900';
          
          if (hasAnswered) {
            if (isCorrectAnswer) {
              bgColor = 'bg-green-100 border-green-500';
              textColor = 'text-green-900';
            } else if (isSelected && !isCorrect) {
              bgColor = 'bg-red-100 border-red-500';
              textColor = 'text-red-900';
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-50 border-blue-500';
            textColor = 'text-blue-900';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 border-transparent transition ${bgColor} ${
                hasAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${textColor}`}>{item.option}</span>
                {hasAnswered && isCorrectAnswer && <Check className="text-green-600" size={20} />}
                {hasAnswered && isSelected && !isCorrect && <X className="text-red-600" size={20} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {hasAnswered && showExplanation && (
        <div className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-50' : 'bg-blue-50'}`}>
          <h3 className="font-bold mb-2 text-gray-900">
            {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </h3>
          <p className="text-gray-800 mb-2">{question.explanation}</p>
          <p className="text-sm text-gray-600">Source: {question.source}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!onPrevious}
        >
          <ChevronLeft size={20} /> Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!onNext}
        >
          Next <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

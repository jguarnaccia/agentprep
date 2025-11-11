'use client';

import { useState } from 'react';
import { Sparkles, ChevronLeft, CheckCircle, Loader2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Salary Cap', 'Luxury Tax', 'Aprons (First/Second)', 'Exceptions (MLE, Biannual, etc.)', 'Free Agency', 'Trades',
  'Rookie Contracts', 'Maximum Salaries', 'Minimum Salaries', 'Contract Extensions', 'Two-Way Contracts', 'Waivers',
  'Draft Picks', 'Roster Management', 'Player Contracts', 'International Players', 'G-League Contracts',
];

const GENERATION_STEPS = [
  { id: 1, label: 'Preparing your test parameters', duration: 500 },
  { id: 2, label: 'Connecting to AI engine', duration: 1000 },
  { id: 3, label: 'Analyzing CBA rules and regulations', duration: 2000 },
  { id: 4, label: 'Generating high-quality questions', duration: 0 },
  { id: 5, label: 'Validating accuracy and difficulty', duration: 500 },
  { id: 6, label: 'Finalizing your custom test', duration: 500 },
];

export default function AIGeneratorPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generationError, setGenerationError] = useState('');
  const [aiTopic, setAiTopic] = useState(CATEGORIES[0]);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiQuestionCount, setAiQuestionCount] = useState(10);
  const [aiQuestionFormat, setAiQuestionFormat] = useState<'multiple_choice' | 'true_false' | 'scenario'>('multiple_choice');

  const handleGenerateTest = async () => {
    setIsGenerating(true);
    setCurrentStep(0);
    setGenerationError('');

    try {
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[0].duration));
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[1].duration));
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[2].duration));
      setCurrentStep(4);
      
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          questionCount: aiQuestionCount,
          questionFormat: aiQuestionFormat,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate test');
      }

      const data = await response.json();
      setCurrentStep(5);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[4].duration));
      setCurrentStep(6);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[5].duration));
      
      sessionStorage.setItem('aiTestData', JSON.stringify({
        questions: data.questions,
        config: { topic: aiTopic, difficulty: aiDifficulty, questionCount: aiQuestionCount, questionFormat: aiQuestionFormat },
      }));
      
      router.push('/ai-test/take');
    } catch (err) {
      console.error('Error generating test:', err);
      setGenerationError(err instanceof Error ? err.message : 'Failed to generate test');
      setCurrentStep(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const progressPercentage = currentStep > 0 ? (currentStep / GENERATION_STEPS.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
      {/* AI Test Generation Modal */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-red-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Test</h2>
              <p className="text-gray-600">Please wait while we create your custom questions...</p>
            </div>
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }} 
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            <div className="space-y-3">
              {GENERATION_STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isComplete = currentStep > stepNumber;
                const isCurrent = currentStep === stepNumber;
                return (
                  <div 
                    key={step.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isComplete ? 'bg-green-50 border border-green-200' : 
                      isCurrent ? 'bg-blue-50 border border-blue-200' : 
                      'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isComplete ? 'bg-green-600 text-white' : 
                      isCurrent ? 'bg-blue-600 text-white' : 
                      'bg-gray-300 text-gray-600'
                    }`}>
                      {isComplete ? <CheckCircle className="w-5 h-5" /> : isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : stepNumber}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        isComplete ? 'text-green-900' : 
                        isCurrent ? 'text-blue-900' : 
                        'text-gray-600'
                      }`}>
                        {step.label}
                      </div>
                    </div>
                    {isCurrent && stepNumber === 4 && <Clock className="w-5 h-5 text-blue-600 animate-pulse" />}
                  </div>
                );
              })}
            </div>
            {currentStep === 4 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-1" />
                This may take 15-30 seconds for {aiQuestionCount} questions
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-12 h-12 text-red-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">AI Test Generator</h1>
              <p className="text-lg text-red-200">Create custom practice tests powered by Claude AI</p>
            </div>
          </div>
          
          {/* Back to Home */}
          <div className="mb-6">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-white hover:text-red-300 transition-colors font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>

        {/* AI Test Generator */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-white/95 via-red-50/90 to-blue-50/95 backdrop-blur-lg rounded-xl shadow-lg border border-red-200 p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Topic</label>
                <select 
                  value={aiTopic} 
                  onChange={(e) => setAiTopic(e.target.value)} 
                  disabled={isGenerating} 
                  className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none text-gray-900 disabled:bg-gray-100"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button 
                      key={level} 
                      onClick={() => setAiDifficulty(level)} 
                      disabled={isGenerating} 
                      className={`p-3 rounded-lg border-2 transition-all font-medium ${
                        aiDifficulty === level 
                          ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-200' 
                          : 'border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Number of Questions: {aiQuestionCount}
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="5" 
                  value={aiQuestionCount} 
                  onChange={(e) => setAiQuestionCount(Number(e.target.value))} 
                  disabled={isGenerating} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-50" 
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span><span>25</span><span>50</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Question Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'multiple_choice', label: 'Multiple Choice' }, 
                    { value: 'true_false', label: 'True/False' }, 
                    { value: 'scenario', label: 'Scenarios' }
                  ].map((format) => (
                    <button 
                      key={format.value} 
                      onClick={() => setAiQuestionFormat(format.value as any)} 
                      disabled={isGenerating} 
                      className={`p-3 rounded-lg border-2 transition-all font-medium ${
                        aiQuestionFormat === format.value 
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-200' 
                          : 'border-blue-200 text-blue-700 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {generationError && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-900 font-medium">{generationError}</p>
              </div>
            )}
            <button 
              onClick={handleGenerateTest} 
              disabled={isGenerating} 
              className="mt-6 w-full bg-gradient-to-r from-red-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Test
                </>
              )}
            </button>
          </div>
          <div className="bg-gradient-to-br from-white/95 via-blue-50/90 to-red-50/95 backdrop-blur-lg border-2 border-red-200 rounded-xl p-6 shadow-lg">
            <h3 className="font-semibold text-red-900 mb-3">How It Works</h3>
            <ul className="space-y-2 text-red-800">
              {[
                'Select your topic and customize test parameters',
                'AI generates unique, CBA-accurate questions instantly', 
                'Take the test with timer and instant feedback',
                'Review detailed explanations for each answer'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

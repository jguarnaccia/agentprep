'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  ChevronDown,
  Clock,
  Target,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useScenarios, type Scenario } from '@/lib/hooks/useStudyData';

export function ScenariosSection() {
  const { scenarios, loading, error } = useScenarios();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  // Group scenarios by topic
  const scenariosByTopic = scenarios.reduce((acc, scenario) => {
    if (!acc[scenario.topic]) {
      acc[scenario.topic] = [];
    }
    acc[scenario.topic].push(scenario);
    return acc;
  }, {} as Record<string, Scenario[]>);

  const topics = Object.keys(scenariosByTopic).sort();

  const toggleTopic = (topic: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic);
    } else {
      newExpanded.add(topic);
    }
    setExpandedTopics(newExpanded);
  };

  const handleAnswerSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    const option = selectedScenario?.options.find(opt => opt.id === optionId);
    console.log('Selected option:', option);
    console.log('All options:', selectedScenario?.options);
    if (option) {
      setIsCorrect(option.isCorrect);
    }
  };

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleNextScenario = () => {
    setSelectedScenario(null);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);
  };

  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleNextScenario}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Scenarios</span>
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                selectedScenario.difficulty === 'Beginner' 
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : selectedScenario.difficulty === 'Intermediate'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {selectedScenario.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {selectedScenario.topic}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedScenario.title}
            </h1>
            <p className="text-slate-300">{selectedScenario.description}</p>
          </div>

          {/* Scenario Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-lg p-8 mb-6"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white mb-3">Situation</h2>
                <p className="text-slate-300 leading-relaxed">
                  {selectedScenario.situation}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {selectedScenario.question}
              </h3>

              {/* Answer Options */}
              <div className="space-y-3">
                {selectedScenario.options.map((option) => {
                  const isSelected = selectedAnswer === option.id;
                  const showResult = showExplanation;
                  const isCorrectAnswer = option.isCorrect;
                  
                  let borderColor = 'border-slate-600';
                  let bgColor = 'bg-slate-800 hover:bg-slate-700';
                  let textColor = 'text-white';
                  let iconColor = 'border-slate-400';
                  
                  if (showResult) {
                    // ALWAYS highlight the correct answer in green
                    if (isCorrectAnswer) {
                      borderColor = 'border-green-400';
                      bgColor = 'bg-green-500/30';
                      textColor = 'text-green-100';
                      iconColor = 'border-green-400 bg-green-500';
                    } 
                    // Show user's wrong selection in red
                    else if (isSelected && !isCorrectAnswer) {
                      borderColor = 'border-red-400';
                      bgColor = 'bg-red-500/30';
                      textColor = 'text-red-100';
                      iconColor = 'border-red-400 bg-red-500';
                    }
                    // Other non-selected wrong options stay muted
                    else {
                      borderColor = 'border-slate-700';
                      bgColor = 'bg-slate-800/50';
                      textColor = 'text-slate-500';
                      iconColor = 'border-slate-600';
                    }
                  } else if (isSelected) {
                    borderColor = 'border-blue-400';
                    bgColor = 'bg-blue-500/30';
                    textColor = 'text-blue-100';
                    iconColor = 'border-blue-400 bg-blue-500';
                  }

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => !showExplanation && handleAnswerSelect(option.id)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderColor} ${bgColor} ${textColor} ${
                        !showExplanation ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      whileHover={!showExplanation ? { scale: 1.01 } : {}}
                      whileTap={!showExplanation ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showResult && isCorrectAnswer
                            ? 'border-green-400 bg-green-500'
                            : showResult && isSelected && !isCorrectAnswer
                            ? 'border-red-400 bg-red-500'
                            : isSelected
                            ? 'border-blue-400 bg-blue-500'
                            : iconColor
                        }`}>
                          {showResult && isCorrectAnswer && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                          {showResult && isSelected && !isCorrectAnswer && (
                            <XCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="flex-1 font-medium">{option.text}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Submit Button */}
              {!showExplanation && selectedAnswer && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSubmit}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-red-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Submit Answer
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Result Banner */}
                <div className={`rounded-2xl border-2 p-6 ${
                  isCorrect
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-green-900">Correct!</h3>
                          <p className="text-sm text-green-700">Great job understanding this concept.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-red-900">Not Quite</h3>
                          <p className="text-sm text-red-700">Let's review why this answer is incorrect.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600 shadow-lg p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Explanation</h3>
                  </div>
                  <p className="text-slate-200 leading-relaxed mb-6">
                    {selectedScenario.explanation}
                  </p>

                  <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border-2 border-blue-400">
                    <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Key Takeaway
                    </p>
                    <p className="text-sm text-slate-100 leading-relaxed font-medium">
                      {selectedScenario.key_takeaway || selectedScenario.explanation.split('.').slice(0, 2).join('.') + '.'}
                    </p>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextScenario}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-red-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Next Scenario
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Practice Scenarios</h1>
          <p className="text-slate-300">Apply CBA knowledge to real-world situations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-white">47</p>
            <p className="text-xs text-slate-400 mt-1">Out of 190 scenarios</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 border border-red-500 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-100">Success Rate</span>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">78%</p>
            <p className="text-xs text-red-100 mt-1">+5% this week</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 border border-blue-500 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100">Avg Time</span>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">3:24</p>
            <p className="text-xs text-blue-100 mt-1">Per scenario</p>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">Error loading scenarios</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scenarios.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
            <BrainCircuit className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Scenarios Available</h3>
            <p className="text-slate-400">Check back soon for new practice scenarios!</p>
          </div>
        )}

        {/* Scenarios by Topic */}
        {!loading && !error && scenarios.length > 0 && (
          <div className="space-y-4">
            {topics.map((topic) => {
              const topicScenarios = scenariosByTopic[topic];
              const isExpanded = expandedTopics.has(topic);
              
              return (
                <div key={topic} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                  {/* Topic Header */}
                  <button
                    onClick={() => toggleTopic(topic)}
                    className="w-full flex items-center justify-between p-6 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center">
                        <BrainCircuit className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-white">{topic}</h3>
                        <p className="text-sm text-slate-400">{topicScenarios.length} scenarios</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-6 h-6 text-slate-400" />
                    </motion.div>
                  </button>

                  {/* Scenarios Grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-700"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                          {topicScenarios.map((scenario, index) => (
                            <motion.div
                              key={scenario.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.05 * index }}
                              className="bg-slate-800/50 rounded-xl border border-slate-600 overflow-hidden hover:shadow-lg hover:border-blue-500/50 transition-all group cursor-pointer"
                              onClick={() => setSelectedScenario(scenario)}
                            >
                              <div className="p-5">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    scenario.difficulty === 'Beginner' 
                                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                      : scenario.difficulty === 'Intermediate'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  }`}>
                                    {scenario.difficulty}
                                  </span>
                                </div>

                                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                                  {scenario.title}
                                </h4>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                  {scenario.description}
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Target className="w-4 h-4" />
                                    <span>Case Study</span>
                                  </div>
                                  <ArrowRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

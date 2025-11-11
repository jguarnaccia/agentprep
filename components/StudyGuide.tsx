'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, BookmarkIcon, ChevronRight, Loader2, Sparkles, ChevronDown, ChevronUp, Calculator, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Salary Cap',
  'Luxury Tax',
  'Aprons (First/Second)',
  'Exceptions (MLE, Biannual, etc.)',
  'Free Agency',
  'Trades',
  'Rookie Contracts',
  'Maximum Salaries',
  'Minimum Salaries',
  'Contract Extensions',
  'Two-Way Contracts',
  'Waivers',
  'Draft Picks',
  'Roster Management',
  'Player Contracts',
  'International Players',
  'G-League Contracts',
];

interface StudyContent {
  overview: string;
  keyPoints: string[];
  rules: Array<{
    title: string;
    description: string;
    example: string;
  }>;
  calculations?: Array<{
    name: string;
    formula: string;
    example: string;
  }>;
  realWorldExamples: Array<{
    scenario: string;
    explanation: string;
  }>;
  commonMistakes: string[];
  examTips: string[];
}

export default function StudyGuide() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [content, setContent] = useState<StudyContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [payroll, setPayroll] = useState('');
  const [taxResult, setTaxResult] = useState<number | null>(null);
  const [taxBreakdown, setTaxBreakdown] = useState<string[]>([]);

  // Refs for scroll-to functionality
  const overviewRef = useRef<HTMLElement>(null);
  const keyPointsRef = useRef<HTMLElement>(null);
  const rulesRef = useRef<HTMLElement>(null);
  const calculationsRef = useRef<HTMLElement>(null);
  const examplesRef = useRef<HTMLElement>(null);
  const mistakesRef = useRef<HTMLElement>(null);
  const tipsRef = useRef<HTMLElement>(null);

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadContent = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    setContent(null);
    setLoadingProgress(0);
    setCollapsedSections(new Set());
    setShowCalculator(false);

    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 800);

    try {
      const getResponse = await fetch(`/api/study-guide?category=${encodeURIComponent(category)}`);
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        setContent(data.content);
        setLoadingProgress(100);
      } else {
        const postResponse = await fetch('/api/study-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category }),
        });

        if (!postResponse.ok) {
          const errorData = await postResponse.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.details || errorData.error || 'Failed to generate content');
        }

        const data = await postResponse.json();
        setContent(data.content);
        setLoadingProgress(100);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to load study content: ${errorMessage}\n\nPlease check the browser console for details.`);
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setLoadingProgress(0);
    }
  };

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement | null>, sectionName: string) => {
    setActiveSection(sectionName);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleSection = (sectionName: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionName)) {
      newCollapsed.delete(sectionName);
    } else {
      newCollapsed.add(sectionName);
    }
    setCollapsedSections(newCollapsed);
  };

  const calculateLuxuryTax = () => {
    const payrollAmount = parseFloat(payroll);
    if (isNaN(payrollAmount)) {
      setTaxResult(null);
      setTaxBreakdown([]);
      return;
    }

    const taxThreshold = 165.294; // 2023-24 luxury tax threshold
    const breakdown: string[] = [];
    
    breakdown.push(`Payroll: ${payrollAmount.toFixed(3)}M`);
    breakdown.push(`Tax Threshold: ${taxThreshold}M`);
    
    if (payrollAmount <= taxThreshold) {
      setTaxResult(0);
      breakdown.push(`Overage: $0M`);
      breakdown.push(`No luxury tax (under threshold)`);
      setTaxBreakdown(breakdown);
      return;
    }

    const overage = payrollAmount - taxThreshold;
    breakdown.push(`Overage: ${overage.toFixed(3)}M`);
    breakdown.push(``);
    breakdown.push(`Step-by-step calculation:`);
    
    let tax = 0;
    let remaining = overage;

    // Progressive tax rates (first-time taxpayer)
    if (remaining > 0) {
      const bracket1 = Math.min(remaining, 5);
      const tax1 = bracket1 * 1.50;
      tax += tax1;
      breakdown.push(`• First ${bracket1.toFixed(3)}M × $1.50 = ${tax1.toFixed(3)}M`);
      remaining -= bracket1;
    }
    
    if (remaining > 0) {
      const bracket2 = Math.min(remaining, 5);
      const tax2 = bracket2 * 1.75;
      tax += tax2;
      breakdown.push(`• Next ${bracket2.toFixed(3)}M × $1.75 = ${tax2.toFixed(3)}M`);
      remaining -= bracket2;
    }
    
    if (remaining > 0) {
      const bracket3 = Math.min(remaining, 5);
      const tax3 = bracket3 * 2.50;
      tax += tax3;
      breakdown.push(`• Next ${bracket3.toFixed(3)}M × $2.50 = ${tax3.toFixed(3)}M`);
      remaining -= bracket3;
    }
    
    if (remaining > 0) {
      const bracket4 = Math.min(remaining, 5);
      const tax4 = bracket4 * 3.25;
      tax += tax4;
      breakdown.push(`• Next ${bracket4.toFixed(3)}M × $3.25 = ${tax4.toFixed(3)}M`);
      remaining -= bracket4;
    }
    
    if (remaining > 0) {
      const tax5 = remaining * 3.75;
      tax += tax5;
      breakdown.push(`• Remaining ${remaining.toFixed(3)}M × $3.75 = ${tax5.toFixed(3)}M`);
    }

    setTaxResult(tax);
    setTaxBreakdown(breakdown);
  };

  const handlePracticeQuestions = () => {
    // Store the selected category in sessionStorage
    sessionStorage.setItem('filterCategory', selectedCategory || '');
    sessionStorage.setItem('switchToStudyTab', 'true');
    // Reload the page to trigger the tab switch
    window.location.href = '/study';
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Sidebar - Topic List */}
      <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Study Topics</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-1">
          {filteredCategories.map((category) => (
            <button
              key={category}
              onClick={() => loadContent(category)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between group text-sm ${
                selectedCategory === category
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-sm">{category}</span>
              <ChevronRight className={`w-3 h-3 transition-transform ${
                selectedCategory === category ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {!selectedCategory ? (
          <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center text-gray-500">
              <BookmarkIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select a topic to start studying</p>
              <p className="text-sm mt-2">Choose from {CATEGORIES.length} CBA topics</p>
            </div>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center max-w-md">
              <div className="relative mb-6">
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
                <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">Generating Study Content</p>
              <p className="text-sm text-gray-600 mb-4">Creating comprehensive materials for {selectedCategory}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">This may take 15-30 seconds for first-time generation</p>
            </div>
          </div>
        ) : content ? (
          <>
            {/* Table of Contents - Sticky */}
            <div className="w-56 flex-shrink-0">
              <div className="sticky top-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Contents</h3>
                <nav className="space-y-1">
                  {[
                    { name: 'Overview', ref: overviewRef, id: 'overview' },
                    { name: 'Key Points', ref: keyPointsRef, id: 'keyPoints' },
                    { name: 'Important Rules', ref: rulesRef, id: 'rules' },
                    ...(content.calculations && content.calculations.length > 0 ? [{ name: 'Calculations', ref: calculationsRef, id: 'calculations' }] : []),
                    { name: 'Real Examples', ref: examplesRef, id: 'examples' },
                    { name: 'Common Mistakes', ref: mistakesRef, id: 'mistakes' },
                    { name: 'Exam Tips', ref: tipsRef, id: 'tips' },
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.ref, section.id)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </nav>

                {/* Practice Questions Button */}
                <button
                  onClick={handlePracticeQuestions}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Practice Questions
                </button>

                {/* Calculator Toggle (only for Salary Cap topic) */}
                {selectedCategory === 'Salary Cap' && (
                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="w-full mt-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    {showCalculator ? 'Hide' : 'Show'} Calculator
                  </button>
                )}
              </div>
            </div>

            {/* Main Content - Scrollable */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
              <div className="p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 pb-6 border-b-2 border-gray-200">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{selectedCategory}</h1>
                  <p className="text-gray-600">Comprehensive study guide for the NBA CBA</p>
                </div>

                {/* Interactive Calculator (Salary Cap only) */}
                {selectedCategory === 'Salary Cap' && showCalculator && (
                  <div className="mb-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator className="w-6 h-6 text-green-700" />
                      <h3 className="text-xl font-bold text-gray-900">Interactive Luxury Tax Calculator</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">Calculate luxury tax for a team's payroll (first-time taxpayer rates)</p>
                    
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Team Payroll (in millions)
                        </label>
                        <input
                          type="number"
                          value={payroll}
                          onChange={(e) => setPayroll(e.target.value)}
                          placeholder="e.g., 175"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-lg text-gray-900"
                        />
                      </div>
                      <button
                        onClick={calculateLuxuryTax}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                      >
                        Calculate
                      </button>
                    </div>

                    {taxResult !== null && (
                      <div className="mt-4 space-y-3">
                        <div className="p-4 bg-white rounded-lg border-2 border-green-300">
                          <p className="text-sm text-gray-600 mb-1">Total Luxury Tax:</p>
                          <p className="text-3xl font-bold text-green-700">
                            ${taxResult.toFixed(2)}M
                          </p>
                        </div>
                        
                        {taxBreakdown.length > 0 && (
                          <div className="p-4 bg-white rounded-lg border border-gray-300">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Calculation Breakdown:</p>
                            <div className="space-y-1 text-sm text-gray-700 font-mono">
                              {taxBreakdown.map((line, idx) => (
                                <div key={idx} className={line === '' ? 'h-2' : ''}>
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Overview */}
                <section ref={overviewRef} className="mb-8 scroll-mt-4">
                  <button
                    onClick={() => toggleSection('overview')}
                    className="flex items-center justify-between w-full mb-4 group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                    {collapsedSections.has('overview') ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {!collapsedSections.has('overview') && (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content.overview}</p>
                  )}
                </section>

                {/* Key Points */}
                <section ref={keyPointsRef} className="mb-8 scroll-mt-4">
                  <button
                    onClick={() => toggleSection('keyPoints')}
                    className="flex items-center justify-between w-full mb-4 group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">Key Points</h2>
                    {collapsedSections.has('keyPoints') ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {!collapsedSections.has('keyPoints') && (
                    <ul className="space-y-3">
                      {content.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Important Rules */}
                <section ref={rulesRef} className="mb-8 scroll-mt-4">
                  <button
                    onClick={() => toggleSection('rules')}
                    className="flex items-center justify-between w-full mb-4 group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">Important Rules</h2>
                    {collapsedSections.has('rules') ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {!collapsedSections.has('rules') && (
                    <div className="space-y-4">
                      {content.rules.map((rule, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                          <h3 className="font-bold text-gray-900 mb-2">{rule.title}</h3>
                          <p className="text-gray-700 mb-3">{rule.description}</p>
                          <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                            <p className="text-sm font-medium text-gray-600 mb-1">Example:</p>
                            <p className="text-sm text-gray-700">{rule.example}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Calculations */}
                {content.calculations && content.calculations.length > 0 && (
                  <section ref={calculationsRef} className="mb-8 scroll-mt-4">
                    <button
                      onClick={() => toggleSection('calculations')}
                      className="flex items-center justify-between w-full mb-4 group"
                    >
                      <h2 className="text-2xl font-bold text-gray-900">Important Calculations</h2>
                      {collapsedSections.has('calculations') ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                      )}
                    </button>
                    {!collapsedSections.has('calculations') && (
                      <div className="space-y-4">
                        {content.calculations.map((calc, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-2">{calc.name}</h3>
                            <div className="bg-white rounded p-4 mb-3 border border-gray-300">
                              <p className="font-mono text-sm text-gray-900 leading-relaxed">{calc.formula}</p>
                            </div>
                            <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                              <p className="text-sm font-medium text-gray-600 mb-1">Example:</p>
                              <p className="text-sm text-gray-700">{calc.example}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {/* Real World Examples */}
                <section ref={examplesRef} className="mb-8 scroll-mt-4">
                  <button
                    onClick={() => toggleSection('examples')}
                    className="flex items-center justify-between w-full mb-4 group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">Real World Examples</h2>
                    {collapsedSections.has('examples') ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {!collapsedSections.has('examples') && (
                    <div className="space-y-4">
                      {content.realWorldExamples.map((example, index) => (
                        <div key={index} className="bg-green-50 rounded-lg p-5 border border-green-200">
                          <h3 className="font-bold text-gray-900 mb-2">Scenario {index + 1}</h3>
                          <p className="text-gray-700 mb-3 italic">{example.scenario}</p>
                          <p className="text-gray-700">{example.explanation}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Common Mistakes */}
                <section ref={mistakesRef} className="mb-8 scroll-mt-4">
                  <button
                    onClick={() => toggleSection('mistakes')}
                    className="flex items-center justify-between w-full mb-4 group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">Common Mistakes to Avoid</h2>
                    {collapsedSections.has('mistakes') ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {!collapsedSections.has('mistakes') && (
                    <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                      <ul className="space-y-2">
                        {content.commonMistakes.map((mistake, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 text-lg mt-0.5">⚠</span>
                            <span className="text-gray-700 flex-1">{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {/* Exam Tips */}
                <section ref={tipsRef} className="mb-8 scroll-mt-4">
                  <button
                    onClick={() => toggleSection('tips')}
                    className="flex items-center justify-between w-full mb-4 group"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">Exam Tips</h2>
                    {collapsedSections.has('tips') ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  {!collapsedSections.has('tips') && (
                    <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                      <ul className="space-y-2">
                        {content.examTips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-600 text-lg mt-0.5">💡</span>
                            <span className="text-gray-700 flex-1">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
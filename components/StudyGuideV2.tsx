'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, ChevronRight, ChevronDown, BookOpen, Sparkles, Filter, Loader2 } from 'lucide-react';

interface CBAContent {
  id: string;
  type: string;
  article_number: string | null;
  article_title: string | null;
  section_number: string | null;
  title: string | null;
  content: string;
  category: string | null;
  keywords: string[];
  order_index: number;
  ai_explanation: string | null;
}

interface Article {
  number: string;
  title: string;
  sections: CBAContent[];
  isExpanded: boolean;
}

export default function StudyGuideV2() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedContent, setSelectedContent] = useState<CBAContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSimplified, setShowSimplified] = useState(false);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCBAContent();
  }, []);

  // Helper function to convert Roman numerals to numbers for sorting
  function romanToNumber(roman: string): number {
    const romanMap: { [key: string]: number } = {
      'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
      'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
      'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25, 'XXVI': 26, 'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30,
      'XXXI': 31, 'XXXII': 32, 'XXXIII': 33, 'XXXIV': 34, 'XXXV': 35, 'XXXVI': 36, 'XXXVII': 37, 'XXXVIII': 38, 'XXXIX': 39, 'XL': 40,
      'XLI': 41, 'XLII': 42
    };
    
    // Extract Roman numeral from "Article I", "Article II", etc.
    const match = roman.match(/Article ([IVXLC]+)/);
    if (match && match[1]) {
      return romanMap[match[1]] || 999;
    }
    return 999;
  }

  async function loadCBAContent() {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('cba_content')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error loading CBA content:', error);
      setLoading(false);
      return;
    }

    // Group by article - only include proper articles (Article I through Article XLII)
    const articleMap = new Map<string, Article>();
    
    data?.forEach((item: CBAContent) => {
      if (!item.article_number) return;
      
      // Only include items that match "Article [ROMAN NUMERAL]" format
      const articleNum = item.article_number.trim();
      if (!articleNum.match(/^Article [IVXLC]+$/)) {
        return;
      }
      
      const key = item.article_number;
      
      if (!articleMap.has(key)) {
        articleMap.set(key, {
          number: item.article_number,
          title: item.article_title || 'Unknown',
          sections: [],
          isExpanded: false
        });
      }
      
      // Only add sections (not article headers) to the sections array
      if (item.type === 'section') {
        articleMap.get(key)?.sections.push(item);
      }
    });

    // Sort articles by Roman numeral order
    const sortedArticles = Array.from(articleMap.values()).sort((a, b) => {
      return romanToNumber(a.number) - romanToNumber(b.number);
    });

    setArticles(sortedArticles);
    setLoading(false);
  }

  function toggleArticle(articleNumber: string) {
    setArticles(articles.map(article => 
      article.number === articleNumber 
        ? { ...article, isExpanded: !article.isExpanded }
        : article
    ));
  }

  function selectContent(content: CBAContent) {
    setSelectedContent(content);
    setShowSimplified(false);
  }

  async function generateExplanation() {
    if (!selectedContent) return;
    
    setIsGeneratingExplanation(true);
    
    try {
      const response = await fetch('/api/cba-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: selectedContent.id,
          title: selectedContent.title,
          content: selectedContent.content
        })
      });

      const data = await response.json();
      
      if (data.explanation) {
        // Update the selected content with the explanation
        setSelectedContent({
          ...selectedContent,
          ai_explanation: data.explanation
        });
        setShowSimplified(true);
        
        // Also update in the articles list
        setArticles(articles.map(article => ({
          ...article,
          sections: article.sections.map(section =>
            section.id === selectedContent.id
              ? { ...section, ai_explanation: data.explanation }
              : section
          )
        })));
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setIsGeneratingExplanation(false);
    }
  }

  // Search and filter
  const filteredArticles = articles.filter(article => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesArticle = article.title.toLowerCase().includes(query) || 
                          article.number.toLowerCase().includes(query);
    const matchesSections = article.sections.some(section =>
      section.title?.toLowerCase().includes(query) ||
      section.section_number?.toLowerCase().includes(query) ||
      section.content.toLowerCase().includes(query)
    );
    
    return matchesArticle || matchesSections;
  });

  return (
    <div className="h-full flex gap-4">
      {/* Left Sidebar - Article Navigation */}
      <div className="w-96 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">2023 NBA CBA</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles and sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading CBA content...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">No results found</p>
              <p className="text-xs text-gray-400">Try different search terms</p>
            </div>
          ) : (
            <>
              <div className="text-xs text-gray-500 mb-3 px-1">
                {filteredArticles.length} of {articles.length} articles
              </div>
              {filteredArticles.map((article) => (
                <div key={article.number} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleArticle(article.number)}
                    className="w-full px-3 py-2.5 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {article.isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      )}
                      <span className="font-semibold text-xs text-blue-600 flex-shrink-0">
                        {article.number}
                      </span>
                      <span className="text-xs text-gray-900 truncate">
                        {article.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {article.sections.length}
                    </span>
                  </button>

                  {article.isExpanded && article.sections.length > 0 && (
                    <div className="bg-white border-t border-gray-200">
                      {article.sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => selectContent(section)}
                          className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 ${
                            selectedContent?.id === section.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-blue-600 mt-0.5 flex-shrink-0">
                              {section.section_number?.replace('Section ', '§')}
                            </span>
                            <span className="text-sm text-gray-700 flex-1">
                              {section.title || 'Untitled Section'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right Panel - Content Display */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedContent ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-blue-700">
                      {selectedContent.article_number}
                    </span>
                    {selectedContent.section_number && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">{selectedContent.section_number}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {selectedContent.title || selectedContent.article_title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {selectedContent.ai_explanation && (
                  <button
                    onClick={() => setShowSimplified(!showSimplified)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      showSimplified
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {showSimplified ? 'Show Full CBA Text' : 'Show AI Explanation'}
                  </button>
                )}

                {!selectedContent.ai_explanation && (
                  <button
                    onClick={generateExplanation}
                    disabled={isGeneratingExplanation}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 font-medium text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow disabled:cursor-not-allowed"
                  >
                    {isGeneratingExplanation ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Explain This Section
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {showSimplified && selectedContent.ai_explanation ? (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-5 rounded-r-lg mb-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-purple-900">AI-Generated Explanation</h3>
                    </div>
                    <p className="text-purple-800 text-sm">
                      Simplified breakdown of this CBA section for easier understanding
                    </p>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
                      {selectedContent.ai_explanation}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-gray max-w-none">
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed font-serif text-base">
                      {selectedContent.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center max-w-md">
              <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Welcome to the CBA Study Guide
              </h3>
              <p className="text-gray-600 mb-2">
                Browse through all 42 articles of the 2023 NBA Collective Bargaining Agreement
              </p>
              <p className="text-sm text-gray-500">
                Select an article from the left sidebar to begin studying
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

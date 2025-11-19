'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Bookmark,
  Highlighter,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useCBAContent, searchCBAContent, type CBAContent } from '@/lib/hooks/useStudyData';

interface ArticleGroup {
  article_number: number;
  article_title: string;
  sections: CBAContent[];
}

export function StudyGuideSection() {
  const { content, loading, error } = useCBAContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CBAContent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedArticles, setExpandedArticles] = useState<Set<number>>(new Set([7])); // Default open Article VII
  const [selectedContent, setSelectedContent] = useState<CBAContent | null>(null);
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Group content by article
  const articleGroups = content.reduce((acc, item) => {
    const existing = acc.find(g => g.article_number === item.article_number);
    if (existing) {
      existing.sections.push(item);
    } else {
      acc.push({
        article_number: item.article_number,
        article_title: item.article_title,
        sections: [item]
      });
    }
    return acc;
  }, [] as ArticleGroup[]);

  // Sort by article number
  articleGroups.sort((a, b) => a.article_number - b.article_number);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      const { data } = await searchCBAContent(searchTerm);
      setSearchResults(data || []);
      setIsSearching(false);
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const toggleArticle = (articleNumber: number) => {
    const newExpanded = new Set(expandedArticles);
    if (newExpanded.has(articleNumber)) {
      newExpanded.delete(articleNumber);
    } else {
      newExpanded.add(articleNumber);
    }
    setExpandedArticles(newExpanded);
  };

  const toggleHighlight = (contentId: string) => {
    const newHighlights = new Set(highlights);
    if (newHighlights.has(contentId)) {
      newHighlights.delete(contentId);
    } else {
      newHighlights.add(contentId);
    }
    setHighlights(newHighlights);
  };

  const toggleBookmark = (contentId: string) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(contentId)) {
      newBookmarks.delete(contentId);
    } else {
      newBookmarks.add(contentId);
    }
    setBookmarks(newBookmarks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-700 font-medium">Error loading CBA content</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const displayContent = searchTerm.trim().length >= 2 ? searchResults : [];
  const showSearchResults = searchTerm.trim().length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex h-screen">
        {/* Left Sidebar - Table of Contents */}
        <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 border-r border-slate-700 overflow-y-auto">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Study Guide</h2>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search CBA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
              )}
            </div>

            {showSearchResults && (
              <div className="mt-2 text-xs text-slate-400">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          {/* Article List or Search Results */}
          <div className="p-4">
            {showSearchResults ? (
              // Search Results
              searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedContent(item)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedContent?.id === item.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1">
                        Article {item.article_number}
                      </p>
                      <p className="text-sm font-medium line-clamp-2">
                        {item.section_title || item.article_title}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">No results found</p>
                </div>
              )
            ) : (
              // Article List
              articleGroups.map((article) => (
                <div key={article.article_number} className="mb-2">
                  <button
                    onClick={() => toggleArticle(article.article_number)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {expandedArticles.has(article.article_number) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <div className="text-left">
                        <p className="text-xs font-semibold text-blue-400">Article {article.article_number}</p>
                        <p className="text-sm font-medium text-white">{article.article_title}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{article.sections.length}</span>
                  </button>

                  <AnimatePresence>
                    {expandedArticles.has(article.article_number) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-7 mt-1 space-y-1"
                      >
                        {article.sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => setSelectedContent(section)}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                              selectedContent?.id === section.id
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="line-clamp-2">
                                {section.section_title || section.article_title}
                              </span>
                              {bookmarks.has(section.id) && (
                                <Bookmark className="w-3 h-3 text-blue-400 fill-current flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Bookmarks Section */}
          {bookmarks.size > 0 && (
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Bookmarks</h3>
                <span className="text-xs text-slate-400">({bookmarks.size})</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedContent ? (
            <div className="max-w-4xl mx-auto p-8">
              {/* Section Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    Article {selectedContent.article_number}
                  </span>
                  <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded-full">
                    {selectedContent.level}
                  </span>
                  {highlights.has(selectedContent.id) && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Highlighter className="w-3 h-3" />
                      Highlighted
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {selectedContent.article_title}
                </h1>
                {selectedContent.section_title && (
                  <h2 className="text-xl font-semibold text-slate-300 mb-4">
                    {selectedContent.section_title}
                  </h2>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleHighlight(selectedContent.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      highlights.has(selectedContent.id)
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <Highlighter className="w-4 h-4" />
                    {highlights.has(selectedContent.id) ? 'Highlighted' : 'Highlight'}
                  </button>
                  
                  <button
                    onClick={() => toggleBookmark(selectedContent.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bookmarks.has(selectedContent.id)
                        ? 'bg-blue-600 text-white border border-blue-500'
                        : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarks.has(selectedContent.id) ? 'fill-current' : ''}`} />
                    {bookmarks.has(selectedContent.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Ask AI
                  </button>
                </div>
              </div>

              {/* Content */}
              <motion.div
                key={selectedContent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-lg p-8 ${
                  highlights.has(selectedContent.id) ? 'ring-2 ring-yellow-500' : ''
                }`}
              >
                <div className="prose prose-slate prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {selectedContent.content}
                  </p>
                </div>
              </motion.div>

              {/* Navigation to Related Sections */}
              <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Article Navigation</h3>
                <div className="grid grid-cols-2 gap-3">
                  {content
                    .filter(item => 
                      item.article_number === selectedContent.article_number && 
                      item.id !== selectedContent.id
                    )
                    .slice(0, 4)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedContent(item)}
                        className="flex items-center gap-2 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-left"
                      >
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {item.section_title || item.article_title}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {content.length === 0 ? 'No Content Available' : 'Select a Section'}
                </h2>
                <p className="text-sm text-slate-300">
                  {content.length === 0 
                    ? 'CBA content has not been loaded yet'
                    : 'Choose an article from the left to begin studying'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

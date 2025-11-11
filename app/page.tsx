import Link from 'next/link';
import { BookOpen, Sparkles, Brain, GraduationCap, History, Zap, FileText, StickyNote } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap className="w-16 h-16 text-white" />
            <h1 className="text-6xl font-bold text-white">AgentPrep</h1>
          </div>
          <p className="text-2xl text-red-200 mb-4">
            Master the NBA CBA. Pass Your NBPA Agent Certification.
          </p>
          <p className="text-lg text-white max-w-2xl mx-auto">
            The complete study platform for aspiring NBA agents featuring 3,900+ practice questions, 
            AI-powered flashcards, custom test generation, and comprehensive CBA study guides.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Study Mode */}
          <Link href="/study">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-red-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl">
              <BookOpen className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">Study Mode</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Practice with 832 real questions covering all CBA topics. Instant feedback and progress tracking.
              </p>
              <div className="text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                Start Studying →
              </div>
            </div>
          </Link>

          {/* AI Flashcards - NEW! */}
          <Link href="/flashcards">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-red-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl relative">
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW!
              </div>
              <Zap className="w-10 h-10 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">AI Flashcards</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Study 3,060 AI-generated flashcards covering every NBA CBA section with smart filtering.
              </p>
              <div className="text-red-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                Study Cards →
              </div>
            </div>
          </Link>

          {/* Scenarios */}
          <Link href="/scenarios">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl">
              <FileText className="w-10 h-10 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">Scenarios</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Practice with real-world agent situations and complex CBA scenarios.
              </p>
              <div className="text-red-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                Practice Scenarios →
              </div>
            </div>
          </Link>

          {/* Study Guide */}
          <Link href="/guide">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl">
              <BookOpen className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">Study Guide</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Comprehensive CBA reference guide with all rules and regulations explained.
              </p>
              <div className="text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                Browse Guide →
              </div>
            </div>
          </Link>

          {/* AI Test Generator */}
          <Link href="/ai-generator">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-red-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl">
              <Sparkles className="w-10 h-10 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">AI Test Generator</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Create custom practice tests powered by Claude AI. Choose topics, difficulty, and question count.
              </p>
              <div className="text-red-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                Generate Test →
              </div>
            </div>
          </Link>

          {/* My Notes */}
          <Link href="/notes">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-blue-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl">
              <StickyNote className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">My Notes</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Personal study notes and key takeaways from your CBA preparation.
              </p>
              <div className="text-blue-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                View Notes →
              </div>
            </div>
          </Link>

          {/* Test History */}
          <Link href="/my-tests">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-red-200 hover:bg-white transition-all cursor-pointer group h-full shadow-lg hover:shadow-xl">
              <History className="w-10 h-10 text-red-600 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">My Test History</h2>
              <p className="text-gray-700 mb-4 text-sm">
                Review your past AI-generated tests, track your progress, and identify areas for improvement.
              </p>
              <div className="text-red-600 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-2 text-sm">
                View History →
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 border border-red-200 text-center shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Study with Confidence</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">3,060</div>
              <div className="text-gray-700">AI Flashcards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">832</div>
              <div className="text-gray-700">Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">42</div>
              <div className="text-gray-700">CBA Articles Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">99.8%</div>
              <div className="text-gray-700">CBA Coverage</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-white text-sm">
          <p>Built for aspiring NBA agents preparing for their NBPA certification exam</p>
          <p className="mt-2">© 2025 AgentPrep. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
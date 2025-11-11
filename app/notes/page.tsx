'use client';

import { StickyNote, ChevronLeft } from 'lucide-react';
import NotesTab from '@/components/NotesTab';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <StickyNote className="w-12 h-12 text-blue-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">My Notes</h1>
              <p className="text-lg text-blue-200">Personal study notes and key takeaways</p>
            </div>
          </div>
          
          {/* Back to Home */}
          <div className="mb-6">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-white hover:text-blue-300 transition-colors font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>

        {/* Notes Component */}
        <NotesTab />
      </div>
    </div>
  );
}

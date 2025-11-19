'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StickyNote, 
  Plus,
  Search,
  Tag,
  Calendar,
  Sparkles,
  Trash2,
  Edit,
  BookOpen,
  ChevronRight,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { useNotes, createNote, updateNote, deleteNote, useAuth, type Note } from '@/lib/hooks/useStudyData';

export function NotesSection() {
  const { user } = useAuth();
  const { notes, loading, error, refetch } = useNotes(user?.id || '');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[],
    tagInput: ''
  });

  const handleCreateNote = async () => {
    if (!user || !formData.title.trim()) return;

    setSaving(true);
    const result = await createNote({
      user_id: user.id,
      title: formData.title,
      content: formData.content,
      category: formData.category || 'General',
      tags: formData.tags
    });
    
    setSaving(false);
    
    if (result.data) {
      setIsCreating(false);
      setFormData({ title: '', content: '', category: '', tags: [], tagInput: '' });
      setSelectedNote(result.data);
      refetch();
    } else {
      alert('Failed to create note. Please try again.');
    }
  };

  const handleUpdateNote = async () => {
    if (!selectedNote) return;

    setSaving(true);
    const result = await updateNote(selectedNote.id, {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags
    });
    
    setSaving(false);
    
    if (result.data) {
      setIsEditing(false);
      setSelectedNote(result.data);
      refetch();
    } else {
      alert('Failed to update note. Please try again.');
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setDeleting(true);
    const result = await deleteNote(id);
    setDeleting(false);

    if (result.success) {
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      refetch();
    } else {
      alert('Failed to delete note. Please try again.');
    }
  };

  const startEditing = (note: Note) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
      tagInput: ''
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({ title: '', content: '', category: '', tags: [], tagInput: '' });
  };

  const addTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.tagInput.trim()],
        tagInput: ''
      });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Please Log In</h2>
          <p className="text-slate-300">You need to be logged in to access your notes</p>
        </div>
      </div>
    );
  }

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
          <p className="text-red-700 font-medium">Error loading notes</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex h-screen">
        {/* Left Sidebar - Notes List */}
        <div className="w-80 bg-gradient-to-br from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Notes</h2>
              <button
                onClick={() => {
                  setIsCreating(true);
                  setIsEditing(false);
                  setFormData({ title: '', content: '', category: '', tags: [], tagInput: '' });
                }}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotes.length === 0 && (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  {searchTerm ? 'No notes found' : 'No notes yet'}
                </p>
              </div>
            )}
            
            {filteredNotes.map((note) => (
              <motion.button
                key={note.id}
                onClick={() => {
                  setSelectedNote(note);
                  setIsCreating(false);
                  setIsEditing(false);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedNote?.id === note.id
                    ? 'bg-blue-600 border-2 border-blue-500 shadow-md'
                    : 'bg-slate-700 border-2 border-transparent hover:border-slate-600 hover:bg-slate-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="font-semibold text-white mb-1 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                  {note.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-600 text-slate-200 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-600 text-slate-200 text-xs rounded">
                        +{note.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(note.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {isCreating || isEditing ? (
            // Create/Edit Form
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {isCreating ? 'Create New Note' : 'Edit Note'}
                </h1>
                <p className="text-slate-300">
                  {isCreating ? 'Capture your study insights and key takeaways' : 'Update your note'}
                </p>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Salary Cap Key Points"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Salary Cap, Trade Rules, etc."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Write your notes here..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={formData.tagInput}
                      onChange={(e) => setFormData({ ...formData, tagInput: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a tag and press Enter"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={isCreating ? handleCreateNote : handleUpdateNote}
                    disabled={saving || !formData.title.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {isCreating ? 'Create Note' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      setFormData({ title: '', content: '', category: '', tags: [], tagInput: '' });
                    }}
                    className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : selectedNote ? (
            // View Note
            <div className="max-w-4xl mx-auto p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {selectedNote.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Created {new Date(selectedNote.created_at).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      {selectedNote.updated_at !== selectedNote.created_at && (
                        <span>
                          • Updated {new Date(selectedNote.updated_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(selectedNote)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      disabled={deleting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {deleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>

                {/* Category & Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    {selectedNote.category}
                  </span>
                  {selectedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 text-slate-300 text-sm font-medium rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Note Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-lg p-8 mb-6"
              >
                <div className="prose prose-slate prose-invert max-w-none">
                  {selectedNote.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-slate-300 leading-relaxed mb-4 last:mb-0 whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            // Empty State
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4">
                  <StickyNote className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {notes.length === 0 ? 'No Notes Yet' : 'No Note Selected'}
                </h2>
                <p className="text-sm text-slate-300 mb-6">
                  {notes.length === 0 
                    ? 'Create your first note to start capturing key insights'
                    : 'Select a note from the sidebar or create a new one'
                  }
                </p>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setFormData({ title: '', content: '', category: '', tags: [], tagInput: '' });
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create New Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

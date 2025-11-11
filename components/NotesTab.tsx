'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Star, Trash2, Edit2, Save, X, Tag, Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo, Type } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  is_important: boolean;
  created_at: string;
  updated_at: string;
}

const CBA_CATEGORIES = [
  { value: 'salary-cap', label: 'Salary Cap' },
  { value: 'luxury-tax', label: 'Luxury Tax' },
  { value: 'aprons', label: 'Aprons' },
  { value: 'exceptions', label: 'Exceptions' },
  { value: 'free-agency', label: 'Free Agency' },
  { value: 'trades', label: 'Trades' },
  { value: 'rookie-contracts', label: 'Rookie Contracts' },
  { value: 'max-salaries', label: 'Maximum Salaries' },
  { value: 'min-salaries', label: 'Minimum Salaries' },
  { value: 'extensions', label: 'Contract Extensions' },
  { value: 'two-way', label: 'Two-Way Contracts' },
  { value: 'waivers', label: 'Waivers' },
  { value: 'draft', label: 'Draft Picks' },
  { value: 'roster', label: 'Roster Management' },
  { value: 'contracts', label: 'Player Contracts' },
  { value: 'international', label: 'International Players' },
  { value: 'gleague', label: 'G-League Contracts' },
];

export default function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterImportant, setFilterImportant] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Check which formats are active at cursor position
  const updateActiveFormats = () => {
    const formats = new Set<string>();
    
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
    if (document.queryCommandState('insertOrderedList')) formats.add('ol');
    if (document.queryCommandState('justifyLeft')) formats.add('left');
    if (document.queryCommandState('justifyCenter')) formats.add('center');
    if (document.queryCommandState('justifyRight')) formats.add('right');
    
    setActiveFormats(formats);
  };

  const fetchNotes = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterImportant) params.append('important', 'true');

      const response = await fetch(`/api/notes?${params}`);
      const data = await response.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterCategory, filterImportant]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!isEditing || !selectedNote) return;

    const autoSaveTimer = setTimeout(async () => {
      if (title && content) {
        setAutoSaving(true);
        await saveNote();
        setAutoSaving(false);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, category, tags, isImportant, isEditing]);

  const createNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required!');
      return;
    }

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category: category || null,
          tags,
          is_important: isImportant,
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        setFilteredNotes([newNote, ...filteredNotes]);
        resetForm();
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
    }
  };

  const saveNote = async () => {
    if (!selectedNote || !title.trim() || !content.trim()) return;

    try {
      const response = await fetch('/api/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedNote.id,
          title,
          content,
          category: category || null,
          tags,
          is_important: isImportant,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
        setFilteredNotes(filteredNotes.map(n => n.id === updatedNote.id ? updatedNote : n));
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId));
        setFilteredNotes(filteredNotes.filter(n => n.id !== noteId));
        if (selectedNote?.id === noteId) {
          setSelectedNote(null);
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const toggleImportant = async (note: Note) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: note.id,
          is_important: !note.is_important,
        }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
        setFilteredNotes(filteredNotes.map(n => n.id === updatedNote.id ? updatedNote : n));
        if (selectedNote?.id === updatedNote.id) {
          setSelectedNote(updatedNote);
          setIsImportant(updatedNote.is_important);
        }
      }
    } catch (error) {
      console.error('Error toggling important:', error);
    }
  };

  const editNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || '');
    setTags(note.tags || []);
    setIsImportant(note.is_important);
    setIsEditing(true);
    setIsCreating(false);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = note.content;
      }
    }, 0);
  };

  const startNewNote = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
    setSelectedNote(null);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }, 0);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setTags([]);
    setTagInput('');
    setIsImportant(false);
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    resetForm();
    setSelectedNote(null);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Rich text editor commands
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
    updateActiveFormats();
  };

  const updateContent = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    updateContent();
  };

  const handleEditorKeyUp = () => {
    updateActiveFormats();
  };

  const handleEditorClick = () => {
    updateActiveFormats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* LEFT SIDEBAR */}
      <div className="w-72 flex flex-col bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">My Notes</h2>
            <button
              onClick={startNewNote}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {CBA_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <button
              onClick={() => setFilterImportant(!filterImportant)}
              className={`p-2 rounded-lg transition-colors ${
                filterImportant
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
              title="Filter important notes"
            >
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchTerm || filterCategory !== 'all' || filterImportant
                ? 'No notes found'
                : 'No notes yet. Create your first note!'}
            </div>
          ) : (
            <div className="p-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => editNote(note)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-blue-600/20 border border-blue-500'
                      : 'bg-gray-700/50 border border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm line-clamp-1">
                      {note.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleImportant(note);
                      }}
                      className="flex-shrink-0"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          note.is_important
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                    {note.content.replace(/<[^>]*>/g, '')}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {formatDate(note.updated_at)}
                    </span>
                    {note.category && (
                      <span className="px-2 py-0.5 bg-gray-600 text-gray-300 rounded">
                        {CBA_CATEGORIES.find(c => c.value === note.category)?.label}
                      </span>
                    )}
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Rich Text Editor */}
      <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 flex flex-col">
        {isCreating || isEditing ? (
          <>
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {isCreating ? 'New Note' : 'Edit Note'}
                </h3>
                {autoSaving && (
                  <span className="text-xs text-gray-400">Saving...</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isCreating ? (
                  <button
                    onClick={createNote}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Create Note
                  </button>
                ) : (
                  <button
                    onClick={saveNote}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                )}
                <button
                  onClick={cancelEdit}
                  className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                {isEditing && selectedNote && (
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white text-xl font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No category</option>
                    {CBA_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setIsImportant(!isImportant)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isImportant
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isImportant ? 'fill-current' : ''}`} />
                    Important
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm"
                      >
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* RICH TEXT EDITOR TOOLBAR */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <div className="bg-gray-700 border border-gray-600 rounded-t-lg p-2 flex flex-wrap gap-1">
                  <button
                    onClick={() => execCommand('bold')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('bold')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => execCommand('italic')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('italic')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => execCommand('underline')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('underline')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Underline (Ctrl+U)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => execCommand('insertUnorderedList')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('ul')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => execCommand('insertOrderedList')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('ol')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => execCommand('justifyLeft')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('left')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => execCommand('justifyCenter')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('center')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => execCommand('justifyRight')}
                    className={`p-2 rounded transition-colors ${
                      activeFormats.has('right')
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-600 text-gray-300 hover:text-white'
                    }`}
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-600 mx-1"></div>
                  
                  <select
                    onChange={(e) => execCommand('fontSize', e.target.value)}
                    className="px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500 focus:outline-none"
                    defaultValue="3"
                  >
                    <option value="1">Tiny</option>
                    <option value="2">Small</option>
                    <option value="3">Normal</option>
                    <option value="4">Large</option>
                    <option value="5">Huge</option>
                  </select>
                  
                  <input
                    type="color"
                    onChange={(e) => execCommand('foreColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                    title="Text Color"
                  />
                  
                  <input
                    type="color"
                    onChange={(e) => execCommand('hiliteColor', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-600"
                    title="Highlight Color"
                  />
                  
                  <div className="w-px h-6 bg-gray-600 mx-1"></div>
                  
                  <button
                    onClick={() => execCommand('undo')}
                    className="p-2 hover:bg-gray-600 rounded transition-colors text-gray-300 hover:text-white"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => execCommand('redo')}
                    className="p-2 hover:bg-gray-600 rounded transition-colors text-gray-300 hover:text-white"
                    title="Redo (Ctrl+Y)"
                  >
                    <Redo className="w-4 h-4" />
                  </button>
                </div>
                
                {/* RICH TEXT CONTENT EDITABLE DIV - BIGGER! */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  onKeyUp={handleEditorKeyUp}
                  onClick={handleEditorClick}
                  className="w-full min-h-[450px] max-h-[600px] overflow-y-auto px-4 py-3 bg-gray-700 border border-gray-600 border-t-0 rounded-b-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    lineHeight: '1.6',
                  }}
                  suppressContentEditableWarning
                />
                <style jsx global>{`
                  [contenteditable] ul {
                    list-style-type: disc;
                    padding-left: 2rem;
                    margin: 0.5rem 0;
                  }
                  [contenteditable] ol {
                    list-style-type: decimal;
                    padding-left: 2rem;
                    margin: 0.5rem 0;
                  }
                  [contenteditable] li {
                    margin: 0.25rem 0;
                    display: list-item;
                  }
                  [contenteditable] ul ul {
                    list-style-type: circle;
                    padding-left: 1.5rem;
                  }
                  [contenteditable] ul ul ul {
                    list-style-type: square;
                  }
                `}</style>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Edit2 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg">Select a note to edit</p>
              <p className="text-sm mt-2">or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
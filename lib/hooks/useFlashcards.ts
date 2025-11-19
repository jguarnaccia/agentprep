import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  total_cards: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function useFlashcardSets() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSets() {
      const { data, error } = await supabase
        .from('flashcard_sets')
        .select('*, flashcards(count)');

      if (!error && data) {
        const formatted = data.map((set: any) => ({
          ...set,
          description: set.category || 'No description',
          total_cards: set.flashcards ? set.flashcards[0]?.count : 0
        }));
        setSets(formatted);
      }
      setLoading(false);
    }
    fetchSets();
  }, []);

  return { sets, loading };
}

export function useFlashcards(setId: string | null) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!setId) return;

    async function fetchCards() {
      setLoading(true);
      const { data } = await supabase
        .from('flashcards')
        .select('*')
        .eq('set_id', setId);
      
      if (data) setCards(data);
      setLoading(false);
    }
    fetchCards();
  }, [setId]);

  return { cards, loading };
}
'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { NotesSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <NotesSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { FlashcardsSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function FlashcardsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <FlashcardsSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

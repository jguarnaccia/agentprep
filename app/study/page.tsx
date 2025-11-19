'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { StudyModeSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function StudyPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <StudyModeSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { StudyGuideSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function GuidePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <StudyGuideSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

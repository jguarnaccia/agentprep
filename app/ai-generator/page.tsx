'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { AITestGeneratorSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AIGeneratorPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <AITestGeneratorSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { ScenariosSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ScenariosPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ScenariosSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { MyTestsSection } from '@/components/study-sections';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function MyTestsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <MyTestsSection />
      </AppLayout>
    </ProtectedRoute>
  );
}

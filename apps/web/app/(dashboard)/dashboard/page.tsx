import { DashboardContent } from '@orc/web/components/dashboard/dashboard-client';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  return (
    <>
      <DashboardContent />
    </>
  );
}

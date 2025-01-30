import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';

export const metadata = {
  title: 'Test',
};

export default async function TestPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Test page"
        text="Just a page for testing"
      />
    </DashboardShell>
  );
}

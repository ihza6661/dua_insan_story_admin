import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full bg-muted/10">
      <Sidebar className="hidden lg:flex lg:w-[260px] xl:w-[300px]" />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

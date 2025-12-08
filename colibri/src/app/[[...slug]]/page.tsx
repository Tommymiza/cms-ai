"use client";
import NotFoundPage from "@/components/pages/NotFound";
import Standard from "@/components/pages/Standard";
import Loading from "@/components/utils/loading";
import useSite from "@/hooks/use-site";
import { usePageStore } from "@/stores/page";

export default function PageContainer() {
  const { isLoading } = useSite();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  return <TypePage />;
}

function TypePage() {
  const { page } = usePageStore();
  if (!page) return <NotFoundPage />;
  return <Standard />;
}

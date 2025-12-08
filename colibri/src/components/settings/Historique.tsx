"use client";

import useRefreshPage from "@/hooks/use-refresh-page";
import { useState } from "react";
import { toast } from "sonner";

export default function Historique() {
  const { refreshPage } = useRefreshPage();
  const [loading, setLoading] = useState<boolean>(false);

  const handleReturn = async (documentId: string) => {
    try {
      setLoading(true);
      toast.success("Site returned successfully");
      refreshPage();
    } catch (error) {
      console.error("Error returning site:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <ul className="space-y-2"></ul>
    </div>
  );
}

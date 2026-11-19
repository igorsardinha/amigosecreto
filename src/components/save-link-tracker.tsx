"use client";

import { useEffect } from "react";
import { saveUserLink } from "@/lib/storage";

interface SaveLinkTrackerProps {
  type: "participant" | "host";
  name: string;
  groupName: string;
  url: string;
}

export function SaveLinkTracker({ type, name, groupName, url }: SaveLinkTrackerProps) {
  useEffect(() => {
    saveUserLink({
      type,
      name,
      groupName,
      url,
      savedAt: new Date().toISOString(),
    });
  }, [type, name, groupName, url]);

  return null;
}

import React from "react";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: { tab: string };
}

const validTabs = [
  "published",
  "draft",
  "pending",
  "trash",
  "schedule",
];

export default function Page({ params }: PageProps) {
  const { tab } = params;

  if (!validTabs.includes(tab)) {
    notFound();
  }

  // You can add your data fetching logic here (client or server component)
  // For now, just show the tab name as a placeholder
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard Posts - {tab}</h1>
      <p>This is the App Router version of the dashboard posts page for the "{tab}" tab.</p>
      {/* TODO: Add your post list and logic here */}
    </div>
  );
} 
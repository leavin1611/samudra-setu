import { Dashboard } from "@/components/home/Dashboard";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HighPriorityAlert } from "@/components/home/HighPriorityAlert";
import { RecentFeeds } from "@/components/home/RecentFeeds";
import { RecentReports } from "@/components/home/RecentReports";

export default function Home() {
  return (
    <>
      <Hero />
      <HighPriorityAlert />
      <Dashboard />
      <RecentFeeds />
      <RecentReports />
      <Features />
    </>
  );
}

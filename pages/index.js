import Head from "next/head";
import Link from "next/link";
import { useState, useCallback } from "react";
import NoticeCard from "@/components/NoticeCard";

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  );
}

function IconRefresh({ spinning }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
    >
      <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8 text-slate-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-300">No notices yet</h3>
      <p className="mb-6 text-sm text-slate-500">
        Get started by creating your first notice.
      </p>
      <Link href="/notices/create" className="btn-primary" id="empty-create-notice-btn">
        <IconPlus />
        Create Notice
      </Link>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-900/50 bg-red-500/10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-red-500">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-300">Failed to load notices</h3>
      <p className="mb-6 text-sm text-slate-500">{message}</p>
      <button onClick={onRetry} className="btn-secondary" id="retry-load-btn">
        <IconRefresh />
        Try Again
      </button>
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="mb-4 flex gap-2">
        <div className="h-5 w-14 rounded-full bg-slate-800" />
        <div className="h-5 w-16 rounded-full bg-slate-800" />
      </div>
      <div className="mb-2 h-4 w-3/4 rounded bg-slate-800" />
      <div className="mb-1 h-3 w-full rounded bg-slate-800" />
      <div className="mb-1 h-3 w-5/6 rounded bg-slate-800" />
      <div className="mb-5 h-3 w-2/3 rounded bg-slate-800" />
      <div className="border-t border-slate-800 pt-3">
        <div className="h-3 w-24 rounded bg-slate-800" />
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────
function StatsBar({ notices }) {
  const urgentCount  = notices.filter((n) => n.priority === "Urgent").length;
  const normalCount  = notices.filter((n) => n.priority === "Normal").length;
  const examCount    = notices.filter((n) => n.category === "Exam").length;
  const eventCount   = notices.filter((n) => n.category === "Event").length;
  const generalCount = notices.filter((n) => n.category === "General").length;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
      <span className="font-medium text-slate-300">{notices.length} notice{notices.length !== 1 ? "s" : ""}</span>
      <span className="text-slate-700">·</span>
      {urgentCount  > 0 && <span className="text-red-400">{urgentCount} urgent</span>}
      {normalCount  > 0 && <span>{normalCount} normal</span>}
      {examCount    > 0 && <><span className="text-slate-700">·</span><span className="text-violet-400">{examCount} exam</span></>}
      {eventCount   > 0 && <><span className="text-slate-700">·</span><span className="text-emerald-400">{eventCount} event</span></>}
      {generalCount > 0 && <><span className="text-slate-700">·</span><span className="text-sky-400">{generalCount} general</span></>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home({ initialNotices, fetchError }) {
  const [notices, setNotices]     = useState(initialNotices ?? []);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError]         = useState(fetchError ?? null);

  // Allow inline refresh without full page reload
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Server error while refreshing.");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Optimistic removal — remove the card immediately after delete
  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  const isLoading = isRefreshing && notices.length === 0;

  return (
    <>
      <Head>
        <title>Notice Board</title>
        <meta name="description" content="Browse and manage all notices — exams, events, and general announcements sorted by priority." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="page-container">
        {/* ── Gradient hero header ── */}
        <header className="relative overflow-hidden border-b border-slate-800 bg-slate-900/50">
          {/* Background glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="content-container relative py-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {/* Eyebrow */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-1.5 w-6 rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                    Notice Board
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
                  All Notices
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Urgent notices always appear first.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={refresh}
                  disabled={isRefreshing}
                  className="btn-secondary"
                  id="refresh-notices-btn"
                  aria-label="Refresh notices"
                  title="Refresh"
                >
                  <IconRefresh spinning={isRefreshing} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <Link href="/notices/create" className="btn-primary" id="header-create-notice-btn">
                  <IconPlus />
                  New Notice
                </Link>
              </div>
            </div>

            {/* Stats — only show when we have data */}
            {!error && notices.length > 0 && (
              <div className="mt-5">
                <StatsBar notices={notices} />
              </div>
            )}
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="content-container py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={refresh} />
          ) : notices.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDeleted={handleDeleted}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

// ─── SSR: fetch notices at page load — data is always fresh ──────────────────
export async function getServerSideProps(context) {
  try {
    // Build absolute URL for the API call from the server
    const protocol = context.req.headers["x-forwarded-proto"] ?? "http";
    const host     = context.req.headers.host;
    const baseUrl  = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/notices`);

    if (!res.ok) {
      return {
        props: {
          initialNotices: [],
          fetchError: "Failed to load notices from server.",
        },
      };
    }

    const notices = await res.json();
    return { props: { initialNotices: notices, fetchError: null } };
  } catch {
    return {
      props: {
        initialNotices: [],
        fetchError: "Unable to connect to the database.",
      },
    };
  }
}

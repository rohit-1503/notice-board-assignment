import Head from "next/head";
import Link from "next/link";
import NoticeForm from "@/components/NoticeForm";

// ─── Back arrow icon ──────────────────────────────────────────────────────────
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
  );
}

export default function CreateNotice() {
  return (
    <>
      <Head>
        <title>Create Notice — Notice Board</title>
        <meta name="description" content="Add a new notice to the notice board. Set title, body, category, priority, and publish date." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page-container">
        {/* ── Header ── */}
        <header className="border-b border-slate-800 bg-slate-900/50">
          <div className="content-container py-6">
            {/* Breadcrumb */}
            <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-slate-300">
                <IconArrowLeft />
                Notice Board
              </Link>
              <span>/</span>
              <span className="text-slate-300">Create Notice</span>
            </nav>

            {/* Title row */}
            <div className="flex items-center gap-3">
              {/* Icon badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-indigo-400">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-50">Create Notice</h1>
                <p className="text-sm text-slate-400">Fill in the details to publish a new notice.</p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Form card ── */}
        <main className="content-container py-8">
          <div className="mx-auto max-w-2xl">
            <div className="card p-6 sm:p-8">
              <NoticeForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

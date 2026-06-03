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

// ─── Skeleton loader (while SSR data is being fetched) ────────────────────────
function PageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="card p-6 sm:p-8 space-y-6">
        {[60, 120, 40, 40, 40].map((h, i) => (
          <div key={i} className={`h-${Math.min(h, 10)} rounded-lg bg-slate-800`} style={{ height: h }} />
        ))}
      </div>
    </div>
  );
}

// ─── Not Found state ──────────────────────────────────────────────────────────
function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-slate-600">
          <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM9.75 17.25a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zm2.25-3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-4.5z" clipRule="evenodd" />
          <path d="M14.25 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0016.5 7.5h-1.875a.375.375 0 01-.375-.375V5.25z" />
        </svg>
      </div>
      <h2 className="mb-1 text-base font-semibold text-slate-300">Notice not found</h2>
      <p className="mb-6 text-sm text-slate-500">
        This notice may have been deleted or the ID is invalid.
      </p>
      <Link href="/" className="btn-secondary" id="back-to-board-btn">
        <IconArrowLeft />
        Back to Notice Board
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EditNotice({ notice, fetchError }) {
  if (fetchError === "not_found") {
    return (
      <>
        <Head>
          <title>Notice Not Found — Notice Board</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="page-container">
          <main className="content-container py-8">
            <NotFoundState />
          </main>
        </div>
      </>
    );
  }

  if (fetchError) {
    return (
      <>
        <Head>
          <title>Error — Notice Board</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="page-container">
          <main className="content-container py-8">
            <div className="mx-auto max-w-2xl rounded-xl border border-red-900/40 bg-red-500/10 p-6 text-center">
              <p className="text-sm text-red-400">{fetchError}</p>
              <Link href="/" className="btn-secondary mt-4 inline-flex">
                <IconArrowLeft /> Back to Notice Board
              </Link>
            </div>
          </main>
        </div>
      </>
    );
  }

  const isUrgent = notice?.priority === "Urgent";

  return (
    <>
      <Head>
        <title>{notice ? `Edit: ${notice.title}` : "Edit Notice"} — Notice Board</title>
        <meta name="description" content={notice ? `Edit notice: ${notice.title}` : "Edit a notice on the notice board."} />
        <meta name="robots" content="noindex" />
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
              <span className="max-w-xs truncate text-slate-300">
                {notice?.title ?? "Edit Notice"}
              </span>
            </nav>

            {/* Title row */}
            <div className="flex items-center gap-3">
              {/* Icon badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-amber-400">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-50">Edit Notice</h1>
                  {isUrgent && (
                    <span className="badge-urgent text-xs">Urgent</span>
                  )}
                </div>
                <p className="max-w-lg truncate text-sm text-slate-400">
                  {notice?.title}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── Form card ── */}
        <main className="content-container py-8">
          <div className="mx-auto max-w-2xl">
            <div className="card p-6 sm:p-8">
              <NoticeForm
                initialData={notice}
                isEditing={true}
                noticeId={notice?.id}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// ─── SSR: fetch the single notice for pre-population ─────────────────────────
export async function getServerSideProps(context) {
  const { id } = context.params;

  // Guard: id must be a positive integer
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId <= 0) {
    return { props: { notice: null, fetchError: "not_found" } };
  }

  try {
    const protocol = context.req.headers["x-forwarded-proto"] ?? "http";
    const host     = context.req.headers.host;
    const baseUrl  = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/notices/${parsedId}`);

    if (res.status === 404) {
      return { props: { notice: null, fetchError: "not_found" } };
    }

    if (!res.ok) {
      return {
        props: {
          notice: null,
          fetchError: "Failed to load notice. Please try again.",
        },
      };
    }

    const notice = await res.json();

    // Serialize dates to strings so Next.js can pass them as props
    return {
      props: {
        notice: {
          ...notice,
          publishDate: notice.publishDate ?? null,
          createdAt:   notice.createdAt   ?? null,
          updatedAt:   notice.updatedAt   ?? null,
        },
        fetchError: null,
      },
    };
  } catch {
    return {
      props: {
        notice: null,
        fetchError: "Unable to connect to the database.",
      },
    };
  }
}

import { useState } from "react";
import { useRouter } from "next/router";

// ─── Category color map ──────────────────────────────────────────────────────
const CATEGORY_STYLES = {
  Exam:    "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/30",
  Event:   "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
  General: "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ notice, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50">
        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 ring-1 ring-red-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6 text-red-400">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="mb-1 text-center text-base font-semibold text-slate-100">
          Delete Notice
        </h3>
        <p className="mb-1 text-center text-sm text-slate-400">
          Are you sure you want to delete
        </p>
        <p className="mb-6 text-center text-sm font-medium text-slate-200 line-clamp-2">
          &ldquo;{notice.title}&rdquo;?
        </p>
        <p className="mb-6 text-center text-xs text-slate-500">
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-danger flex-1"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── NoticeCard ────────────────────────────────────────────────────────────────
export default function NoticeCard({ notice, onDeleted }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUrgent = notice.priority === "Urgent";

  const formattedDate = notice.publishDate
    ? new Date(notice.publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete notice.");
      }

      setShowModal(false);
      onDeleted(notice.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <article
        className={`card group flex flex-col gap-4 p-5 hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-xl ${
          isUrgent ? "border-red-500/20 hover:border-red-500/40" : ""
        }`}
      >
        {/* ── Top row: badges + actions ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {isUrgent && (
              <span className="badge-urgent">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 01-1.299 2.25H2.804a1.5 1.5 0 01-1.3-2.25l5.197-9zM8 4a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 4zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Urgent
              </span>
            )}
            {!isUrgent && <span className="badge-normal">Normal</span>}

            <span className={`badge-category ${CATEGORY_STYLES[notice.category] ?? CATEGORY_STYLES.General}`}>
              {notice.category}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              id={`edit-notice-${notice.id}`}
              onClick={() => router.push(`/notices/edit/${notice.id}`)}
              className="btn-icon"
              title="Edit notice"
              aria-label={`Edit notice: ${notice.title}`}
            >
              <IconEdit />
            </button>
            <button
              id={`delete-notice-${notice.id}`}
              onClick={() => setShowModal(true)}
              className="btn-icon text-red-400 hover:bg-red-500/10 hover:text-red-300"
              title="Delete notice"
              aria-label={`Delete notice: ${notice.title}`}
            >
              <IconTrash />
            </button>
          </div>
        </div>

        {/* ── Optional image ── */}
        {notice.image && (
          <div className="overflow-hidden rounded-lg">
            <img
              src={notice.image}
              alt={notice.title}
              className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        )}

        {/* ── Title + Body ── */}
        <div className="flex-1">
          <h2 className="mb-2 text-base font-semibold leading-snug text-slate-100 group-hover:text-white">
            {notice.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-400 line-clamp-3">
            {notice.body}
          </p>
        </div>

        {/* ── Footer: date ── */}
        {formattedDate && (
          <div className="flex items-center gap-1.5 border-t border-slate-800 pt-3 text-xs text-slate-500">
            <IconCalendar />
            <span>{formattedDate}</span>
          </div>
        )}
      </article>

      {/* ── Delete confirmation modal ── */}
      {showModal && (
        <DeleteModal
          notice={notice}
          onConfirm={handleDelete}
          onCancel={() => !isDeleting && setShowModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

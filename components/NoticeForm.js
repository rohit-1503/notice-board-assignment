import { useState } from "react";
import { useRouter } from "next/router";

// ─── Field metadata ───────────────────────────────────────────────────────────
const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  // Returns YYYY-MM-DD for <input type="date">
  return d.toISOString().split("T")[0];
}

// ─── Individual field error message ──────────────────────────────────────────
function FieldError({ message }) {
  if (!message) return null;
  return <p className="form-error">{message}</p>;
}

// ─── NoticeForm ───────────────────────────────────────────────────────────────
// Props:
//   initialData  — pre-filled values when editing (optional)
//   isEditing    — boolean; changes submit URL + HTTP method
//   noticeId     — id of notice being edited (only needed when isEditing=true)
export default function NoticeForm({ initialData = {}, isEditing = false, noticeId }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title:       initialData.title       ?? "",
    body:        initialData.body        ?? "",
    category:    initialData.category    ?? "General",
    priority:    initialData.priority    ?? "Normal",
    publishDate: toDateInputValue(initialData.publishDate) || toDateInputValue(new Date().toISOString()),
    image:       initialData.image       ?? "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Controlled input handler ────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the individual field error as the user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // ── Client-side validation (mirrors server rules) ──────────────────────────
  function validate() {
    const errors = {};
    if (!form.title.trim())       errors.title = "Title is required.";
    if (!form.body.trim())        errors.body  = "Body is required.";
    if (!CATEGORIES.includes(form.category)) errors.category = "Please select a valid category.";
    if (!PRIORITIES.includes(form.priority)) errors.priority = "Please select a valid priority.";
    if (!form.publishDate) {
      errors.publishDate = "Publish date is required.";
    } else if (isNaN(new Date(form.publishDate).getTime())) {
      errors.publishDate = "Please enter a valid date.";
    }
    return errors;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const url    = isEditing ? `/api/notices/${noticeId}` : "/api/notices";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       form.title.trim(),
          body:        form.body.trim(),
          category:    form.category,
          priority:    form.priority,
          publishDate: form.publishDate,
          image:       form.image.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show server validation details if present
        if (data.details && Array.isArray(data.details)) {
          setServerError(data.details.join(" "));
        } else {
          setServerError(data.error || "Something went wrong.");
        }
        return;
      }

      router.push("/");
    } catch (err) {
      setServerError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label={isEditing ? "Edit notice form" : "Create notice form"}
    >
      {/* ── Server error banner ── */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* ── Title ── */}
      <div>
        <label htmlFor="title" className="form-label">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          placeholder="Enter notice title…"
          value={form.title}
          onChange={handleChange}
          className={`form-input ${fieldErrors.title ? "border-red-500 focus:ring-red-500/20" : ""}`}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
        />
        <FieldError message={fieldErrors.title} />
      </div>

      {/* ── Body ── */}
      <div>
        <label htmlFor="body" className="form-label">
          Body <span className="text-red-400">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          placeholder="Write the notice content…"
          value={form.body}
          onChange={handleChange}
          className={`form-textarea ${fieldErrors.body ? "border-red-500 focus:ring-red-500/20" : ""}`}
          aria-describedby={fieldErrors.body ? "body-error" : undefined}
        />
        <FieldError message={fieldErrors.body} />
      </div>

      {/* ── Category + Priority (side-by-side on md+) ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label htmlFor="category" className="form-label">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`form-select ${fieldErrors.category ? "border-red-500 focus:ring-red-500/20" : ""}`}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.category} />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="form-label">
            Priority <span className="text-red-400">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`form-select ${fieldErrors.priority ? "border-red-500 focus:ring-red-500/20" : ""}`}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.priority} />
        </div>
      </div>

      {/* ── Publish Date ── */}
      <div>
        <label htmlFor="publishDate" className="form-label">
          Publish Date <span className="text-red-400">*</span>
        </label>
        <input
          id="publishDate"
          name="publishDate"
          type="date"
          value={form.publishDate}
          onChange={handleChange}
          className={`form-input [color-scheme:dark] ${fieldErrors.publishDate ? "border-red-500 focus:ring-red-500/20" : ""}`}
          aria-describedby={fieldErrors.publishDate ? "publishDate-error" : undefined}
        />
        <FieldError message={fieldErrors.publishDate} />
      </div>

      {/* ── Image URL (optional) ── */}
      <div>
        <label htmlFor="image" className="form-label">
          Image URL{" "}
          <span className="text-xs font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="image"
          name="image"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={form.image}
          onChange={handleChange}
          className="form-input"
        />
        {/* Live preview */}
        {form.image && (
          <div className="mt-3 overflow-hidden rounded-lg border border-slate-700">
            <img
              src={form.image}
              alt="Preview"
              className="h-36 w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        )}
      </div>

      {/* ── Submit + Cancel ── */}
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          id="submit-notice-form"
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isEditing ? "Saving…" : "Creating…"}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Notice"
          )}
        </button>
      </div>
    </form>
  );
}

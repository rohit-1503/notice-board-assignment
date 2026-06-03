import prisma from "@/lib/prisma";

// Valid enum values — kept in sync with prisma/schema.prisma
const VALID_CATEGORIES = ["Exam", "Event", "General"];
const VALID_PRIORITIES = ["Normal", "Urgent"];

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getNotices(req, res);
  }

  if (req.method === "POST") {
    return createNotice(req, res);
  }

  return res
    .status(405)
    .json({ error: `Method ${req.method} not allowed on this route.` });
}

// ─── GET /api/notices ────────────────────────────────────────────────────────
// Returns all notices sorted: Urgent first, then by publishDate desc.
// Sorting is done entirely at the database level via Prisma orderBy.

async function getNotices(req, res) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        // Prisma sorts enums alphabetically — "Normal" < "Urgent" alphabetically,
        // so we need 'desc' to put Urgent (later in alphabet) first.
        { priority: "desc" },
        { publishDate: "desc" },
      ],
    });

    return res.status(200).json(notices);
  } catch (error) {
    console.error("[GET /api/notices]", error);
    return res.status(500).json({ error: "Failed to fetch notices." });
  }
}

// ─── POST /api/notices ───────────────────────────────────────────────────────
// Creates a new notice after server-side validation.

async function createNotice(req, res) {
  const { title, body, category, priority, publishDate, image } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  const errors = validateNoticePayload({ title, body, category, priority, publishDate });
  if (errors.length > 0) {
    return res.status(422).json({ error: "Validation failed.", details: errors });
  }

  try {
    const notice = await prisma.notice.create({
      data: {
        title:       title.trim(),
        body:        body.trim(),
        category:    category,
        priority:    priority,
        publishDate: new Date(publishDate),
        image:       image?.trim() || null,
      },
    });

    return res.status(201).json(notice);
  } catch (error) {
    console.error("[POST /api/notices]", error);
    return res.status(500).json({ error: "Failed to create notice." });
  }
}

// ─── Shared Validator ─────────────────────────────────────────────────────────

function validateNoticePayload({ title, body, category, priority, publishDate }) {
  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("title is required and cannot be empty.");
  }

  if (!body || typeof body !== "string" || body.trim() === "") {
    errors.push("body is required and cannot be empty.");
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(
      `category is required and must be one of: ${VALID_CATEGORIES.join(", ")}.`
    );
  }

  if (!priority || !VALID_PRIORITIES.includes(priority)) {
    errors.push(
      `priority is required and must be one of: ${VALID_PRIORITIES.join(", ")}.`
    );
  }

  if (!publishDate) {
    errors.push("publishDate is required.");
  } else {
    const date = new Date(publishDate);
    if (isNaN(date.getTime())) {
      errors.push("publishDate must be a valid date string (e.g. YYYY-MM-DD).");
    }
  }

  return errors;
}

import prisma from "@/lib/prisma";

// Valid enum values — kept in sync with prisma/schema.prisma
const VALID_CATEGORIES = ["Exam", "Event", "General"];
const VALID_PRIORITIES = ["Normal", "Urgent"];

export default async function handler(req, res) {
  // Parse and validate the id param early — shared by all methods
  const id = parseInt(req.query.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "id must be a positive integer." });
  }

  if (req.method === "GET") {
    return getNotice(req, res, id);
  }

  if (req.method === "PUT") {
    return updateNotice(req, res, id);
  }

  if (req.method === "DELETE") {
    return deleteNotice(req, res, id);
  }

  return res
    .status(405)
    .json({ error: `Method ${req.method} not allowed on this route.` });
}

// ─── GET /api/notices/[id] ───────────────────────────────────────────────────
// Returns a single notice by id.

async function getNotice(req, res, id) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      return res.status(404).json({ error: `Notice with id ${id} not found.` });
    }

    return res.status(200).json(notice);
  } catch (error) {
    console.error(`[GET /api/notices/${id}]`, error);
    return res.status(500).json({ error: "Failed to fetch notice." });
  }
}

// ─── PUT /api/notices/[id] ───────────────────────────────────────────────────
// Replaces all editable fields on a notice.
// Partial updates (PATCH) are not needed — the form always sends all fields.

async function updateNotice(req, res, id) {
  const { title, body, category, priority, publishDate, image } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  const errors = validateNoticePayload({ title, body, category, priority, publishDate });
  if (errors.length > 0) {
    return res.status(422).json({ error: "Validation failed.", details: errors });
  }

  try {
    // Verify the record exists before attempting update
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Notice with id ${id} not found.` });
    }

    const updated = await prisma.notice.update({
      where: { id },
      data: {
        title:       title.trim(),
        body:        body.trim(),
        category:    category,
        priority:    priority,
        publishDate: new Date(publishDate),
        image:       image?.trim() || null,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(`[PUT /api/notices/${id}]`, error);
    return res.status(500).json({ error: "Failed to update notice." });
  }
}

// ─── DELETE /api/notices/[id] ────────────────────────────────────────────────
// Permanently removes a notice by id.

async function deleteNotice(req, res, id) {
  try {
    // Verify the record exists before attempting delete
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: `Notice with id ${id} not found.` });
    }

    await prisma.notice.delete({ where: { id } });

    return res.status(200).json({ message: `Notice ${id} deleted successfully.` });
  } catch (error) {
    console.error(`[DELETE /api/notices/${id}]`, error);
    return res.status(500).json({ error: "Failed to delete notice." });
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

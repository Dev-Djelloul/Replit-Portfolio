import { Router } from "express";
import { db } from "@workspace/db";
import { projectMediaTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const AddMediaSchema = z.object({
  objectPath: z.string().min(1),
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  mediaType: z.enum(["image", "document", "video"]),
  displayOrder: z.number().int().optional().default(0),
});

// GET /api/media/:projectId
router.get("/media/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const media = await db
    .select()
    .from(projectMediaTable)
    .where(eq(projectMediaTable.projectId, projectId))
    .orderBy(projectMediaTable.displayOrder, projectMediaTable.createdAt);
  res.json(media);
});

// POST /api/media/:projectId
router.post("/media/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const parsed = AddMediaSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues.map((i) => i.message).join(", ") });
    return;
  }
  const [item] = await db
    .insert(projectMediaTable)
    .values({ projectId, ...parsed.data })
    .returning();
  res.status(201).json(item);
});

// DELETE /api/media/:projectId/:mediaId
router.delete("/media/:projectId/:mediaId", async (req, res) => {
  const projectId = req.params.projectId;
  const mediaId = parseInt(req.params.mediaId);
  if (isNaN(mediaId)) {
    res.status(400).json({ error: "Invalid media ID" });
    return;
  }
  const deleted = await db
    .delete(projectMediaTable)
    .where(and(eq(projectMediaTable.id, mediaId), eq(projectMediaTable.projectId, projectId)))
    .returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Media item not found" });
    return;
  }
  res.json({ success: true });
});

export default router;

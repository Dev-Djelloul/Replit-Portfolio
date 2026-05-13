import { Router } from "express";
import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";

const router = Router();

function getNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY environment variable is not set");
  }
  return new Client({ auth: apiKey });
}

type NotionProperty = PageObjectResponse["properties"][string];

function extractText(prop: NotionProperty | undefined): string | null {
  if (!prop) return null;
  if (prop.type === "title") {
    return prop.title.map((t) => t.plain_text).join("") || null;
  }
  if (prop.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("") || null;
  }
  if (prop.type === "url") return prop.url;
  if (prop.type === "email") return prop.email;
  if (prop.type === "phone_number") return prop.phone_number;
  if (prop.type === "number") return prop.number?.toString() ?? null;
  return null;
}

function extractSelect(prop: NotionProperty | undefined): string | null {
  if (!prop) return null;
  if (prop.type === "select") return prop.select?.name ?? null;
  if (prop.type === "status") return prop.status?.name ?? null;
  return null;
}

function extractMultiSelect(prop: NotionProperty | undefined): string[] {
  if (!prop) return [];
  if (prop.type === "multi_select") return prop.multi_select.map((s) => s.name);
  return [];
}

function extractCoverUrl(page: PageObjectResponse): string | null {
  const cover = page.cover;
  if (!cover) return null;
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return null;
}

function guessCategory(page: PageObjectResponse): string {
  const props = page.properties;

  // Try common property names for category
  const categoryPropNames = ["Category", "Type", "Catégorie", "Tags", "Project Type", "Kind"];
  for (const name of categoryPropNames) {
    const val = extractSelect(props[name]);
    if (val) return val;
  }

  // Try multi_select fields
  const multiTagPropNames = ["Tags", "Label", "Labels"];
  for (const name of multiTagPropNames) {
    const tags = extractMultiSelect(props[name]);
    if (tags.length > 0) return tags[0];
  }

  return "Other";
}

function guessStatus(page: PageObjectResponse): string {
  const props = page.properties;
  const statusPropNames = ["Status", "Statut", "State", "Progress"];
  for (const name of statusPropNames) {
    const val = extractSelect(props[name]);
    if (val) return val;
  }
  return "Unknown";
}

function guessTags(page: PageObjectResponse): string[] {
  const props = page.properties;
  const tagPropNames = ["Tags", "Labels", "Label", "Keywords"];
  for (const name of tagPropNames) {
    const tags = extractMultiSelect(props[name]);
    if (tags.length > 0) return tags;
  }
  return [];
}

function extractTitle(page: PageObjectResponse): string {
  const props = page.properties;
  for (const prop of Object.values(props)) {
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("") || "Untitled";
    }
  }
  return "Untitled";
}

function extractDescription(page: PageObjectResponse): string | null {
  const props = page.properties;
  const descPropNames = ["Description", "Summary", "Notes", "Note", "Résumé", "Details"];
  for (const name of descPropNames) {
    const val = extractText(props[name]);
    if (val) return val;
  }
  return null;
}

function mapPageToProject(page: PageObjectResponse) {
  return {
    id: page.id,
    title: extractTitle(page),
    description: extractDescription(page),
    category: guessCategory(page),
    status: guessStatus(page),
    tags: guessTags(page),
    coverUrl: extractCoverUrl(page),
    notionUrl: page.url,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  };
}

// GET /api/projects
router.get("/projects", async (req, res) => {
  const log = req.log;
  try {
    const notion = getNotionClient();
    const { search, category } = req.query as { search?: string; category?: string };

    // Search all pages in the workspace that the integration has access to
    const searchResponse = await notion.search({
      query: search || "",
      filter: { value: "page", property: "object" },
      sort: { direction: "descending", timestamp: "last_edited_time" },
      page_size: 100,
    });

    let projects = searchResponse.results
      .filter((r): r is PageObjectResponse => r.object === "page" && "properties" in r)
      .map(mapPageToProject);

    if (category) {
      projects = projects.filter(
        (p) => p.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    res.json(projects);
  } catch (err) {
    log.error({ err }, "Failed to fetch projects from Notion");
    res.status(500).json({ error: "Failed to fetch projects from Notion" });
  }
});

// GET /api/projects/stats
router.get("/projects/stats", async (req, res) => {
  const log = req.log;
  try {
    const notion = getNotionClient();

    const searchResponse = await notion.search({
      filter: { value: "page", property: "object" },
      page_size: 100,
    });

    const projects = searchResponse.results
      .filter((r): r is PageObjectResponse => r.object === "page" && "properties" in r)
      .map(mapPageToProject);

    const categoryMap = new Map<string, number>();
    const statusMap = new Map<string, number>();

    for (const p of projects) {
      categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
      statusMap.set(p.status, (statusMap.get(p.status) ?? 0) + 1);
    }

    const byCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));
    const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    res.json({ total: projects.length, byCategory, byStatus });
  } catch (err) {
    log.error({ err }, "Failed to fetch project stats from Notion");
    res.status(500).json({ error: "Failed to fetch project stats" });
  }
});

// GET /api/projects/:id
router.get("/projects/:id", async (req, res) => {
  const log = req.log;
  try {
    const notion = getNotionClient();
    const { id } = req.params;

    const page = await notion.pages.retrieve({ page_id: id });
    if (page.object !== "page" || !("properties" in page)) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const project = mapPageToProject(page as PageObjectResponse);
    res.json(project);
  } catch (err: unknown) {
    log.error({ err }, "Failed to fetch project from Notion");
    const status = (err as { status?: number }).status === 404 ? 404 : 500;
    res.status(status).json({ error: status === 404 ? "Project not found" : "Failed to fetch project" });
  }
});

export default router;

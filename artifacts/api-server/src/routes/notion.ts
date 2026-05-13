import { Router } from "express";
import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

const router = Router();

function getNotionClient() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) throw new Error("NOTION_API_KEY is not set");
  return new Client({ auth: apiKey });
}

// ---------------------------------------------------------------------------
// Property helpers
// ---------------------------------------------------------------------------

function extractTitle(props: PageObjectResponse["properties"]): string {
  for (const name of ["Nom du projet", "Name", "Titre", "Title"]) {
    const prop = props[name];
    if (prop?.type === "title") {
      return prop.title.map((t) => t.plain_text).join("") || "Sans titre";
    }
  }
  for (const prop of Object.values(props)) {
    if (prop.type === "title") {
      return prop.title.map((t) => t.plain_text).join("") || "Sans titre";
    }
  }
  return "Sans titre";
}

function extractDescription(props: PageObjectResponse["properties"]): string | null {
  for (const name of ["Résumé généré par IA", "Points à traiter", "Description", "Summary"]) {
    const prop = props[name];
    if (prop?.type === "rich_text") {
      const text = prop.rich_text.map((t) => t.plain_text).join("");
      if (text) return text;
    }
  }
  return null;
}

function extractStatus(props: PageObjectResponse["properties"]): string {
  for (const name of ["État", "Status", "Statut", "State"]) {
    const prop = props[name];
    if (prop?.type === "status" && prop.status) return prop.status.name;
    if (prop?.type === "select" && prop.select) return prop.select.name;
  }
  return "Non défini";
}

function extractDate(props: PageObjectResponse["properties"]): string | null {
  for (const name of ["Date de réalisation du projet", "Date", "Due"]) {
    const prop = props[name];
    if (prop?.type === "date" && prop.date) return prop.date.start;
  }
  return null;
}

function extractTags(props: PageObjectResponse["properties"]): string[] {
  for (const name of ["Tags", "Labels", "Étiquettes", "Compétences"]) {
    const prop = props[name];
    if (prop?.type === "multi_select") return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function extractCoverUrl(page: PageObjectResponse): string | null {
  const cover = page.cover;
  if (!cover) return null;
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return null;
}

function deriveCategoryFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("agile") || t.includes("scrum") || t.includes("backlog") || t.includes("sprint"))
    return "Méthodes Agiles";
  if (t.includes("google ads") || t.includes("adwords") || t.includes("sea"))
    return "Google Ads";
  if (t.includes("meta") || t.includes("facebook ads") || t.includes("social ads"))
    return "Meta Ads";
  if (t.includes("marketing") || t.includes("web-marketing") || t.includes("webmarketing") || t.includes("stratégie"))
    return "Marketing Digital";
  if (t.includes("wordpress") || t.includes("cms"))
    return "WordPress";
  if (t.includes("design") || t.includes("ux") || t.includes("ui") || t.includes("maquette"))
    return "Design";
  if (t.includes("rgpd") || t.includes("sécurité") || t.includes("accessibilité") || t.includes("ergonomie"))
    return "Conformité & Sécurité";
  if (t.includes("seo") || t.includes("référencement naturel"))
    return "SEO";
  if (t.includes("data") || t.includes("analytics") || t.includes("kpi"))
    return "Data & Analytics";
  if (t.includes("projet") || t.includes("management") || t.includes("chef de projet"))
    return "Gestion de Projet";
  if (t.includes("web") || t.includes("développement") || t.includes("html"))
    return "Développement Web";
  return "Parcours Digital";
}

function mapPageToProject(page: PageObjectResponse) {
  const props = page.properties;
  const title = extractTitle(props);
  const completionDate = extractDate(props);
  return {
    id: page.id,
    title,
    description: extractDescription(props),
    category: deriveCategoryFromTitle(title),
    status: extractStatus(props),
    tags: extractTags(props),
    coverUrl: extractCoverUrl(page),
    notionUrl: page.url,
    createdAt: page.created_time,
    updatedAt: completionDate ? new Date(completionDate).toISOString() : page.last_edited_time,
  };
}

// ---------------------------------------------------------------------------
// Single-pass cache: discover database_id + fetch all project pages together
// ---------------------------------------------------------------------------

interface CachedResult {
  projects: ReturnType<typeof mapPageToProject>[];
  fetchedAt: number;
}

let cache: CachedResult | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getProjectsFromNotion(): Promise<ReturnType<typeof mapPageToProject>[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.projects;
  }

  const notion = getNotionClient();

  // Single search call — returns up to 100 pages the integration can see
  const res = await notion.search({
    filter: { value: "page", property: "object" },
    sort: { direction: "descending", timestamp: "last_edited_time" },
    page_size: 100,
  });

  const allPages = res.results.filter(
    (r): r is PageObjectResponse => r.object === "page" && "properties" in r
  );

  // Discover the projects database_id from pages whose title starts with "Projet"
  let projectsDbId: string | null = null;
  for (const page of allPages) {
    const title = extractTitle(page.properties);
    if (title.toLowerCase().startsWith("projet")) {
      const parent = page.parent as Record<string, string>;
      if (parent.database_id) {
        projectsDbId = parent.database_id;
        break;
      }
    }
  }

  let projectPages: PageObjectResponse[];
  if (projectsDbId) {
    // Filter to only pages from the discovered projects database
    projectPages = allPages.filter((page) => {
      const parent = page.parent as Record<string, string>;
      return parent.database_id === projectsDbId;
    });
  } else {
    // Fallback: include pages with "Projet" in the title
    projectPages = allPages.filter((page) => {
      const title = extractTitle(page.properties);
      return title.toLowerCase().startsWith("projet");
    });
  }

  const projects = projectPages
    .map(mapPageToProject)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  cache = { projects, fetchedAt: Date.now() };
  return projects;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /api/projects
router.get("/projects", async (req, res) => {
  const log = req.log;
  try {
    const { search, category } = req.query as { search?: string; category?: string };

    let projects = await getProjectsFromNotion();

    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (category) {
      projects = projects.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json(projects);
  } catch (err) {
    log.error({ err }, "Failed to fetch projects from Notion");
    res.status(500).json({ error: "Impossible de récupérer les projets depuis Notion" });
  }
});

// GET /api/projects/stats
router.get("/projects/stats", async (req, res) => {
  const log = req.log;
  try {
    const projects = await getProjectsFromNotion();

    const categoryMap = new Map<string, number>();
    const statusMap = new Map<string, number>();

    for (const p of projects) {
      categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
      statusMap.set(p.status, (statusMap.get(p.status) ?? 0) + 1);
    }

    res.json({
      total: projects.length,
      byCategory: Array.from(categoryMap.entries())
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count),
      byStatus: Array.from(statusMap.entries())
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count),
    });
  } catch (err) {
    log.error({ err }, "Failed to fetch project stats from Notion");
    res.status(500).json({ error: "Impossible de récupérer les statistiques" });
  }
});

// GET /api/projects/:id
router.get("/projects/:id", async (req, res) => {
  const log = req.log;
  try {
    // Check cache first
    const cached = cache?.projects.find((p) => p.id === req.params.id);
    if (cached) {
      res.json(cached);
      return;
    }

    const notion = getNotionClient();
    const page = await notion.pages.retrieve({ page_id: req.params.id });
    if (page.object !== "page" || !("properties" in page)) {
      res.status(404).json({ error: "Projet introuvable" });
      return;
    }

    res.json(mapPageToProject(page as PageObjectResponse));
  } catch (err: unknown) {
    log.error({ err }, "Failed to fetch project from Notion");
    const status = (err as { status?: number }).status === 404 ? 404 : 500;
    res.status(status).json({
      error: status === 404 ? "Projet introuvable" : "Impossible de récupérer le projet",
    });
  }
});

export default router;

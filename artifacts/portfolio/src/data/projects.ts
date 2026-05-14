import type { Project, ProjectStats, ListProjectsParams } from "@workspace/api-client-react";

export const fallbackProjects: Project[] = [
  {
    id: "projet-3-ux-ui-accessibilite",
    title: "Projet 3 - UX/UI & Accessibilité",
    description:
      "Création d'une identité visuelle, structuration des contenus, ergonomie de navigation et prise en compte de l'accessibilité numérique.",
    category: "Design",
    status: "Terminé",
    tags: ["UX/UI", "Accessibilité", "Identité visuelle", "Ergonomie"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
  },
  {
    id: "projet-4-solution-digitale-cms",
    title: "Projet 4 - Solution digitale & CMS",
    description:
      "Analyse de maquettes, intégration CMS, pilotage des contenus et formalisation de maquettes techniques pour une solution digitale exploitable.",
    category: "WordPress",
    status: "Terminé",
    tags: ["CMS", "WordPress", "Maquettes", "Contenus"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-01-17T00:00:00.000Z",
    updatedAt: "2026-01-24T00:00:00.000Z",
  },
  {
    id: "projet-6-strategie-editoriale-digitale",
    title: "Projet 6 - Stratégie éditoriale digitale",
    description:
      "Construction d'un calendrier éditorial, brand content, campagnes social media et optimisation de l'accessibilité des contenus.",
    category: "Marketing Digital",
    status: "Terminé",
    tags: ["Editorial", "Brand content", "Social media", "Accessibilité"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-08T00:00:00.000Z",
  },
  {
    id: "projet-8-marketing-digital-kpi",
    title: "Projet 8 - Marketing digital & KPI",
    description:
      "Optimisation SEO, analyse d’audience, suivi KPI et structuration CRM pour mesurer et améliorer la performance digitale.",
    category: "Data & Analytics",
    status: "Terminé",
    tags: ["SEO", "CRM", "KPI", "Analytics"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-02-22T00:00:00.000Z",
  },
  {
    id: "projet-10-rgpd-securite-digitale",
    title: "Projet 10 - RGPD & sécurité digitale",
    description:
      "Gestion de base de données, sécurité des accès, gouvernance des données et création d'un dashboard analytique.",
    category: "Conformité & Sécurité",
    status: "Terminé",
    tags: ["RGPD", "Sécurité", "Base de données", "Dashboard"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-08T00:00:00.000Z",
  },
  {
    id: "projet-11-accessibilite-recette",
    title: "Projet 11 - Accessibilité & recette fonctionnelle",
    description:
      "Tests de conformité, protocoles QA, déploiement inclusif et validation ergonomique d'un parcours numérique.",
    category: "Conformité & Sécurité",
    status: "Terminé",
    tags: ["Accessibilité", "QA", "Recette", "Ergonomie"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-03-15T00:00:00.000Z",
    updatedAt: "2026-03-22T00:00:00.000Z",
  },
  {
    id: "projet-13-plan-webmarketing",
    title: "Projet 13 - Plan webmarketing",
    description:
      "Définition d'une stratégie marketing digitale, positionnement premium, suivi ROI et préparation de campagnes digitales.",
    category: "Marketing Digital",
    status: "Terminé",
    tags: ["Webmarketing", "ROI", "Positionnement", "Campagnes"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-04-01T00:00:00.000Z",
    updatedAt: "2026-04-08T00:00:00.000Z",
  },
  {
    id: "projet-14-15-gestion-projet-agile",
    title: "Projets 14 & 15 - Gestion de projet Agile",
    description:
      "Pilotage Jira, organisation Scrum/Kanban, gestion des risques, matrice RACI, coordination d'équipe et roadmap produit.",
    category: "Méthodes Agiles",
    status: "Terminé",
    tags: ["Jira", "Scrum", "Kanban", "Roadmap", "RACI"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-04-15T00:00:00.000Z",
    updatedAt: "2026-04-22T00:00:00.000Z",
  },
  {
    id: "projet-16-ia-strategie-eco-innovante",
    title: "Projet 16 - IA & stratégie digitale éco-innovante",
    description:
      "Benchmark, cahier des charges, sélection d'outils IA, veille digitale et cadrage d'une innovation responsable.",
    category: "IA & Innovation",
    status: "Terminé",
    tags: ["IA", "Benchmark", "Cahier des charges", "Veille", "Innovation responsable"],
    coverUrl: null,
    notionUrl: null,
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z",
  },
];

export function filterProjects(projects: Project[], params: ListProjectsParams = {}): Project[] {
  const search = params.search?.trim().toLowerCase();
  const category = params.category?.trim().toLowerCase();

  return projects.filter((project) => {
    const matchesSearch =
      !search ||
      project.title.toLowerCase().includes(search) ||
      project.description?.toLowerCase().includes(search) ||
      project.category.toLowerCase().includes(search) ||
      project.tags?.some((tag) => tag.toLowerCase().includes(search));

    const matchesCategory = !category || project.category.toLowerCase() === category;

    return matchesSearch && matchesCategory;
  });
}

export function getProjectNumber(project: Pick<Project, "id" | "title">): number | null {
  const numbers = [
    ...Array.from(project.title.matchAll(/\d+/g), (match) => Number(match[0])),
    ...Array.from(project.id.matchAll(/^projet-(\d+(?:-\d+)*)/g), (match) =>
      match[1].split("-").map(Number)
    ).flat(),
  ].filter((value) => Number.isFinite(value) && value > 0 && value < 100);

  return numbers.length > 0 ? Math.max(...numbers) : null;
}

export function getProjectDisplayTitle(project: Pick<Project, "title">): string {
  return project.title
    .replace(/^Projets?\s*(?:n[°º]\s*)?\d+(?:\s*(?:&|et|\/|-)\s*\d+)*\s*[-–—:]\s*/i, "")
    .trim();
}

export function sortProjectsByProjectNumber(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const aNumber = getProjectNumber(a);
    const bNumber = getProjectNumber(b);

    if (aNumber !== null || bNumber !== null) {
      return (aNumber ?? Number.MAX_SAFE_INTEGER) - (bNumber ?? Number.MAX_SAFE_INTEGER);
    }

    const aTime = new Date(a.createdAt ?? a.updatedAt).getTime();
    const bTime = new Date(b.createdAt ?? b.updatedAt).getTime();
    return aTime - bTime || a.title.localeCompare(b.title);
  });
}

export function sortProjectsByLatest(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const aNumber = getProjectNumber(a);
    const bNumber = getProjectNumber(b);

    if (aNumber !== null || bNumber !== null) {
      return (bNumber ?? -1) - (aNumber ?? -1);
    }

    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt).getTime();
    return bTime - aTime || a.title.localeCompare(b.title);
  });
}

export function getProjectStats(projects: Project[]): ProjectStats {
  return {
    total: projects.length,
    byCategory: countCategories(projects),
    byStatus: countStatuses(projects),
  };
}

export function getFallbackProject(id: string | undefined): Project | undefined {
  if (!id) return undefined;
  return fallbackProjects.find((project) => project.id === id);
}

function countCategories(projects: Project[]) {
  const counts = new Map<string, number>();

  for (const project of projects) {
    counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

function countStatuses(projects: Project[]) {
  const counts = new Map<string, number>();

  for (const project of projects) {
    counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count || a.status.localeCompare(b.status));
}

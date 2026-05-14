import { useState } from "react";
import { useListProjects, getListProjectsQueryKey, useGetProjectStats, getGetProjectStatsQueryKey } from "@workspace/api-client-react";
import { ProjectCard } from "@/components/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { fallbackProjects, filterProjects, getProjectStats, sortProjectsByLatest } from "@/data/projects";

export default function Projects() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();

  const { data: projects, isLoading } = useListProjects(
    { search: search || undefined, category },
    { query: { queryKey: getListProjectsQueryKey({ search: search || undefined, category }) } }
  );

  const { data: stats } = useGetProjectStats({
    query: { queryKey: getGetProjectStatsQueryKey() }
  });

  const projectList = sortProjectsByLatest(
    Array.isArray(projects) && projects.length > 0
      ? projects
      : filterProjects(fallbackProjects, { search: search || undefined, category })
  );
  const resolvedStats =
    stats && Array.isArray(stats.byCategory) && stats.total > 0
      ? stats
      : getProjectStats(fallbackProjects);
  const categoryStats = resolvedStats.byCategory;
  const categories = categoryStats.map(c => c.category);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-8rem)] pb-24 px-4 md:px-8">
      <div className="container mx-auto max-w-[112rem]">
        {/* Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-5 mb-20 items-start xl:items-center justify-between p-6 bg-secondary/20 border border-border/50 rounded-xl">
          <div className="relative w-full xl:w-[430px] shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder={t("archive.search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 pl-12 text-base font-mono bg-background border-border/50 focus-visible:ring-primary rounded-none"
              data-testid="input-search-projects"
            />
          </div>

          <div className="flex w-full min-w-0 flex-wrap items-center gap-3 xl:flex-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground font-mono mr-2">
              <Filter className="w-5 h-5" /> {t("archive.filters")}
            </div>
            
            <button
              onClick={() => setCategory(undefined)}
              className={`h-11 px-5 text-sm font-mono font-medium transition-colors border ${!category ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
              data-testid="btn-filter-all"
            >
              {t("archive.all")}
            </button>
            
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`h-11 px-5 text-sm font-mono font-medium transition-colors border ${category === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
                data-testid={`btn-filter-${c}`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="min-h-[500px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[660px] rounded-xl bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : projectList.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              layout
            >
              <AnimatePresence>
                {projectList.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-xl bg-secondary/10"
            >
              <X className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2 font-mono" data-testid="text-empty-title">{t("archive.empty_title")}</h3>
              <p className="text-muted-foreground font-mono max-w-sm mb-6" data-testid="text-empty-desc">
                {t("archive.empty_desc")}
              </p>
              {(search || category) && (
                <button 
                  onClick={() => { setSearch(""); setCategory(undefined); }}
                  className="text-primary hover:underline font-mono text-sm flex items-center gap-2"
                  data-testid="btn-clear-filters"
                >
                  <X className="w-3 h-3" /> {t("archive.clear")}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

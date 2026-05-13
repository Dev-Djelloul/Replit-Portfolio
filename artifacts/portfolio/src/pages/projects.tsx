import { useState } from "react";
import { useListProjects, getListProjectsQueryKey, useGetProjectStats, getGetProjectStatsQueryKey } from "@workspace/api-client-react";
import { ProjectCard } from "@/components/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();

  const { data: projects, isLoading } = useListProjects(
    { search: search || undefined, category },
    { query: { queryKey: getListProjectsQueryKey({ search: search || undefined, category }) } }
  );

  const { data: stats } = useGetProjectStats({
    query: { queryKey: getGetProjectStatsQueryKey() }
  });

  const categories = stats?.byCategory.map(c => c.category) || [];

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-8rem)] pt-12 pb-24 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4" data-testid="text-projects-title">ARCHIVE.</h1>
          <p className="text-muted-foreground font-mono">Explore the complete catalog of projects, campaigns, and builds.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 items-start md:items-center justify-between p-4 bg-secondary/30 border border-border/50 rounded-lg">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search projects..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-mono bg-background border-border/50 focus-visible:ring-primary rounded-none"
              data-testid="input-search-projects"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono mr-2">
              <Filter className="w-4 h-4" /> Filters:
            </div>
            
            <button
              onClick={() => setCategory(undefined)}
              className={`px-3 py-1.5 text-xs font-mono font-medium transition-colors border ${!category ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
              data-testid="btn-filter-all"
            >
              ALL
            </button>
            
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs font-mono font-medium transition-colors border ${category === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-xl bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence>
                {projects.map((project, i) => (
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
              <h3 className="text-xl font-bold mb-2 font-mono" data-testid="text-empty-title">NO MATCHES FOUND</h3>
              <p className="text-muted-foreground font-mono max-w-sm mb-6" data-testid="text-empty-desc">
                Adjust your filters or search term to explore the archive.
              </p>
              {(search || category) && (
                <button 
                  onClick={() => { setSearch(""); setCategory(undefined); }}
                  className="text-primary hover:underline font-mono text-sm flex items-center gap-2"
                  data-testid="btn-clear-filters"
                >
                  <X className="w-3 h-3" /> CLEAR ALL FILTERS
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

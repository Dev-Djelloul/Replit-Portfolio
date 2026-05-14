import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Project } from "@workspace/api-client-react";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-colors duration-300"
      data-testid={`card-project-${project.id}`}
    >
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {project.title}</span>
      </Link>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/50">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background p-6">
          <span
            className="text-4xl font-black text-muted-foreground/30 font-mono tracking-tighter uppercase text-center break-words overflow-hidden"
            style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
          >
            {project.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-background/10 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-6 relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold font-sans tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-2" data-testid={`text-project-title-${project.id}`}>
              {project.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20" data-testid={`badge-category-${project.id}`}>
                {project.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-secondary text-secondary-foreground border border-border/50" data-testid={`badge-status-${project.id}`}>
                {project.status}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-secondary/50 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 z-20 shrink-0">
            <ArrowRight className="w-4 h-4 -rotate-45" />
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-6" data-testid={`text-project-desc-${project.id}`}>
            {project.description}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-muted-foreground/80 font-mono" data-testid={`text-project-tag-${project.id}-${tag}`}>
              #{tag.toLowerCase().replace(/\s+/g, '-')}
            </span>
          ))}
          {project.tags && project.tags.length > 3 && (
            <span className="text-xs text-muted-foreground/80 font-mono">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

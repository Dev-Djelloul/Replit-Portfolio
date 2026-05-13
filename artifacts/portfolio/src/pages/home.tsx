import { useListProjects, getListProjectsQueryKey, useGetProjectStats, getGetProjectStatsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, BarChart, Code2 } from "lucide-react";
import { ProjectCard } from "@/components/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useListProjects({}, { 
    query: { queryKey: getListProjectsQueryKey() } 
  });
  
  const { data: stats, isLoading: statsLoading } = useGetProjectStats({ 
    query: { queryKey: getGetProjectStatsQueryKey() } 
  });

  const featuredProjects = projects?.slice(0, 6) || [];

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-4 md:px-8 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono font-medium mb-8" data-testid="badge-hero-status">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AVAILABLE FOR NEW PROJECTS
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8" data-testid="text-hero-headline">
              DIGITAL <br />
              MARKETING <span className="text-primary">&&</span> <br />
              DEVELOPMENT.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed mb-12" data-testid="text-hero-subheadline">
              I build precise, high-performance web experiences and drive growth through calculated digital strategy. Specializing in Web Design, Google Ads, and Meta Campaigns.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="font-mono font-bold tracking-tight rounded-none h-14 px-8 text-primary-foreground" data-testid="link-hero-cta">
                <Link href="/projects">
                  VIEW ARCHIVE <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Abstract decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden lg:block">
          <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="300" y="100" width="200" height="400" stroke="currentColor" strokeWidth="2"/>
            <rect x="250" y="150" width="200" height="400" stroke="currentColor" strokeWidth="2"/>
            <circle cx="450" cy="300" r="100" stroke="hsl(var(--primary))" strokeWidth="2"/>
            <path d="M 200 300 L 600 300" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/40 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2 p-6 border-l-2 border-primary" data-testid="card-stat-total">
              <div className="text-muted-foreground font-mono text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" /> Total Projects
              </div>
              <div className="text-5xl font-black tracking-tighter">
                {statsLoading ? <Skeleton className="h-12 w-24 bg-card" /> : stats?.total || 0}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-6 border-l-2 border-border" data-testid="card-stat-dev">
              <div className="text-muted-foreground font-mono text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" /> Web & WordPress
              </div>
              <div className="text-4xl font-bold tracking-tight">
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 bg-card" />
                ) : (
                  stats?.byCategory.filter(c => c.category.toLowerCase().includes('web') || c.category.toLowerCase().includes('wordpress')).reduce((sum, c) => sum + c.count, 0) || 0
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-6 border-l-2 border-border" data-testid="card-stat-marketing">
              <div className="text-muted-foreground font-mono text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-primary" /> Campaigns
              </div>
              <div className="text-4xl font-bold tracking-tight">
                {statsLoading ? (
                  <Skeleton className="h-10 w-16 bg-card" />
                ) : (
                  stats?.byCategory.filter(c => c.category.toLowerCase().includes('ads') || c.category.toLowerCase().includes('marketing')).reduce((sum, c) => sum + c.count, 0) || 0
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4" data-testid="text-featured-title">FEATURED_WORK</h2>
              <p className="text-muted-foreground font-mono text-sm max-w-md">Selected projects spanning web development, design, and paid media campaigns.</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex font-mono rounded-none" data-testid="link-view-all-projects">
              <Link href="/projects">
                ALL_PROJECTS <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-xl bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground font-mono" data-testid="text-no-projects">No projects found. Check Notion connection.</p>
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Button asChild variant="outline" className="w-full font-mono rounded-none">
              <Link href="/projects">
                ALL_PROJECTS <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link, useLocation } from "wouter";
import { Briefcase, Home } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col relative w-full overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Noise Texture */}
      <div className="pointer-events-none fixed inset-0 z-[-1] h-full w-full opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold tracking-tight text-lg text-primary hover:text-primary/80 transition-colors" data-testid="link-home-logo">
            DK_
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location === '/' ? 'text-foreground' : 'text-muted-foreground'}`}
              data-testid="link-nav-home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline-block">Home</span>
            </Link>
            <Link 
              href="/projects" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location.startsWith('/projects') ? 'text-foreground' : 'text-muted-foreground'}`}
              data-testid="link-nav-projects"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline-block">Work</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col pt-16">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-mono">
            © {new Date().getFullYear()} DK_ PORTFOLIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
            <span className="text-primary">///</span>
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

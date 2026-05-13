import { Link, useLocation } from "wouter";
import { Briefcase, Home, Mail } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t, lang, setLang } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col relative w-full overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background Noise Texture */}
      <div className="pointer-events-none fixed inset-0 z-[-1] h-full w-full opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-mono font-bold tracking-tight text-lg text-primary hover:text-primary/80 transition-colors" data-testid="link-home-logo">
            DJ_
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location === '/' ? 'text-foreground' : 'text-muted-foreground'}`}
              data-testid="link-nav-home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline-block">{t("nav.home")}</span>
            </Link>
            <Link 
              href="/projects" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location.startsWith('/projects') ? 'text-foreground' : 'text-muted-foreground'}`}
              data-testid="link-nav-projects"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline-block">{t("nav.work")}</span>
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${location.startsWith('/contact') ? 'text-foreground' : 'text-muted-foreground'}`}
              data-testid="link-nav-contact"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline-block">{t("nav.contact")}</span>
            </Link>
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="px-2.5 py-1 text-xs font-mono font-medium rounded border border-primary/50 text-primary hover:bg-primary/10 transition-colors"
              data-testid="btn-lang-toggle"
            >
              {t("nav.lang_toggle")}
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col pt-16">
        {children}
      </main>

      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-mono">
            © 2026 DJ_ PORTFOLIO. TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
            <span className="text-primary">///</span>
            <span>{t("footer.status")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

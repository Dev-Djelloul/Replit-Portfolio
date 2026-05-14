import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetProject, getGetProjectQueryKey, useListProjectMedia, getListProjectMediaQueryKey } from "@workspace/api-client-react";
import { ArrowLeft, Calendar, ExternalLink, Tag, Globe, Code, PenTool, LayoutGrid, FileText, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SiNotion, SiGoogle, SiMeta, SiWordpress } from "react-icons/si";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { getFallbackProject } from "@/data/projects";

type LightboxImage = {
  url: string;
  name: string;
};

type ProjectMediaItem = {
  id: number;
  objectPath: string;
  fileName: string;
  fileType: string;
  mediaType: string;
};

function isDocumentMedia(item: ProjectMediaItem) {
  return (
    item.mediaType === "document" ||
    item.fileType.includes("pdf") ||
    item.fileType.includes("document") ||
    item.fileType.includes("presentation") ||
    item.fileType.includes("spreadsheet")
  );
}

function isImageMedia(item: ProjectMediaItem) {
  return item.mediaType === "image" || item.fileType.startsWith("image/");
}

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Fermer"
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Image précédente"
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Image suivante"
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={images[index].url}
        alt={images[index].name}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, imageIndex) => (
            <button
              key={imageIndex}
              type="button"
              aria-label={`Voir l'image ${imageIndex + 1}`}
              onClick={(event) => {
                event.stopPropagation();
                setIndex(imageIndex);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${imageIndex === index ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { t, lang } = useLang();
  const params = useParams();
  const id = params.id as string;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(() => new Set());

  const { data: project, isLoading, isError } = useGetProject(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProjectQueryKey(id),
    }
  });

  const fallbackProject = getFallbackProject(id);
  const displayedProject = project ?? fallbackProject;
  const mediaProjectId = displayedProject?.id ?? id;
  const { data: media = [] } = useListProjectMedia(mediaProjectId, {
    query: {
      enabled: !!mediaProjectId,
      queryKey: getListProjectMediaQueryKey(mediaProjectId),
    },
  });

  const dateLocale = lang === 'fr' ? fr : enUS;
  const imageMedia = media.filter((item) => isImageMedia(item) && !failedImageIds.has(item.id));
  const docMedia = media.filter((item) => isDocumentMedia(item) || failedImageIds.has(item.id));
  const lightboxImages = imageMedia.map((item) => ({
    url: `/api/storage${item.objectPath}`,
    name: item.fileName,
  }));

  if (isLoading && !displayedProject) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-12 bg-card" />
        <Skeleton className="h-[400px] w-full rounded-xl mb-12 bg-card" />
        <Skeleton className="h-16 w-3/4 mb-6 bg-card" />
        <Skeleton className="h-6 w-full mb-2 bg-card" />
        <Skeleton className="h-6 w-2/3 bg-card" />
      </div>
    );
  }

  if ((isError && !displayedProject) || !displayedProject) {
    return (
      <div className="container mx-auto px-4 py-32 max-w-2xl text-center">
        <h1 className="text-4xl font-black mb-4 font-mono text-destructive">{t("detail.error_title")}</h1>
        <p className="text-muted-foreground font-mono mb-8">{t("detail.error_desc")}</p>
        <Button asChild variant="outline" className="font-mono rounded-none">
          <Link href="/projects"><ArrowLeft className="mr-2 w-4 h-4" /> {t("detail.error_back")}</Link>
        </Button>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes("google")) return <SiGoogle className="w-5 h-5 text-primary" />;
    if (c.includes("meta")) return <SiMeta className="w-5 h-5 text-primary" />;
    if (c.includes("wordpress")) return <SiWordpress className="w-5 h-5 text-primary" />;
    if (c.includes("web") || c.includes("dev")) return <Code className="w-5 h-5 text-primary" />;
    if (c.includes("design")) return <PenTool className="w-5 h-5 text-primary" />;
    return <LayoutGrid className="w-5 h-5 text-primary" />;
  };

  return (
    <article className="flex flex-col w-full pb-32">
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Cover Image Header */}
      <div className="w-full h-[40vh] md:h-[60vh] relative bg-secondary overflow-hidden border-b border-border">
        {displayedProject.coverUrl ? (
          <img 
            src={displayedProject.coverUrl} 
            alt={displayedProject.title} 
            className="w-full h-full object-cover opacity-80"
            data-testid={`img-detail-cover-${displayedProject.id}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary via-background to-primary/10 flex items-center justify-center">
            <span className="text-6xl md:text-9xl font-black text-muted-foreground/10 font-mono tracking-tighter uppercase whitespace-nowrap overflow-hidden">
              {displayedProject.category}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link href="/projects" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-mono text-sm mb-6 group" data-testid="link-back-projects">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> {t("detail.back")}
            </Link>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6"
              data-testid={`text-detail-title-${displayedProject.id}`}
            >
              {displayedProject.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 text-sm font-mono"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary/80 border border-border backdrop-blur" data-testid={`badge-detail-category-${displayedProject.id}`}>
                {getCategoryIcon(displayedProject.category)}
                <span>{displayedProject.category}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary/80 border border-border backdrop-blur text-muted-foreground" data-testid={`badge-detail-status-${displayedProject.id}`}>
                <span className="w-2 h-2 rounded-full bg-primary/60" />
                {displayedProject.status}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-16 max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
        {/* Main Content */}
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-xl font-bold font-mono tracking-tight mb-6 uppercase border-b border-border pb-2 text-primary">{t("detail.overview")}</h2>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg max-w-none" data-testid={`text-detail-desc-${displayedProject.id}`}>
              {displayedProject.description ? (
                <p>{displayedProject.description}</p>
              ) : (
                <p className="text-muted-foreground italic">{t("detail.no_desc")}</p>
              )}
            </div>
          </section>

          {imageMedia.length > 0 && (
            <section>
              <h2 className="text-xl font-bold font-mono tracking-tight mb-6 uppercase border-b border-border pb-2 text-primary">
                {t("detail.screenshots")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {imageMedia.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="group relative rounded-lg overflow-hidden border border-border/50 aspect-video bg-secondary hover:border-primary/50 transition-colors"
                  >
                    <img
                      src={`/api/storage${item.objectPath}`}
                      alt={item.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => {
                        setFailedImageIds((current) => new Set(current).add(item.id));
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {docMedia.length > 0 && (
            <section>
              <h2 className="text-xl font-bold font-mono tracking-tight mb-6 uppercase border-b border-border pb-2 text-primary">
                {t("detail.documents")}
              </h2>
              <div className="flex flex-col gap-3">
                {docMedia.map((item) => (
                  <a
                    key={item.id}
                    href={`/api/storage${item.objectPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 hover:bg-secondary/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate">{item.fileName}</p>
                      <p className="font-mono text-xs text-muted-foreground uppercase">{item.fileType.split("/")[1] || "document"}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {displayedProject.tags && displayedProject.tags.length > 0 && (
            <section>
              <h2 className="text-xl font-bold font-mono tracking-tight mb-6 uppercase border-b border-border pb-2 text-primary">{t("detail.technologies")}</h2>
              <div className="flex flex-wrap gap-3">
                {displayedProject.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground font-mono text-sm rounded border border-border/50" data-testid={`badge-detail-tag-${tag}`}>
                    <Tag className="w-3 h-3 text-muted-foreground" />
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <aside className="flex flex-col gap-8">
          <div className="p-6 rounded-xl bg-card border border-border/50 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {t("detail.logged")}
              </h3>
              <p className="font-mono text-sm" data-testid="text-detail-date">
                {format(new Date(displayedProject.createdAt), "MMM dd, yyyy", { locale: dateLocale })}
              </p>
            </div>
            
            {displayedProject.updatedAt && (
              <div>
                <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {t("detail.updated")}
                </h3>
                <p className="font-mono text-sm text-muted-foreground">
                  {format(new Date(displayedProject.updatedAt), "MMM dd, yyyy", { locale: dateLocale })}
                </p>
              </div>
            )}

            <div className="h-px bg-border/50 w-full my-2" />

            {displayedProject.notionUrl && (
              <Button asChild className="w-full font-mono gap-2 rounded-none bg-secondary hover:bg-secondary/80 text-secondary-foreground" data-testid={`link-notion-${displayedProject.id}`}>
                <a href={displayedProject.notionUrl} target="_blank" rel="noopener noreferrer">
                  <SiNotion className="w-4 h-4" /> {t("detail.view_notion")}
                </a>
              </Button>
            )}
            
            {/* Generic external link placeholder if needed, based on category */}
            {displayedProject.category.toLowerCase().includes('web') && (
              <Button asChild variant="outline" className="w-full font-mono gap-2 rounded-none border-primary/30 hover:bg-primary/10 text-primary">
                <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => e.preventDefault()}>
                  <Globe className="w-4 h-4" /> {t("detail.view_live")}
                </a>
              </Button>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

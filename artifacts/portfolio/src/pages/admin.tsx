import { useState } from "react";
import { useListProjects, getListProjectsQueryKey, useListProjectMedia, getListProjectMediaQueryKey, useAddProjectMedia, useDeleteProjectMedia } from "@workspace/api-client-react";
import { useUpload } from "@workspace/object-storage-web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, FileText, ImageIcon, Loader2, Lock, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_PASSWORD = "djelloul2024";

function MediaItem({
  projectId,
  item,
  onDeleted,
}: {
  projectId: string;
  item: { id: number; objectPath: string; fileName: string; fileType: string; mediaType: string };
  onDeleted: () => void;
}) {
  const deleteMutation = useDeleteProjectMedia();
  const isImage = item.mediaType === "image";
  const isDoc = item.mediaType === "document";
  const servingUrl = `/api/storage${item.objectPath}`;

  return (
    <div className="flex items-center gap-3 p-3 bg-secondary/30 border border-border/40 rounded group">
      {isImage ? (
        <a href={servingUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <img src={servingUrl} alt={item.fileName} className="w-16 h-12 object-cover rounded border border-border/40 hover:opacity-80 transition-opacity" />
        </a>
      ) : (
        <div className="w-16 h-12 flex items-center justify-center bg-card rounded border border-border/40 shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs truncate text-foreground">{item.fileName}</p>
        <p className="font-mono text-xs text-muted-foreground uppercase">{item.fileType.split("/")[1] || item.fileType}</p>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={servingUrl} target="_blank" rel="noopener noreferrer">
          <Button size="icon" variant="ghost" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
        </a>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive"
          disabled={deleteMutation.isPending}
          onClick={() => {
            deleteMutation.mutate(
              { projectId, mediaId: item.id },
              { onSuccess: onDeleted }
            );
          }}
        >
          {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}

function ProjectRow({ project }: { project: { id: string; title: string; category: string } }) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  const { data: media = [], refetch } = useListProjectMedia(project.id, { query: { enabled: expanded, queryKey: getListProjectMediaQueryKey(project.id) } });
  const addMedia = useAddProjectMedia();

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: async (res) => {
      const ext = res.objectPath.split(".").pop()?.toLowerCase() || "";
      const isDoc = ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(ext);
      const mediaType = isDoc ? "document" : "image";
      addMedia.mutate(
        {
          projectId: project.id,
          data: {
            objectPath: res.objectPath,
            fileName: res.objectPath.split("/").pop() || res.objectPath,
            fileType: isDoc ? "application/pdf" : "image/png",
            mediaType,
            displayOrder: (media?.length ?? 0),
          },
        },
        {
          onSuccess: () => {
            toast({ title: "Fichier ajouté !", description: "Le média a été associé au projet." });
            refetch();
          },
          onError: () => toast({ title: "Erreur", description: "Impossible d'enregistrer le média.", variant: "destructive" }),
        }
      );
    },
    onError: () => toast({ title: "Erreur upload", description: "L'upload a échoué.", variant: "destructive" }),
  });

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <div>
            <p className="font-mono font-bold text-sm">{project.title}</p>
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{project.category}</p>
          </div>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {expanded && media.length > 0 ? `${media.length} fichier(s)` : ""}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-border/30 bg-background flex flex-col gap-4">
              {media.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {media.map((item) => (
                    <MediaItem
                      key={item.id}
                      projectId={project.id}
                      item={item}
                      onDeleted={() => refetch()}
                    />
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-muted-foreground italic">Aucun fichier pour ce projet.</p>
              )}

              <div className="flex items-center gap-3">
                <label className="relative cursor-pointer flex-1">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                    disabled={isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadFile(file);
                      e.target.value = "";
                    }}
                  />
                  <div className="flex items-center justify-center gap-2 h-10 px-4 border border-dashed border-primary/40 rounded-md hover:border-primary/80 hover:bg-primary/5 transition-colors font-mono text-xs text-muted-foreground">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Upload {progress !== null ? `${progress}%` : "..."}
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-primary" />
                        Ajouter image ou document (PDF, PPT…)
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { data: projects = [], isLoading } = useListProjects({}, { query: { enabled: authenticated, queryKey: getListProjectsQueryKey({}) } });

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Mot de passe incorrect.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="p-8 rounded-xl border border-border/50 bg-card flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-black font-mono tracking-tighter">ADMIN_</h1>
              <p className="text-muted-foreground font-mono text-xs">Gestion des médias du portfolio</p>
            </div>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="font-mono bg-secondary/30 rounded-none border-border/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-destructive font-mono text-xs text-center">{error}</p>}
            <Button onClick={handleLogin} className="w-full font-mono rounded-none font-bold tracking-tight">
              ACCÉDER
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="border-b border-border/50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-primary font-black font-mono text-xl tracking-tighter">DJ_</span>
          <span className="text-muted-foreground font-mono text-sm">/ ADMIN / MÉDIAS</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="font-mono text-xs"
          onClick={() => setAuthenticated(false)}
        >
          Déconnexion
        </Button>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-12 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black font-mono tracking-tighter">GESTION_MÉDIAS</h1>
          <p className="text-muted-foreground font-mono text-sm">
            Cliquez sur un projet pour gérer ses captures d'écran et documents.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement des projets…
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

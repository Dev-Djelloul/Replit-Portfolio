import { Link } from "wouter";
import { motion } from "framer-motion";
import { Download, ArrowRight, Globe, PenTool, Search, Target, Code2, Layers } from "lucide-react";
import { SiGoogle, SiMeta, SiWordpress, SiCanva, SiGoogleanalytics, SiFigma, SiNotion } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const skills = [
  {
    icon: <SiGoogle className="w-5 h-5" />,
    label: "Google Ads",
    level: 90,
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <SiMeta className="w-5 h-5" />,
    label: "Meta Ads",
    level: 85,
    color: "from-blue-600 to-indigo-500",
  },
  {
    icon: <SiWordpress className="w-5 h-5" />,
    label: "WordPress",
    level: 88,
    color: "from-sky-500 to-blue-400",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    label: "Web Design",
    level: 82,
    color: "from-primary to-teal-400",
  },
  {
    icon: <Search className="w-5 h-5" />,
    label: "SEO",
    level: 78,
    color: "from-emerald-500 to-green-400",
  },
  {
    icon: <Target className="w-5 h-5" />,
    label: "Gestion de projet",
    level: 92,
    color: "from-violet-500 to-purple-400",
  },
  {
    icon: <PenTool className="w-5 h-5" />,
    label: "Design graphique",
    level: 75,
    color: "from-pink-500 to-rose-400",
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    label: "HTML / CSS / JS",
    level: 70,
    color: "from-orange-500 to-amber-400",
  },
];

const tools = [
  { icon: <SiGoogle className="w-6 h-6" />, name: "Google Ads" },
  { icon: <SiGoogleanalytics className="w-6 h-6" />, name: "Analytics" },
  { icon: <SiMeta className="w-6 h-6" />, name: "Meta Ads" },
  { icon: <SiWordpress className="w-6 h-6" />, name: "WordPress" },
  { icon: <SiFigma className="w-6 h-6" />, name: "Figma" },
  { icon: <Layers className="w-6 h-6" />, name: "Adobe CC" },
  { icon: <SiCanva className="w-6 h-6" />, name: "Canva" },
  { icon: <SiNotion className="w-6 h-6" />, name: "Notion" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function About() {
  const { t } = useLang();

  return (
    <div className="flex flex-col w-full pb-32">
      {/* Hero */}
      <div className="relative w-full border-b border-border/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container mx-auto max-w-5xl px-4 md:px-8 pt-20 pb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
          >
            {/* Avatar placeholder */}
            <div className="shrink-0">
              <div className="relative w-36 h-36 md:w-48 md:h-48">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/30 to-secondary border border-primary/20 flex items-center justify-center overflow-hidden">
                  <span className="text-5xl md:text-7xl font-black font-mono text-primary/40 select-none">DJ</span>
                </div>
                {/* Status badge */}
                <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-primary/30 text-primary text-xs font-mono font-medium shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  Disponible
                </div>
              </div>
            </div>

            {/* Title + bio */}
            <div className="flex flex-col gap-6 flex-1">
              <div>
                <p className="font-mono text-primary text-sm tracking-widest uppercase mb-3">// Djelloul</p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
                  {t("about.title")}
                </h1>
                <p className="mt-3 font-mono text-lg text-muted-foreground">
                  {t("about.subtitle")}
                </p>
              </div>

              <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed max-w-xl">
                <p>{t("about.bio1")}</p>
                <p>{t("about.bio2")}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="/api/storage/public-objects/cv.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <Button className="font-mono font-bold rounded-none gap-2 h-12 px-6">
                    <Download className="w-4 h-4" />
                    {t("about.cv_download")}
                  </Button>
                </a>
                <Link href="/contact">
                  <Button variant="outline" className="font-mono rounded-none gap-2 h-12 px-6 border-primary/30 hover:bg-primary/10 text-primary">
                    {t("about.contact_cta")}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 md:px-8 mt-16 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16">
        {/* Left: Skills + Tools */}
        <div className="flex flex-col gap-16">
          {/* Skills */}
          <section>
            <h2 className="text-xl font-bold font-mono tracking-tight mb-8 uppercase border-b border-border pb-3 text-primary">
              {t("about.skills_title")}
            </h2>
            <div className="grid grid-cols-1 gap-5">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.label}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-sm font-mono">
                      <span className="text-primary">{skill.icon}</span>
                      <span className="font-medium">{skill.label}</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section>
            <h2 className="text-xl font-bold font-mono tracking-tight mb-8 uppercase border-b border-border pb-3 text-primary">
              {t("about.tools_title")}
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/40 hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-muted-foreground group-hover:text-primary transition-colors">
                    {tool.icon}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground text-center leading-tight">{tool.name}</span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Parcours */}
        <aside className="flex flex-col gap-8">
          <section>
            <h2 className="text-xl font-bold font-mono tracking-tight mb-8 uppercase border-b border-border pb-3 text-primary">
              {t("about.exp_title")}
            </h2>

            <div className="relative flex flex-col gap-0">
              {/* Timeline line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/60" />

              {/* Exp 1 */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative flex gap-5 pb-10"
              >
                <div className="shrink-0 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background mt-1.5 z-10" />
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-xs text-primary tracking-widest uppercase">{t("about.exp1_period")}</p>
                  <p className="font-bold text-base leading-tight">{t("about.exp1_role")}</p>
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">{t("about.exp1_org")}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{t("about.exp1_desc")}</p>
                </div>
              </motion.div>

              {/* Exp 2 */}
              <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative flex gap-5 pb-10"
              >
                <div className="shrink-0 w-3.5 h-3.5 rounded-full bg-primary/40 border-2 border-background mt-1.5 z-10" />
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-xs text-primary tracking-widest uppercase">{t("about.exp2_period")}</p>
                  <p className="font-bold text-base leading-tight">{t("about.exp2_role")}</p>
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">{t("about.exp2_org")}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{t("about.exp2_desc")}</p>
                </div>
              </motion.div>

              {/* End dot */}
              <div className="relative flex gap-5">
                <div className="shrink-0 w-3.5 h-3.5 rounded-full bg-border mt-1.5 z-10" />
                <p className="font-mono text-xs text-muted-foreground/50 mt-1">En cours…</p>
              </div>
            </div>
          </section>

          {/* Quick contact card */}
          <div className="p-6 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono text-xs text-primary uppercase tracking-widest">Disponible pour de nouvelles missions</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vous avez un projet web, une campagne à lancer ou besoin d'un chef de projet digital ?
            </p>
            <Link href="/contact">
              <Button size="sm" className="w-full font-mono font-bold rounded-none gap-2">
                Écrire un message <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

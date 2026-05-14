import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Lang = "fr" | "en";

const translations = {
  fr: {
    "nav.home": "Accueil",
    "nav.work": "Projets",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.lang_toggle": "EN",
    "hero.badge": "DISPONIBLE POUR DE NOUVEAUX PROJETS",
    "hero.headline_line1": "MARKETING",
    "hero.headline_line2": "DIGITAL",
    "hero.headline_line3": "DÉVELOPPEMENT.",
    "hero.subheadline": "Je conçois des expériences web performantes et pilote la croissance via une stratégie digitale précise. Spécialisé en Design Web, Google Ads et Campagnes Meta.",
    "hero.cta": "VOIR LES PROJETS",
    "stats.total": "Projets totaux",
    "stats.web": "Web & WordPress",
    "stats.campaigns": "Campagnes",
    "featured.title": "PROJETS_SÉLECTIONNÉS",
    "featured.subtitle": "Projets sélectionnés couvrant le développement web, le design et les campagnes publicitaires.",
    "featured.all": "TOUS_PROJETS",
    "archive.title": "ARCHIVE.",
    "archive.subtitle": "Explorez le catalogue complet de projets, campagnes et réalisations.",
    "archive.search_placeholder": "Rechercher des projets...",
    "archive.filters": "Filtres :",
    "archive.all": "TOUS",
    "archive.empty_title": "AUCUN RÉSULTAT",
    "archive.empty_desc": "Ajustez vos filtres ou votre recherche pour explorer l'archive.",
    "archive.clear": "EFFACER LES FILTRES",
    "detail.back": "RETOUR À L'ARCHIVE",
    "detail.overview": "Aperçu",
    "detail.technologies": "Technologies & Tags",
    "detail.logged": "Créé le",
    "detail.updated": "Mis à jour",
    "detail.view_notion": "Voir dans Notion",
    "detail.view_live": "Voir le site",
    "detail.no_desc": "Aucune description détaillée disponible pour ce projet.",
    "detail.error_title": "404_ERREUR",
    "detail.error_desc": "Les données du projet n'ont pas pu être récupérées.",
    "detail.screenshots": "Captures d'écran",
    "detail.documents": "Documents & Livrables",
    "detail.error_back": "RETOUR À L'ARCHIVE",
    "contact.title": "CONTACT.",
    "contact.subtitle": "Discutons de votre prochain projet.",
    "contact.name_label": "Votre nom",
    "contact.name_placeholder": "Jean Dupont",
    "contact.email_label": "Email",
    "contact.email_placeholder": "jean@exemple.com",
    "contact.subject_label": "Objet (optionnel)",
    "contact.subject_placeholder": "Projet web, campagne Google Ads...",
    "contact.message_label": "Message",
    "contact.message_placeholder": "Décrivez votre projet ou votre question...",
    "contact.send": "ENVOYER LE MESSAGE",
    "contact.sending": "ENVOI EN COURS...",
    "contact.success": "Message envoyé ! Je vous répondrai bientôt.",
    "contact.error": "Impossible d'envoyer le message. Réessayez.",
    "contact.info_email": "digitalblueskye@gmail.com",
    "contact.info_location": "France",
    "about.title": "À PROPOS.",
    "about.subtitle": "Chef de Projet Digital & Développeur Web",
    "about.bio1": "Je m'appelle Djelloul, passionné par le digital depuis plusieurs années. Mon parcours m'a conduit à maîtriser l'ensemble de la chaîne de création web — de la conception stratégique jusqu'au déploiement de campagnes performantes.",
    "about.bio2": "Formé à la gestion de projet digitale via le parcours OpenClassrooms, j'allie rigueur technique et vision marketing pour livrer des projets complets, mesurables et orientés résultats.",
    "about.skills_title": "COMPÉTENCES_CLÉS",
    "about.exp_title": "PARCOURS",
    "about.exp1_role": "Chef de Projet Digital",
    "about.exp1_org": "Parcours OpenClassrooms",
    "about.exp1_period": "2024 — 2025",
    "about.exp1_desc": "Formation intensive en gestion de projet digital : pilotage de projets web de bout en bout, coordination d'équipes, livrables professionnels (cahier des charges, planning, recettes).",
    "about.exp2_role": "Freelance — Marketing Digital & Web",
    "about.exp2_org": "Projets clients",
    "about.exp2_period": "2023 — Présent",
    "about.exp2_desc": "Création et gestion de sites WordPress, campagnes Google Ads & Meta Ads, stratégie SEO, design graphique et identités visuelles pour des clients variés.",
    "about.cv_download": "TÉLÉCHARGER LE CV",
    "about.cv_no_file": "CV non disponible",
    "about.contact_cta": "DISCUTONS DE VOTRE PROJET",
    "about.tools_title": "OUTILS & TECHNOLOGIES",
    "footer.status": "SYSTÈME EN LIGNE",
    "notfound.title": "404_ERREUR",
    "notfound.desc": "La page que vous cherchez n'existe pas.",
    "notfound.back": "RETOUR À L'ACCUEIL",
  },
  en: {
    "nav.home": "Home",
    "nav.work": "Work",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.lang_toggle": "FR",
    "hero.badge": "AVAILABLE FOR NEW PROJECTS",
    "hero.headline_line1": "DIGITAL",
    "hero.headline_line2": "MARKETING",
    "hero.headline_line3": "DEVELOPMENT.",
    "hero.subheadline": "I build precise, high-performance web experiences and drive growth through calculated digital strategy. Specializing in Web Design, Google Ads, and Meta Campaigns.",
    "hero.cta": "VIEW PROJECTS",
    "stats.total": "Total Projects",
    "stats.web": "Web & WordPress",
    "stats.campaigns": "Campaigns",
    "featured.title": "FEATURED_WORK",
    "featured.subtitle": "Selected projects spanning web development, design, and paid media campaigns.",
    "featured.all": "ALL_PROJECTS",
    "archive.title": "ARCHIVE.",
    "archive.subtitle": "Explore the complete catalog of projects, campaigns, and builds.",
    "archive.search_placeholder": "Search projects...",
    "archive.filters": "Filters:",
    "archive.all": "ALL",
    "archive.empty_title": "NO MATCHES FOUND",
    "archive.empty_desc": "Adjust your filters or search term to explore the archive.",
    "archive.clear": "CLEAR ALL FILTERS",
    "detail.back": "BACK TO ARCHIVE",
    "detail.overview": "Overview",
    "detail.technologies": "Technologies & Tags",
    "detail.logged": "Logged",
    "detail.updated": "Last Updated",
    "detail.view_notion": "View in Notion",
    "detail.view_live": "View Live Site",
    "detail.no_desc": "No detailed description provided for this project.",
    "detail.error_title": "404_ERROR",
    "detail.error_desc": "Project data could not be retrieved.",
    "detail.screenshots": "Screenshots",
    "detail.documents": "Documents & Deliverables",
    "detail.error_back": "RETURN TO ARCHIVE",
    "contact.title": "CONTACT.",
    "contact.subtitle": "Let's talk about your next project.",
    "contact.name_label": "Your name",
    "contact.name_placeholder": "John Doe",
    "contact.email_label": "Email",
    "contact.email_placeholder": "john@example.com",
    "contact.subject_label": "Subject (optional)",
    "contact.subject_placeholder": "Web project, Google Ads campaign...",
    "contact.message_label": "Message",
    "contact.message_placeholder": "Describe your project or question...",
    "contact.send": "SEND MESSAGE",
    "contact.sending": "SENDING...",
    "contact.success": "Message sent! I'll get back to you soon.",
    "contact.error": "Failed to send message. Please try again.",
    "contact.info_email": "digitalblueskye@gmail.com",
    "contact.info_location": "France",
    "about.title": "ABOUT.",
    "about.subtitle": "Digital Project Manager & Web Developer",
    "about.bio1": "My name is Djelloul, passionate about digital for several years. My background has led me to master the full web creation chain — from strategic conception to deploying high-performance campaigns.",
    "about.bio2": "Trained in digital project management through the OpenClassrooms program, I combine technical rigor with marketing vision to deliver complete, measurable, results-driven projects.",
    "about.skills_title": "KEY_SKILLS",
    "about.exp_title": "EXPERIENCE",
    "about.exp1_role": "Digital Project Manager",
    "about.exp1_org": "OpenClassrooms Program",
    "about.exp1_period": "2024 — 2025",
    "about.exp1_desc": "Intensive digital project management training: end-to-end web project management, team coordination, professional deliverables (specifications, planning, acceptance tests).",
    "about.exp2_role": "Freelance — Digital Marketing & Web",
    "about.exp2_org": "Client Projects",
    "about.exp2_period": "2023 — Present",
    "about.exp2_desc": "WordPress website creation and management, Google Ads & Meta Ads campaigns, SEO strategy, graphic design and visual identities for various clients.",
    "about.cv_download": "DOWNLOAD CV",
    "about.cv_no_file": "CV not available",
    "about.contact_cta": "LET'S DISCUSS YOUR PROJECT",
    "about.tools_title": "TOOLS & TECHNOLOGIES",
    "footer.status": "SYSTEM ONLINE",
    "notfound.title": "404_ERROR",
    "notfound.desc": "The page you're looking for doesn't exist.",
    "notfound.back": "BACK TO HOME",
  }
};

export type TranslationKey = keyof typeof translations.fr;

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_lang") as Lang;
    if (saved && (saved === "fr" || saved === "en")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("portfolio_lang", newLang);
  };

  const t = (key: TranslationKey) => {
    return translations[lang][key] || translations.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return context;
}

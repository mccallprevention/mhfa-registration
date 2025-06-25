// lib/i18n/translations.ts

const translations = {
  en: {
    common: {
      register: "Register",
      showAll: "Show All",
      noEvents: "No trainings are currently scheduled.",
      checkBackLater: "Please check back later or try a different filter.",
      copyright: "© 2025 McCall Behavioral Health Network. All rights reserved."
    },
    hero: {
      title: "Mental Health Training Programs",
      description: "Join us for professional development opportunities in Mental Health First Aid (MHFA) and Question, Persuade, Refer (QPR) suicide prevention training."
    },
    accessibility: {
      logoAlt: "McCall Behavioral Health Network",
      homePage: "McCall Behavioral Health Network home page",
      switchLanguage: "Switch to Spanish"
    }
  },
  es: {
    common: {
      register: "Registrarse",
      showAll: "Mostrar Todo",
      noEvents: "No hay entrenamientos programados actualmente.",
      checkBackLater: "Por favor, vuelva más tarde o pruebe con un filtro diferente.",
      copyright: "© 2025 McCall Behavioral Health Network. Todos los derechos reservados."
    },
    hero: {
      title: "Programas de Capacitación en Salud Mental",
      description: "Únase a nosotros para oportunidades de desarrollo profesional en Primeros Auxilios de Salud Mental (MHFA) y capacitación en prevención del suicidio Preguntar, Persuadir, Referir (QPR)."
    },
    accessibility: {
      logoAlt: "McCall Behavioral Health Network",
      homePage: "Página principal de McCall Behavioral Health Network",
      switchLanguage: "Cambiar a inglés"
    }
  }
} as const;

export { translations };

export type TranslationKey = keyof typeof translations.en;
import noviaSeedPosts from "../../../blog_posts_novia.json";

export type BlogFaq = {
  question: string;
  answer: string;
};

export type BlogSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type RawBlogSeed = {
  id: number;
  categoria: string;
  titulo: string;
  seo_label?: string;
  intro: string;
  cuerpo: string;
  keywords: string[];
  coverImage?: string;
  faq?: BlogFaq[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  seoLabel?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  featured?: boolean;
  keywords: string[];
  coverImage?: string;
  sections: BlogSection[];
  faq?: BlogFaq[];
};

const manualPosts: BlogPost[] = [
  {
    slug: "maquillaje-para-novias-en-lima-tendencias-2026",
    title: "Maquillaje para novias en Lima: tendencias 2026 que sí favorecen en foto y en persona",
    description:
      "Descubre las tendencias de maquillaje para novias en Lima en 2026: acabados elegantes, piel luminosa y looks duraderos para bodas de día y de noche.",
    excerpt:
      "Guía práctica para novias que quieren verse elegantes, frescas y fotogénicas el día de su boda en Lima.",
    category: "Novias",
    seoLabel: "SEO local",
    publishedAt: "2026-04-08",
    readingTime: "6 min",
    featured: true,
    keywords: [
      "maquillaje para novias en lima",
      "maquilladora profesional lima",
      "maquillaje de novia 2026",
    ],
    sections: [
      {
        title: "La tendencia principal: piel real y luminosa",
        paragraphs: [
          "Las novias en Lima están buscando acabados que se vean finos tanto en vivo como en fotografía. La clave ya no es cargar la base, sino trabajar una piel bien preparada y luminosa.",
          "Un maquillaje duradero, con sellado estratégico y productos adecuados al clima, logra un resultado elegante sin verse pesado.",
        ],
      },
      {
        title: "Cómo elegir el look ideal según tu boda",
        paragraphs: [
          "No es lo mismo una boda de día, una ceremonia civil, una boda religiosa o una recepción de noche. Cada contexto pide intensidades distintas en ojos, piel y labios.",
        ],
        bullets: [
          "Bodas de día: tonos suaves, piel fresca y rubor natural.",
          "Bodas de tarde: equilibrio entre luminosidad y definición.",
          "Bodas de noche: ojos más profundos y mayor estructura en el look.",
        ],
      },
      {
        title: "Por qué conviene hacer una prueba previa",
        paragraphs: [
          "La prueba ayuda a definir el estilo, validar la duración y ajustar el acabado según el rostro, el vestido y el peinado.",
          "Además reduce nervios y hace que el día del evento todo fluya con mayor seguridad.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Cuánto tiempo antes se debe reservar el maquillaje de novia?",
        answer:
          "Lo ideal es reservar con varias semanas o meses de anticipación, especialmente en temporada alta y fines de semana.",
      },
      {
        question: "¿El maquillaje de novia incluye prueba?",
        answer:
          "Depende del paquete, pero incluir una prueba suele ser una excelente decisión para asegurar el resultado final.",
      },
    ],
  },
  {
    slug: "maquillaje-social-a-domicilio-en-lima-que-debes-saber",
    title: "Maquillaje social a domicilio en Lima: qué debes saber antes de reservar",
    description:
      "Todo lo que una clienta debe considerar antes de contratar maquillaje social a domicilio en Lima: tiempos, preparación de piel, costos y beneficios.",
    excerpt:
      "Una guía útil para quienes quieren maquillarse para una fiesta, graduación o evento sin salir de casa.",
    category: "Eventos",
    seoLabel: "Alta intención",
    publishedAt: "2026-04-08",
    readingTime: "5 min",
    featured: true,
    keywords: [
      "maquillaje a domicilio lima",
      "maquillaje social lima",
      "makeup artist a domicilio",
    ],
    sections: [
      {
        title: "La comodidad también es parte de la experiencia",
        paragraphs: [
          "Reservar maquillaje a domicilio ahorra tiempo, reduce estrés y te permite prepararte con tranquilidad antes del evento.",
          "Es una opción ideal para cumpleaños, graduaciones, sesiones de fotos, matrimonios y eventos corporativos.",
        ],
      },
      {
        title: "Qué tener listo antes de la cita",
        paragraphs: [
          "Para que la experiencia sea más cómoda, conviene tener un espacio iluminado, una silla cómoda y el rostro limpio al momento de la atención.",
        ],
        bullets: [
          "Buena luz natural o luz blanca cercana.",
          "Mesa o superficie despejada.",
          "Referencia visual del estilo que te gusta.",
        ],
      },
      {
        title: "Cómo elegir una maquilladora confiable en Lima",
        paragraphs: [
          "Más allá del precio, revisa portafolio, consistencia del trabajo, reseñas y claridad del proceso de reserva. Eso te dará más seguridad en el resultado.",
        ],
      },
    ],
    faq: [
      {
        question: "¿El costo de traslado se cobra por separado?",
        answer:
          "Sí, normalmente depende del distrito y del horario de la cita. Lo ideal es verlo claramente antes de confirmar la reserva.",
      },
    ],
  },
  {
    slug: "maquillaje-para-piel-madura-consejos-profesionales",
    title: "Maquillaje para piel madura: consejos profesionales para un acabado elegante y favorecedor",
    description:
      "Aprende qué técnicas favorecen más a la piel madura y cómo lograr un maquillaje sofisticado, cómodo y natural para eventos especiales.",
    excerpt:
      "Una guía pensada para resaltar la belleza natural con técnicas que suman luminosidad y frescura.",
    category: "Piel madura",
    seoLabel: "Evergreen",
    publishedAt: "2026-04-08",
    readingTime: "4 min",
    featured: true,
    keywords: [
      "maquillaje para piel madura",
      "maquilladora piel madura lima",
      "maquillaje elegante para eventos",
    ],
    sections: [
      {
        title: "Menos peso, más técnica",
        paragraphs: [
          "En piel madura, el mejor resultado suele venir de texturas ligeras, buena hidratación y puntos estratégicos de corrección.",
          "El objetivo no es cubrir en exceso, sino unificar el tono y devolver vitalidad al rostro.",
        ],
      },
      {
        title: "Elementos que favorecen muchísimo",
        paragraphs: [
          "Un buen diseño de cejas, rubor en crema y labios armoniosos cambian por completo el resultado final sin endurecer las facciones.",
        ],
        bullets: [
          "Piel hidratada y luminosa.",
          "Sombras en tonos suaves y satinados.",
          "Definición elegante sin exceso de producto.",
        ],
      },
    ],
    faq: [
      {
        question: "¿Se puede lograr un look glamuroso en piel madura?",
        answer:
          "Sí. La clave está en adaptar el estilo al rostro y priorizar técnicas que iluminen y estilicen sin recargar.",
      },
    ],
  },
];

function truncateText(text: string, maxLength = 160) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.ceil(words / 180))} min`;
}

function buildSections(post: RawBlogSeed): BlogSection[] {
  const paragraphs = post.cuerpo
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const normalizedIntro = post.intro.replace(/\s+/g, " ").trim();
  const bodyParagraphs = paragraphs.filter((paragraph, index) => {
    if (index !== 0) return true;
    return paragraph.replace(/\s+/g, " ").trim() !== normalizedIntro;
  });

  return [
    {
      title: post.seo_label ? `${post.categoria}: ${post.seo_label}` : `Guía de ${post.categoria}`,
      paragraphs: [post.intro],
    },
    {
      title: `Lo que debes saber sobre ${post.categoria.toLowerCase()}`,
      paragraphs: bodyParagraphs.length > 0 ? bodyParagraphs : [post.intro],
    },
  ];
}

function buildFaq(post: RawBlogSeed): BlogFaq[] {
  if (post.faq && post.faq.length > 0) return post.faq;

  return [
    {
      question: "¿Este tipo de look se puede adaptar a cada rostro y tipo de piel?",
      answer:
        "Sí. Cada propuesta debe ajustarse al tipo de piel, facciones, estilo del evento y preferencias personales para que el resultado se vea auténtico y favorecedor.",
    },
    {
      question: "¿Conviene reservar con anticipación este servicio?",
      answer:
        "Sí, especialmente en fines de semana, temporada alta y fechas de bodas. Reservar con tiempo te da más opciones de horario y una mejor planificación.",
    },
  ];
}

const importedNoviaPosts: BlogPost[] = (noviaSeedPosts as RawBlogSeed[]).map((post, index) => {
  const publishedDate = new Date(2026, 3, 8 + index);

  return {
    slug: slugify(post.titulo),
    title: post.titulo,
    description: truncateText(post.intro, 158),
    excerpt: truncateText(post.intro, 210),
    category: post.categoria,
    seoLabel: post.seo_label,
    publishedAt: publishedDate.toISOString().slice(0, 10),
    readingTime: estimateReadingTime(`${post.intro} ${post.cuerpo}`),
    featured: index < 6,
    keywords: post.keywords,
    coverImage: post.coverImage,
    sections: buildSections(post),
    faq: buildFaq(post),
  };
});

export const BLOG_POSTS_PER_PAGE = 6;

// Para añadir más blogs rápido, solo agrega nuevos objetos en `blog_posts_novia.json`.
export const blogPosts: BlogPost[] = [...manualPosts, ...importedNoviaPosts];

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPaginatedBlogPosts(page: number, pageSize = BLOG_POSTS_PER_PAGE) {
  const posts = getAllBlogPosts();
  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
  const currentPage = Math.min(Math.max(1, Math.floor(page || 1)), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    posts: posts.slice(startIndex, startIndex + pageSize),
    currentPage,
    totalPages,
    totalPosts,
    pageSize,
  };
}

export function getFeaturedBlogPosts() {
  return getAllBlogPosts().filter((post) => post.featured);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

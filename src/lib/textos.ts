import type { Idioma } from "./idiomas";

// Textos de la interfaz. Las fichas de los vídeos no se traducen: se marcan con lang="es" cuando la interfaz va en otro idioma.

const es = {
  lema: "Cultura techno en vídeos cortos",
  descripcion: "Vídeos cortos sobre cultura techno: discotecas míticas, festivales, la Ruta del Bakalao y el sonido en la pista. Cada dato, con su fuente.",
  palabrasClave: ["techno", "cultura techno", "discotecas", "Ruta del Bakalao", "festivales", "música electrónica", "historia del techno", "clubs de España"],

  saltar: "Saltar al contenido",
  escribenos: "Escríbenos",
  idioma: "Idioma",
  inicio: "Sideral Techno, inicio",
  enRed: (red: string) => `Sideral Techno en ${red}`,
  seguir: "Seguir en Instagram",

  portada: {
    etiqueta: (usuario: string) => `${usuario} en Instagram y TikTok`,
    titular: "Cultura techno",
    titular2: "en vídeos cortos.",
    intro: "Discotecas míticas, festivales, la Ruta del Bakalao y el sonido de la pista. Cada dato, con su fuente.",
    verVideos: (n: number) => `Ver los ${n} vídeos`,
    nuevo: "Nuevo",
    lista: "Vídeos de Sideral Techno",
  },

  buscador: {
    todos: "Todos los vídeos",
    buscar: "Buscar vídeos",
    pista: "Busca un club, un festival o un tema",
    uno: "vídeo",
    varios: "vídeos",
    nada: "Nada con esas palabras",
    falta: "¿Echas en falta un tema?",
    escribenos: "Escríbenos",
    asunto: "Propuesta de tema",
    borrador: "borrador",
  },

  video: {
    migas: "Migas",
    videos: "Vídeos",
    borrador: "Borrador",
    enEspanol: "",
    noReproduce: "Tu navegador no reproduce este vídeo.",
    descargalo: "Descárgalo",
    verTitulo: (titulo: string) => `Ver «${titulo}» en Instagram`,
    verInstagram: "Ver en Instagram",
    tambienEn: "También en",
    cifras: "Las cifras",
    fuente: "Fuente",
    fuentes: "Fuentes",
    corregimos: "Lo que corregimos",
    deciamos: "Decíamos: ",
    correcto: "Lo correcto: ",
    verCorreccion: "Ver el vídeo de corrección",
    masHistorias: "Más historias así, en Instagram",
    datoMal: "¿Algún dato está mal?",
    asuntoCorreccion: "Corrección",
    masVideos: "Más vídeos",
    verTodos: "Ver todos",
  },

  noEncontrado: {
    titulo: "Aquí no hay señal",
    texto: "La página no existe o el vídeo todavía no se ha publicado.",
    volver: "Ver los vídeos",
  },

  pie: {
    lema: "Un vídeo, una historia, cada dato con su fuente",
    sigue: "Síguenos en Instagram para ver cada vídeo nuevo. También estamos en",
    pregunta: "¿Un dato mal, una fuente mejor o un tema?",
    legal: "© 2026 Sideral Techno. Voz generada con IA. Mapas: colaboradores de OpenStreetMap.",
    salud: "Los datos de salud son divulgación de la OMS, no consejo médico.",
  },

  imagen: {
    alt: "Sideral Techno, cultura techno en vídeos cortos",
    lema: "Cultura techno. Cada dato, con su fuente.",
    miralo: "Míralo en Instagram: @sideral_techno",
  },
};

export type Textos = typeof es;

const en: Textos = {
  lema: "Techno culture in short videos",
  descripcion: "Short videos on techno culture: legendary clubs, festivals, Valencia's Ruta del Bakalao and the sound on the dance floor. Every fact, with its source.",
  palabrasClave: ["techno", "techno culture", "nightclubs", "Ruta del Bakalao", "festivals", "electronic music", "techno history", "clubs in Spain"],

  saltar: "Skip to content",
  escribenos: "Write to us",
  idioma: "Language",
  inicio: "Sideral Techno, home",
  enRed: (red: string) => `Sideral Techno on ${red}`,
  seguir: "Follow on Instagram",

  portada: {
    etiqueta: (usuario: string) => `${usuario} on Instagram and TikTok`,
    titular: "Techno culture",
    titular2: "in short videos.",
    intro: "Legendary clubs, festivals, Valencia's Ruta del Bakalao and the sound of the dance floor. Every fact, with its source.",
    verVideos: (n: number) => `See all ${n} videos`,
    nuevo: "New",
    lista: "Sideral Techno videos",
  },

  buscador: {
    todos: "All videos",
    buscar: "Search videos",
    pista: "Search for a club, a festival or a topic",
    uno: "video",
    varios: "videos",
    nada: "Nothing matches those words",
    falta: "Missing a topic?",
    escribenos: "Write to us",
    asunto: "Topic suggestion",
    borrador: "draft",
  },

  video: {
    migas: "Breadcrumb",
    videos: "Videos",
    borrador: "Draft",
    enEspanol: "The video and these notes are in Spanish.",
    noReproduce: "Your browser cannot play this video.",
    descargalo: "Download it",
    verTitulo: (titulo: string) => `Watch “${titulo}” on Instagram`,
    verInstagram: "Watch on Instagram",
    tambienEn: "Also on",
    cifras: "The figures",
    fuente: "Source",
    fuentes: "Sources",
    corregimos: "What we corrected",
    deciamos: "We said: ",
    correcto: "Correct: ",
    verCorreccion: "Watch the correction video",
    masHistorias: "More stories like this, on Instagram",
    datoMal: "Is a fact wrong?",
    asuntoCorreccion: "Correction",
    masVideos: "More videos",
    verTodos: "See all",
  },

  noEncontrado: {
    titulo: "No signal here",
    texto: "This page does not exist or the video has not been published yet.",
    volver: "See the videos",
  },

  pie: {
    lema: "One video, one story, every fact with its source",
    sigue: "Follow us on Instagram to see every new video. We are also on",
    pregunta: "A wrong fact, a better source or a topic?",
    legal: "© 2026 Sideral Techno. AI-generated voice. Maps: OpenStreetMap contributors.",
    salud: "Health figures are WHO public information, not medical advice.",
  },

  imagen: {
    alt: "Sideral Techno, techno culture in short videos",
    lema: "Techno culture. Every fact, with its source.",
    miralo: "Watch it on Instagram: @sideral_techno",
  },
};

export const TEXTOS: Record<Idioma, Textos> = { es, en };

/**
 * CONTENIDO EDITABLE — Fundación Calidad
 * -------------------------------------------------
 * Todo el texto, las cifras y los datos de contacto del sitio viven aquí.
 * Reemplace los valores marcados como PROVISIONAL por la información real
 * de la Fundación. No se ha inventado ningún dato oficial.
 */

import projectConservation from "@/assets/project-conservation.jpg";
import projectEducation from "@/assets/project-education.jpg";
import projectRestoration from "@/assets/project-restoration.jpg";
import projectCommunity from "@/assets/project-community.jpg";
import newsCleanup from "@/assets/news-cleanup.jpg";
import newsSeedling from "@/assets/news-seedling.jpg";
import newsRecycling from "@/assets/news-recycling.jpg";

export const org = {
  name: "Fundación Calidad",
  tagline: "Preservando nuestro entorno ecológico y construyendo un futuro sostenible.",
  intro:
    "La Fundación Calidad trabaja en iniciativas orientadas a la protección del medio ambiente, la conservación de los recursos naturales y el bienestar de las comunidades.",
};

export const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Noticias", href: "#noticias" },
  { label: "Contacto", href: "#contacto" },
];

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  detailPath: string;
  detail: {
    heroTitle: string;
    summary: string;
    fullDescription: string;
    objectives: string[];
    activities: string[];
    impact: string;
  };
}

export const projects: Project[] = [
  {
    id: "permacultura",
    slug: "permacultura",
    title: "Permacultura",
    description:
      "Diseño de sistemas productivos sostenibles que integran seres humanos, tierra y recursos de forma armónica con el entorno natural.",
    image: projectRestoration,
    detailPath: "/proyectos/permacultura",
    detail: {
      heroTitle: "Permacultura",
      summary:
        "Implementación de huertos, jardines y sistemas agroecológicos basados en los principios de permacultura para comunidades rurales y urbanas.",
      fullDescription:
        "El proyecto de Permacultura de la Fundación Calidad busca transformar la relación de las comunidades con la tierra mediante el diseño consciente de espacios productivos sostenibles. A través de la implementación de huertos agroecológicos, jardines de vivienda y sistemas integrados de producción de alimentos, promovemos la soberanía alimentaria y el cuidado del suelo. Nuestro enfoque se basa en los tres éticos de la permacultura: cuidado de la tierra, cuidado de las personas y reparto justo de los excedentes. Trabajamos con comunidades rurales y urbanas para adaptar estos principios a las condiciones locales del territorio colombiano.",
      objectives: [
        "Diseñar e implementar huertos agroecológicos en escuelas y comunidades.",
        "Capacitar familias en técnicas de permacultura adaptadas al clima local.",
        "Promover la producción de alimentos sin agroquímicos.",
        "Reducir la huella de carbono mediante agricultura regenerativa.",
        "Crear redes de intercambio de semillas y conocimientos ancestrales.",
      ],
      activities: [
        "Talleres prácticos de diseño de huertos en espiral, bancales y policultivos.",
        "Jornadas de siembra comunitaria con especies nativas y criollas.",
        "Instalación de sistemas de captación y almacenamiento de agua lluvia.",
        "Formación de multiplicadores comunitarios en permacultura.",
        "Elaboración de compost y abonos orgánicos a partir de residuos locales.",
      ],
      impact:
        "Se han establecido más de 15 huertos agroecológicos en comunidades del territorio, beneficiando a más de 200 familias con acceso a alimentos frescos y orgánicos.",
    },
  },
  {
    id: "compostaje",
    slug: "compostaje",
    title: "Compostaje",
    description:
      "Transformación de residuos orgánicos en abono natural para mejorar la salud del suelo y reducir la cantidad de desechos en vertederos.",
    image: projectConservation,
    detailPath: "/proyectos/compostaje",
    detail: {
      heroTitle: "Compostaje",
      summary:
        "Programa de manejo integral de residuos orgánicos mediante técnicas de compostaje casera, comunitaria e industrial a pequeña escala.",
      fullDescription:
        "El programa de Compostaje de la Fundación Calidad tiene como objetivo reducir la cantidad de residuos orgánicos que llegan a los vertederos, transformándolos en un recurso valioso para la agricultura y el jardín. Mediante talleres, jornadas prácticas y acompañamiento técnico, enseñamos a comunidades, hogares y establecimientos a separar y procesar sus residuos orgánicos de manera eficiente. El compost resultante se utila para enriquecer suelos degradados, mejorar la retención de agua y disminuir la dependencia de fertilizantes químicos. Este proyecto también contribuye a la reducción de gases de efecto invernadero generados por la descomposición anaeróbica de residuos orgánicos en rellenos sanitarios.",
      objectives: [
        "Reducir al menos un 40% los residuos orgánicos enviados a vertederos.",
        "Enseñar técnicas de compostaje casero y comunitario a familias.",
        "Producir compost de calidad para huertos y zonas verdes municipales.",
        "Sensibilizar sobre la importancia de la separación en la fuente.",
        "Generar alternativas económicas de manejo de residuos.",
      ],
      activities: [
        "Talleres de compostaje en escuelas y centros comunitarios.",
        "Instalación de composteros domésticos y comunitarios.",
        "Jornadas de sensibilización sobre separación de residuos.",
        "Producción y distribución de compost a huertos comunitarios.",
        "Seguimiento técnico y acompañamiento a familias participantes.",
      ],
      impact:
        "Se han instalado más de 50 composteros en hogares y centros comunitarios, logrando la transformación de toneladas de residuos orgánicos en abono de alta calidad.",
    },
  },
  {
    id: "apicultura",
    slug: "apicultura",
    title: "Apicultura",
    description:
      "Promoción de la apicultura sostenible como herramienta de conservación de polinizadores y generación de ingresos para comunidades rurales.",
    image: projectEducation,
    detailPath: "/proyectos/apicultura",
    detail: {
      heroTitle: "Apicultura",
      summary:
        "Formación en manejo sostenible de colmenas, producción de miel y derivados, y conservación de polinizadores nativos del territorio.",
      fullDescription:
        "El proyecto de Apicultura de la Fundación Calidad impulsa una apicultura responsable que beneficia tanto a las comunidades como al ecosistema. Las abejas son polinizadores fundamentales para la biodiversidad y la producción de alimentos, sin embargo, enfrentan amenazas como el uso indiscriminado de pesticidas y la pérdida de hábitat. A través de este proyecto, capacitamos a familias rurales en el manejo sostenible de colmenas, la producción de miel, cera, propóleos y otros derivados apícolas, generando una fuente de ingresos complementaria. Al mismo tiempo, promovemos la creación de corredores biológicos de flora nativa que sirvan como alimento para las abejas y fortalezcan la biodiversidad local.",
      objectives: [
        "Capacitar a comunidades rurales en apicultura sostenible.",
        "Conservar y proteger poblaciones de abejas nativas y mellíferas.",
        "Generar ingresos económicos mediante la producción de miel y derivados.",
        "Crear corredores biológicos de flora apícola en zonas estratégicas.",
        "Reducir el uso de pesticidas en áreas de influencia del proyecto.",
      ],
      activities: [
        "Cursos prácticos de instalación y manejo de colmenas.",
        "Jornadas de instalación de apiarios en fincas comunitarias.",
        "Talleres de extracción, procesamiento y envasado de miel.",
        "Siembra de especies vegetales nativas para alimentación de abejas.",
        "Monitoreo de poblaciones de abejas y evaluación de salud apícola.",
      ],
      impact:
        "Se han establecido 12 apiarios comunitarios con más de 60 colmenas activas, produciendo miel certificada y generando ingresos sostenibles para 30 familias rurales.",
    },
  },
  {
    id: "reciclaje",
    slug: "reciclaje",
    title: "Reciclaje",
    description:
      "Estrategias de economía circular que convierten residuos en nuevos productos, reduciendo el impacto ambiental y fomentando la cultura del reciclaje.",
    image: projectCommunity,
    detailPath: "/proyectos/reciclaje",
    detail: {
      heroTitle: "Reciclaje",
      summary:
        "Programa integral de reciclaje comunitario que promueve la separación en la fuente, la reutilización creativa y la economía circular.",
      fullDescription:
        "El proyecto de Reciclaje de la Fundación Calidad busca transformar la cultura de consumo y disposición de residuos en las comunidades. A través de programas educativos, jornadas de recolección selectiva y talleres de reutilización creativa, promovemos la economía circular como alternativa al modelo lineal de producir-usar-desechar. Trabajamos con escuelas, barrios y establecimientos comerciales para implementar sistemas de separación en la fuente que permitan la recuperación de materiales como papel, cartón, plásticos, vidrio y metales. Estos materiales se canalizan hacia recicladores formales e informales, fortaleciendo la cadena de reciclaje y generando oportunidades de empleo verde.",
      objectives: [
        "Implementar sistemas de separación en la fuente en barrios y escuelas.",
        "Capacitar a la comunidad en los principios de la economía circular.",
        "Recuperar y canalizar materiales reciclables hacia cadena formal.",
        "Promover la reutilización creativa de residuos sólidos.",
        "Reducir la cantidad de residuos que llegan a rellenos sanitarios.",
      ],
      activities: [
        "Talleres de separación de residuos en hogares y escuelas.",
        "Jornadas de recolección comunitaria de materiales reciclables.",
        "Talleres artesanales de reutilización y upcycling.",
        "Instalación de puntos limpios en barrios y centros educativos.",
        "Campañas de comunicación para sensibilizar sobre reciclaje.",
      ],
      impact:
        "Se han instalado 20 puntos limpios en barrios y escuelas, recuperando más de 5 toneladas de material reciclable y capacitando a 1.500 personas en separación de residuos.",
    },
  },
];

export const stats = [
  { label: "Proyectos realizados", value: "00" },
  { label: "Personas beneficiadas", value: "000" },
  { label: "Jornadas ambientales", value: "00" },
  { label: "Espacios recuperados", value: "00" },
];

export const news = [
  {
    id: "jornada-limpieza",
    date: "Fecha por definir",
    title: "Jornada de limpieza de fuentes hídricas",
    excerpt:
      "Contenido de demostración: reseña de una jornada de limpieza realizada junto a voluntarios de la comunidad.",
    image: newsCleanup,
  },
  {
    id: "siembra",
    date: "Fecha por definir",
    title: "Siembra de especies nativas",
    excerpt:
      "Contenido de demostración: actividad de reforestación con especies propias del territorio.",
    image: newsSeedling,
  },
  {
    id: "reciclaje",
    date: "Fecha por definir",
    title: "Taller de reciclaje y aprovechamiento de residuos",
    excerpt:
      "Contenido de demostración: formación práctica sobre separación en la fuente y economía circular.",
    image: newsRecycling,
  },
];

/** PROVISIONAL: reemplazar por los datos oficiales de la Fundación. */
export const contact = {
  email: "correo@ejemplo.org",
  phone: "+57 000 000 0000",
  address: "Dirección pendiente por definir, Colombia",
  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

/**
 * DONACIONES — Fundación Calidad
 * -------------------------------------------------
 * Reemplace cada `link` (o nº de cuenta) por la información real de la
 * Fundación. El botón "Donar" lleva a la página /donacion.
 */
export const donation = {
  pagePath: "/donacion",
  banner:
    "Tu apoyo es fundamental para seguir impulsando proyectos ambientales y sociales en el territorio. Con tu donación hacemos posible el trabajo con las comunidades.",
  methods: [
    {
      id: "bancolombia",
      name: "Bancolombia",
      subtitle: "Cuenta de ahorros / corriente",
      kind: "account",
      reference: "PENDIENTE: Nº de cuenta",
      placeholder: "Ej: 000-000000-00",
      link: "https://www.bancolombia.com/personas",
    },
    {
      id: "nequi",
      name: "Nequi",
      subtitle: "Transferencia a celular",
      kind: "account",
      reference: "3204457103",
      placeholder: "",
      link: "https://www.nequi.com.co",
    },
    {
      id: "daviplata",
      name: "DaviPlata",
      subtitle: "Transferencia a celular",
      kind: "account",
      reference: "PENDIENTE: Nº de celular",
      placeholder: "Ej: 300 000 0000",
      link: "https://www.daviplata.com",
    },
    {
      id: "paypal",
      name: "PayPal",
      subtitle: "Donación internacional segura",
      kind: "link",
      reference: "PENDIENTE: correo de PayPal",
      placeholder: "Ej: donaciones@fundacioncalidad.org",
      link: "https://www.paypal.com/donate",
    },
  ],
};

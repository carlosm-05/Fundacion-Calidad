/**
 * CONTENIDO EDITABLE — Fundación Calidad
 * -------------------------------------------------
 * Todo el texto, las cifras y los datos de contacto del sitio viven aquí.
 * Reemplace los valores marcados como PROVISIONAL por la información real
 * de la Fundación. No se ha inventado ningún dato oficial.
 */

import projectRestoration from "@/assets/project-restoration.jpg";
import projectPermacultura1 from "@/assets/project-permacultura-1.jpg";
import projectPermacultura2 from "@/assets/project-permacultura-2.jpg";
import projectPermacultura3 from "@/assets/project-permacultura-3.jpg";
import projectPermacultura4 from "@/assets/project-permacultura-4.jpg";
import projectCompota from "@/assets/project-composta.png";
import projectFauna from "@/assets/project-fauna-portada.jpeg";
import projectFaunaTiti from "@/assets/project-fauna-titi.jpg";
import projectCompostajeNuevo1 from "@/assets/project-compostaje-nuevo-1.jpeg";
import projectCompostajeNuevo2 from "@/assets/project-compostaje-nuevo-2.jpeg";
import projectCompostajeNuevo3 from "@/assets/project-compostaje-nuevo-3.jpeg";
import projectCompostajeNuevo4 from "@/assets/project-compostaje-nuevo-4.jpeg";
import projectMtb from "@/assets/project-mtb.jpg";
import projectMtb1 from "@/assets/project-mtb-pista-1.jpeg";
import projectMtb2 from "@/assets/project-mtb-pista-2.jpeg";
import projectMtb3 from "@/assets/project-mtb-pista-3.jpeg";
import projectMtb4 from "@/assets/project-mtb-pista-4.jpeg";
import projectMtb6 from "@/assets/project-mtb-pista-6.jpeg";
import projectMtb7 from "@/assets/project-mtb-pista-7.jpeg";
import projectMtb8 from "@/assets/project-mtb-pista-8.jpeg";
import projectMtb9 from "@/assets/project-mtb-pista-9.jpeg";
import projectMtb10 from "@/assets/project-mtb-pista-10.jpeg";
import projectSenderismoPortada from "@/assets/project-senderismo-portada.jpeg";
import projectSenderismoNuevo2 from "@/assets/project-senderismo-nuevo-2.jpeg";
import projectSenderismoNuevo3 from "@/assets/project-senderismo-nuevo-3.jpeg";
import projectSenderismoNuevo4 from "@/assets/project-senderismo-nuevo-4.jpeg";
import projectSenderismoNuevo5 from "@/assets/project-senderismo-nuevo-5.jpeg";
import projectSenderismoNuevo6 from "@/assets/project-senderismo-nuevo-6.jpeg";
import videoProyectoFauna from "@/assets/video-avistamiento-fauna.mp4";

export const org = {
  name: "Fundación Calidad",
  tagline: "Preservando nuestro entorno ecológico y construyendo un futuro sostenible.",
  intro:
    "La Fundación Calidad trabaja en iniciativas orientadas a la protección del medio ambiente, la conservación de los recursos naturales y el bienestar de las comunidades.",
};

export const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Proyectos", href: "/#proyectos" },
  { label: "Metalmecánicos", href: "/metalmecanicos" },
  { label: "Contacto", href: "/#contacto" },
];

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAspect?: string;
  imagePosition?: string;
  detailPath: string;
  gallery?: {
    src: string;
    alt: string;
    objectAspect?: string;
    objectPosition?: string;
  }[];
  video?: { youtubeId?: string; src?: string; title: string };
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
    id: "pista-eliana-caicedo",
    slug: "pista-eliana-caicedo",
    title: "Pista para MTB",
    description:
      "El MTB es una disciplina emocionante que se practica off-road por trochas y senderos montañosos. Nuestra Pista 'Eliana Caicedo' combina downhill, peraltes, switchbacks y obstáculos naturales.",
    image: projectMtb,
    imageAspect: "aspect-video",
    detailPath: "/proyectos/pista-eliana-caicedo",
    gallery: [
      {
        src: projectMtb1,
        alt: "Descenso de los peraltes en carrera",
      },
      {
        src: projectMtb2,
        alt: "Competencia de MTB en terreno irregular",
      },
      {
        src: projectMtb3,
        alt: "Subidas serpenteantes que desafían la potencia",
      },
      {
        src: projectMtb4,
        alt: "Puentes, puntos de control de la carrera",
      },
      {
        src: projectMtb6,
        alt: "Guías y turistas recorriendo la pista de MTB en la Fundación",
      },
      {
        src: projectMtb7,
        alt: "Guías y turistas en el circuito de MTB de la Fundación",
      },
      {
        src: projectMtb8,
        alt: "Guías y turistas disfrutando del entorno natural de la pista de MTB",
      },
      {
        src: projectMtb9,
        alt: "Guías y turistas explorando la pista de MTB",
      },
      {
        src: projectMtb10,
        alt: "Guías y turistas en la pista de MTB de la Fundación",
      },
      {
        src: projectMtb,
        alt: "Portada de la Pista para MTB Eliana Caicedo",
      },
    ],
    video: {
      youtubeId: "02eTYR0R96c",
      title: "Recorrido de la Pista para MTB",
    },
    detail: {
      heroTitle: "Pista para MTB",
      summary:
        "Un circuito profesional de ciclomontañismo dedicado a Eliana Caicedo, campeona mundial de Mountain Bike: downhill, peraltes, switchbacks y obstáculos naturales sobre el relieve del piedemonte llanero.",
      fullDescription:
        'El MTB (Mountain Bike o Ciclomontañismo) es una emocionante disciplina del ciclismo que se practica off-road, desafiando terrenos naturales complejos, trochas y senderos montañosos donde la resistencia física, la técnica y la conexión con el entorno son fundamentales. Una pista de MTB es un circuito diseñado específicamente para este deporte, dotado de elementos naturales y artificiales que ponen a prueba las habilidades de manejo, reflejos y destreza de cada ciclista.\n\nUn homenaje a nuestra tierra: Pista de MTB "Eliana Caicedo"\n\nNuestra pista lleva con orgullo el nombre de Eliana Caicedo, destacada ciclista colombiana oriunda de Villavicencio (Meta), quien ha dejado en alto el tricolor nacional al coronarse campeona mundial de ciclomontañismo (Master A de Mountain Bike), además de sumar múltiples títulos nacionales y panamericanos. Su disciplina, resiliencia y amor por el deporte llanero son la máxima inspiración de este escenario, diseñado para impulsar el talento local y ofrecer un espacio a la altura de los grandes deportistas.\n\nRetos y obstáculos del circuito\n\nEl trazado está pensado para ofrecer una experiencia dinámica y exigente, integrando los obstáculos más emocionantes y comunes de las pistas profesionales de MTB:\n\nZonas de Downhill y descensos técnicos: Sectores de bajada rápida y pronunciada que exigen máxima concentración, control de frenado y lectura del terreno.\n\nPeraltes: Curvas peraltadas diseñadas con inclinación estratégica que permiten mantener la velocidad, fluidez y estabilidad al girar con seguridad.\n\nSubidas en zig-zag (switchbacks): Ascensos serpenteantes que desafían la potencia cardiovascular y la técnica de pedaleo en pendiente, obligando al ciclista a trazar curvas cerradas hacia arriba sin perder el equilibrio.\n\nObstáculos naturales y pasos técnicos: Senderos complementados con raíces, rocas y desniveles que enriquecen la aventura y ponen a prueba las capacidades de integración entre la bicicleta y el terreno.\n\nYa sea para entrenar al máximo nivel o para disfrutar de la velocidad y la naturaleza, la Pista de MTB Eliana Caicedo representa el punto de encuentro perfecto entre la pasión por el pedal y la exigencia del deporte de montaña.',
      objectives: [
        "Impulsar el talento llanero con un escenario deportivo a la altura de los grandes del MTB.",
        "Mantener un circuito profesional con descensos técnicos, peraltes, switchbacks y obstáculos naturales.",
        "Honrar la trayectoria de Eliana Caicedo, campeona mundial y múltiple campeona nacional y panamericana.",
        "Promover la práctica recreativa, el entrenamiento y las competencias de ciclomontañismo.",
        "Fomentar la técnica, la resistencia y la conexión con el entorno natural.",
      ],
      activities: [
        "Zonas de downhill y descensos técnicos: sectores de bajada rápida y pronunciada que exigen control de frenado y lectura del terreno.",
        "Peraltes: curvas peraltadas con inclinación estratégica para mantener velocidad, fluidez y estabilidad al girar.",
        "Subidas en zig-zag (switchbacks): ascensos serpenteantes que desafían la potencia cardiovascular y la técnica de pedaleo.",
        "Obstáculos naturales y pasos técnicos: raíces, rocas y desniveles para integrar la bicicleta y el terreno.",
        "Rodadas, entrenamientos y competencias para la comunidad y los deportistas de la región.",
      ],
      impact:
        "La Pista de MTB Eliana Caicedo representa el punto de encuentro perfecto entre la pasión por el pedal y la exigencia del deporte de montaña, un homenaje permanente a la campeona mundial de ciclomontañismo y un escenario que impulsa el talento deportivo local.",
    },
  },
  {
    id: "senderismo",
    slug: "senderismo",
    title: "Senderismo",
    description:
      "Recorridos a pie por los senderos ecológicos del piedemonte llanero que combinan deporte, naturaleza y educación ambiental, aptos para todas las edades.",
    image: projectSenderismoPortada,
    imageAspect: "aspect-video",
    /**
     * La portada es 3:2 (900x600) y la tarjeta la recorta a 16:9, así que
     * `object-cover` descarta ~94px de alto. `object-top` deja el recorte
     * entero abajo y muestra el borde superior completo, que es donde va el
     * logo de la Fundación. El eje horizontal no se recorta (3:2 es más
     * angosto que 16:9), por eso no lleva valor en X.
     */
    imagePosition: "object-top",
    detailPath: "/proyectos/senderismo",
    gallery: [
      {
        src: projectSenderismoNuevo2,
        alt: "Guía con turistas observando la flora del sendero",
      },
      {
        src: projectSenderismoNuevo3,
        alt: "Guía con turistas en la naturaleza de la Fundación",
      },
      {
        src: projectSenderismoNuevo4,
        alt: "Guía con turistas recorriendo el piedemonte llanero",
      },
      {
        src: projectSenderismoNuevo5,
        alt: "Turistas disfrutando de la caminata ecológica",
      },
      {
        src: projectSenderismoNuevo6,
        alt: "Guía con turistas conectando con el entorno natural",
      },
    ],
    detail: {
      heroTitle: "Senderismo",
      summary:
        "Caminatas ecológicas por los senderos de Villavicencio y el piedemonte llanero, con guías locales, señalización segura y mínimo impacto en la naturaleza.",
      fullDescription:
        "El proyecto de Senderismo de la Fundación Calidad promueve la caminata como una actividad saludable, de bajo costo y en contacto con la naturaleza. Villavicencio cuenta con una amplia oferta de senderos que la Fundación aprovecha y apoya para sus recorridos: la vereda El Carmen, con cerca de 6 kilómetros de subida sobre la ciudad; el Alto de Buenavista, de aproximadamente 11 kilómetros por la antigua vía a Bogotá; el Parque El Bambú, de 16 hectáreas con un 80 % de bosque natural y senderos ecológicos aptos para todas las edades; la Cascada Palmichal, una caminata exigente de unas 3 horas con caudal de agua como recompensa; y el Cerro de los Siete Colores, dentro de la ciudad.\n\nEstas salidas se enmarcan en el fortalecimiento de las caminatas ecológicas y turísticas de Villavicencio, institucionalizadas en el Acuerdo Municipal 571 de 2023, y se articulan con iniciativas comunitarias como la ruta ecoturística 'La Sociedad de los Sueños' en el barrio Villa Lorena Bajo, que recorre unos 3 kilómetros junto a las cascadas de Caño Grande y Caño Equis con guías locales. Para la temporada seca (enero a marzo y julio a agosto) se programan también salidas hacia la Sierra de la Macarena y Caño Cristales, bajo los protocolos del parque nacional. Cada caminata incluye recomendaciones de hidratación, calzado, bloqueador y prácticas 'no dejar huella' para conservar los senderos.",
      objectives: [
        "Abrir y mantener senderos ecológicos seguros y señalizados.",
        "Promover hábitos de vida saludable a través de la caminata.",
        "Vincular a guías locales y familias en el turismo comunitario.",
        "Educar sobre la flora y la fauna del territorio durante los recorridos.",
        "Apoyar las rutas institucionalizadas por el Acuerdo Municipal 571 de 2023.",
      ],
      activities: [
        "Caminatas guiadas por la vereda El Carmen y el Alto de Buenavista.",
        "Recorridos por el Parque El Bambú y la Cascada Palmichal.",
        "Rutas familiares y escolares de bajo nivel de dificultad.",
        "Jornadas de señalización y limpieza de senderos sin dejar huella.",
        "Caminatas culturales con historias y saberes de guías comunitarios.",
      ],
      impact:
        "Se han acondicionado y señalizado los primeros senderos interpretativos, y las caminatas mensuales reúnen a más de 40 personas, articuladas con las rutas institucionalizadas por el municipio de Villavicencio y con el turismo comunitario.",
    },
  },
  {
    id: "avistamiento-de-fauna",
    slug: "avistamiento-de-fauna",
    title: "Avistamiento de fauna",
    description:
      "Caminatas de avistamiento y exploración por la reserva natural de la Fundación para observar la biodiversidad del piedemonte llanero en su estado más puro.",
    image: projectFauna,
    imageAspect: "aspect-video",
    imagePosition: "object-top",
    detailPath: "/proyectos/avistamiento-de-fauna",
    gallery: [
      {
        src: projectFaunaTiti,
        alt: "Mono tití, una de las especies más fáciles de observar en el piedemonte llanero",
      },
      {
        src: projectFauna,
        objectAspect: "aspect-video",
        alt: "Portada de la reserva natural de la Fundación para el avistamiento de fauna",
      },
      {
        src: projectSenderismoNuevo2,
        alt: "Guía con turistas explorando la reserva natural de la Fundación",
      },
      {
        src: projectSenderismoNuevo3,
        alt: "Guía con turistas conectando con la flora y fauna de la Fundación",
      },
    ],
    video: {
      src: videoProyectoFauna,
      title: "Avistamiento de aves",
    },
    detail: {
      heroTitle: "Avistamiento de fauna",
      summary:
        "Caminatas de avistamiento y exploración por la reserva natural de la Fundación —9 hectáreas de exuberante vegetación en el piedemonte— para conectar con la biodiversidad en su estado más puro.",
      fullDescription:
        "En la Fundación Calidad creemos que la mejor manera de conservar es conocer y valorar lo que nos rodea. Por ello, hemos convertido nuestra reserva natural —una finca de 9 hectáreas, equivalentes a 90.000 metros cuadrados de exuberante vegetación en el piedemonte— en el principal escenario de nuestras caminatas de avistamiento y exploración, un refugio vivo que se extiende y fortalece al conectarse directamente con las rutas y reservas vecinas de la región.\n\nNuestros recorridos están pensados para conectar al visitante con la biodiversidad en su estado más puro, ofreciendo una experiencia inmersiva a través de diferentes experiencias:\n\nAvistamiento de aves: Los cielos y los árboles del piedemonte son el hogar perfecto para una gran diversidad de especies aladas que llenan el entorno de colores, cantos y movimiento, convirtiendo cada caminata en un deleite para los amantes de la ornitología.\n\nMonos titís y fauna fascinante: Los senderos permiten apreciar de cerca la gracia del mono tití y otros animales emblemáticos de la zona, como el oso hormiguero, cuyos rastros y apariciones silenciosas sorprenden a quienes recorren el bosque.\n\nUn ecosistema variado, hongos y mariposas: El alma de la reserva va mucho más allá de los grandes animales. Cada rincón es un microcosmos vibrante donde revolotean coloridas mariposas y donde el suelo y los troncos albergan una fascinante variedad de hongos y organismos descomponedores, esenciales para mantener el equilibrio y la salud de este bosque tropical.\n\nA través de un turismo de bajo impacto, respetuoso de los tiempos y espacios naturales, te invitamos a caminar con nosotros, respirar el aire puro del piedemonte y ser parte activa de la protección de nuestro patrimonio natural.",
      objectives: [
        "Promover el conocimiento y la valoración de la biodiversidad del piedemonte llanero.",
        "Ofrecer experiencias inmersivas de avistamiento de aves, monos titís y fauna emblemática.",
        "Fomentar un turismo de bajo impacto, respetuoso de los tiempos y espacios naturales.",
        "Visibilizar el ecosistema variado de hongos, mariposas y organismos descomponedores.",
        "Fortalecer la red de rutas y reservas vecinas mediante recorridos responsables.",
      ],
      activities: [
        "Caminatas de avistamiento de aves por los cielos y bosques del piedemonte.",
        "Recorridos para apreciar de cerca el mono tití y otros animales emblemáticos como el oso hormiguero.",
        "Exploración del ecosistema variado: mariposas, hongos y organismos descomponedores.",
        "Turismo de bajo impacto, respetuoso de los tiempos y espacios naturales.",
        "Experiencias inmersivas para caminar, respirar el aire puro y ser parte activa de la conservación.",
      ],
      impact:
        "La reserva natural de la Fundación —una finca de 9 hectáreas, equivalentes a 90.000 metros cuadrados de exuberante vegetación en el piedemonte— es el principal escenario de las caminatas de avistamiento y exploración, ofreciendo una experiencia inmersiva con la biodiversidad del territorio y conectándose con las rutas y reservas vecinas de la región.",
    },
  },
  {
    id: "compostaje",
    slug: "compostaje",
    title: "Compostaje",
    description:
      "Transformación de residuos orgánicos en abono natural para mejorar la salud del suelo y reducir la cantidad de desechos en vertederos.",
    image: projectCompota,
    imageAspect: "aspect-video",
    detailPath: "/proyectos/compostaje",
    gallery: [
      {
        src: projectCompostajeNuevo1,
        alt: "Sistema de compostaje de la Fundación transformando residuos orgánicos",
      },
      {
        src: projectCompostajeNuevo2,
        alt: "Cama de compost en proceso de descomposición en la Fundación",
      },
      {
        src: projectCompostajeNuevo3,
        alt: "Manejo del material orgánico para el compostaje",
      },
      {
        src: projectCompostajeNuevo4,
        alt: "Pila de compost y herramientas utilizadas por la Fundación",
      },
    ],
    detail: {
      heroTitle: "Compostaje",
      summary:
        "Programa de manejo integral de residuos orgánicos mediante técnicas de compostaje casera, comunitaria e industrial a pequeña escala.",
      fullDescription:
        "El programa de Compostaje de la Fundación Calidad tiene como objetivo reducir la cantidad de residuos orgánicos que llegan a los vertederos, transformándolos en un recurso valioso para la agricultura y el jardín. Mediante talleres, jornadas prácticas y acompañamiento técnico, enseñamos a comunidades, hogares y establecimientos a separar y procesar sus residuos orgánicos de manera eficiente. El compost resultante se utiliza para enriquecer suelos degradados, mejorar la retención de agua y disminuir la dependencia de fertilizantes químicos. Este proyecto también contribuye a la reducción de gases de efecto invernadero generados por la descomposición anaeróbica de residuos orgánicos en rellenos sanitarios.",
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
    id: "permacultura",
    slug: "permacultura",
    title: "Permacultura",
    description:
      "Diseño de sistemas productivos sostenibles que integran seres humanos, tierra y recursos de forma armónica con el entorno natural.",
    image: projectRestoration,
    imageAspect: "aspect-video",
    detailPath: "/proyectos/permacultura",
    gallery: [
      {
        src: projectPermacultura1,
        alt: "Jardín de permacultura con huerto y vivienda sostenible",
      },
      {
        src: projectPermacultura2,
        alt: "Bancales elevados para cultivo de alimentos",
      },
      {
        src: projectPermacultura3,
        alt: "Sendero entre cultivos agroforestales y bosque",
      },
      {
        src: projectPermacultura4,
        alt: "Huerta orgánica en finca agroecológica",
      },
    ],
    detail: {
      heroTitle: "Permacultura",
      summary:
        "Implementación de huertos, jardines y sistemas agroecológicos basados en los principios de permacultura para comunidades rurales y urbanas.",
      fullDescription:
        "El proyecto de Permacultura de la Fundación Calidad busca transformar la relación de las comunidades con la tierra mediante el diseño consciente de espacios productivos sostenibles. A través de la implementación de huertos agroecológicos, jardines de vivienda y sistemas integrados de producción de alimentos, promovemos la soberanía alimentaria y el cuidado del suelo. Nuestro enfoque se basa en los tres éticos de la permacultura: cuidado de la tierra, cuidado de las personas y reparto justo de los excedentes. Trabajamos con comunidades rurales y urbanas para adaptar estos principios a las condiciones locales del territorio colombiano, con especial énfasis en el piedemonte llanero donde se ubica la Fundación, en Villavicencio (Meta).",
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
];

export const stats = [
  { label: "Proyectos realizados", value: "5" },
  { label: "Personas beneficiadas", value: "600+" },
  { label: "Jornadas ambientales", value: "8" },
  { label: "Área natural de la finca (m²)", value: "90.000" },
];

export interface MetalProduct {
  id: string;
  name: string;
  model?: string;
  description: string;
  gallery: { src: string; alt: string }[];
}

/**
 * PRODUCTOS METALMECÁNICOS — Fundación Calidad
 * -------------------------------------------------
 * Lista editable de productos. Las galerías están vacías a propósito:
 * se llenan agregando fotografías en src/assets y con su import aquí.
 */
export const metalProducts: MetalProduct[] = [
  {
    id: "asador",
    name: "El asador",
    model: "TRIPAG 01 80 FNB",
    description: "Fundación Calidad",
    gallery: [],
  },
  {
    id: "remolque-trituradora",
    name: "El remolque con la Trituradora Tritupag",
    description: "Fundación Calidad",
    gallery: [],
  },
  {
    id: "cortadora-cesped",
    name: "La cortadora de césped",
    description: "Fundación Calidad",
    gallery: [],
  },
];

/** PROVISIONAL: reemplazar por los datos oficiales de la Fundación. */
export const contact = {
  email: "fundacioncalidad.org2026@gmail.com",
  phone: "+57 322 359 8898",
  address: "Km 4 #3, Finca Bonaire, Villavicencio, Meta",
  /**
   * Gmail — abre Gmail con un correo nuevo dirigido a la Fundación.
   */
  gmail: {
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=fundacioncalidad.org2026@gmail.com",
    label: "Gmail",
  },
  /**
   * WhatsApp — PROVISIONAL: reemplazar por el número real.
   * Formato: https://wa.me/<codigo_pais><numero>?text=<mensaje%20prellenado>
   */
  whatsapp: {
    href: "https://wa.me/573223598898?text=Hola%20Fundaci%C3%B3n%20Calidad%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n.",
    label: "Escríbenos por WhatsApp",
  },
  social: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/fundacioncalidadorg/",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/people/Fundacion-Calidadorg/100081206269536/",
    },
  ],
};

/**
 * UBICACIÓN — Fundación Calidad
 * -------------------------------------------------
 * Coordenadas y enlaces de Google Maps. Los tres URLs que se derivan de aquí
 * usan el formato oficial de "Google Maps URLs" (api=1) y el iframe usa el
 * "share embed" de Google Maps: ninguno requiere API key ni tarjeta de crédito.
 *
 * Para actualizar la ubicación: cambia `lat`, `lng` y `placeId` por los del
 * lugar en Google Maps (el Place ID aparece en el enlace como `1s0x...:0x...`,
 * o en Google Maps > Compartir > Copiar enlace).
 */
const lat = 4.0937687;
const lng = -73.6677213;
const placeId = "0x8e3e31c9b77fad2f:0xd76b783c0a1a67be";
const coordinates = `${lat},${lng}`;

export const location = {
  address: "Km 4 #3, Finca Bonaire, Villavicencio, Meta",
  lat,
  lng,
  placeId,
  zoom: 15,
  /**
   * "Cómo llegar" — abre la app de Google Maps en Android/iOS y Maps web en
   * escritorio. Sin `origin` porque el punto de partida por defecto es la
   * ubicación del dispositivo.
   */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    coordinates,
  )}&travelmode=driving`,
  /**
   * Abre el lugar en Google Maps. Se usa el Place ID para asegurar que apunte
   * a la Fundación y no a un punto cercano con nombre parecido.
   */
  placeUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    coordinates,
  )}&query_place_id=${encodeURIComponent(placeId)}`,
  /** Enlace corto para compartir. */
  shareUrl: "https://maps.app.goo.gl/11scfnvt7h",
  /**
   * Mapa embebido: mismo iframe que genera Google Maps en
   * Compartir > Insertar un mapa. `output=embed` no necesita API key.
   */
  embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(coordinates)}&z=15&hl=es&output=embed`,
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
      id: "wompi",
      name: "Wompi",
      subtitle: "Pasarela de pagos regional · Colombia",
      kind: "link",
      description:
        "Dona con los principales medios de pago de Colombia: PSE, Nequi, Bancolombia, DaviPlata, tarjetas de crédito y débito Visa y Mastercard, Sistecredito y pagos en efectivo. La transacción se realiza de forma segura sin salir de la pasarela.",
      reference: "PENDIENTE: enlace de pago de Wompi",
      placeholder: "Se agregará el link de cobro de tu cuenta Wompi.",
      link: "https://wompi.com",
    },
    {
      id: "paypal",
      name: "PayPal",
      subtitle: "Pasarela de pagos internacional",
      kind: "link",
      description:
        "Dona desde cualquier país del mundo con PayPal: saldo de PayPal, tarjetas de crédito o débito internacionales y pagos en distintas divisas. Ideal para donantes fuera de Colombia.",
      reference: "PENDIENTE: correo de PayPal",
      placeholder: "Ej: donaciones@fundacioncalidad.org2026",
      link: "https://www.paypal.com/donate",
    },
  ],
};

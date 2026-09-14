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
import projectCompostaje1 from "@/assets/project-compostaje-1.jpg";
import projectCompostaje2 from "@/assets/project-compostaje-2.jpg";
import projectCompostaje3 from "@/assets/project-compostaje-3.jpg";
import projectCompostaje4 from "@/assets/project-compostaje-4.jpg";
import projectFauna from "@/assets/project-fauna.jpg";
import projectFaunaTiti from "@/assets/project-fauna-titi.jpg";
import projectFaunaTucan from "@/assets/project-fauna-tucan.jpg";
import projectFaunaGuacamaya from "@/assets/project-fauna-guacamaya.jpg";
import projectFaunaGarza from "@/assets/project-fauna-garza.jpg";
import projectSenderismo from "@/assets/project-senderismo.jpg";
import projectSenderismo2 from "@/assets/project-senderismo-2.jpg";
import projectSenderismo3 from "@/assets/project-senderismo-3.jpg";
import projectSenderismo4 from "@/assets/project-senderismo-4.jpg";
import projectSenderismo5 from "@/assets/project-senderismo-5.jpg";
import projectMtb from "@/assets/project-mtb.jpg";
import projectMtb1 from "@/assets/project-mtb-pista-1.jpg";
import projectMtb2 from "@/assets/project-mtb-pista-2.jpg";
import projectMtb4 from "@/assets/project-mtb-pista-4.jpg";
import projectMtb5 from "@/assets/project-mtb-pista-5.jpg";

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
  { label: "Contacto", href: "/#contacto" },
];

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  detailPath: string;
  gallery?: { src: string; alt: string }[];
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
  {
    id: "compostaje",
    slug: "compostaje",
    title: "Compostaje",
    description:
      "Transformación de residuos orgánicos en abono natural para mejorar la salud del suelo y reducir la cantidad de desechos en vertederos.",
    image: projectCompota,
    detailPath: "/proyectos/compostaje",
    gallery: [
      {
        src: projectCompostaje1,
        alt: "Sistema de compostaje casero en el hogar",
      },
      {
        src: projectCompostaje2,
        alt: "Pila de compost en proceso de descomposición",
      },
      {
        src: projectCompostaje3,
        alt: "Recipiente de lombricomposta con material orgánico",
      },
      {
        src: projectCompostaje4,
        alt: "Recipiente de residuos orgánicos para compostaje",
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
    id: "avistamiento-de-fauna",
    slug: "avistamiento-de-fauna",
    title: "Avistamiento de fauna",
    description:
      "Recorridos guiados para observar la fauna silvestre de la Orinoquía en su hábitat natural: monos titis, aves, osos hormigueros y más especies del piedemonte llanero.",
    image: projectFauna,
    detailPath: "/proyectos/avistamiento-de-fauna",
    gallery: [
      {
        src: projectFaunaTiti,
        alt: "Mono tití, una de las especies más fáciles de observar en el piedemonte llanero",
      },
      {
        src: projectFaunaTucan,
        alt: "Tucán pico irís, ave emblemática de los bosques del Meta",
      },
      {
        src: projectFaunaGuacamaya,
        alt: "Guacamayas, aves coloridas de la Orinoquía colombiana",
      },
      {
        src: projectFaunaGarza,
        alt: "Garza pescando en un humedal del piedemonte llanero",
      },
    ],
    detail: {
      heroTitle: "Avistamiento de fauna",
      summary:
        "Caminatas guiadas por los bosques y sabanas del piedemonte llanero para conocer la fauna silvestre de la Orinoquía: monos titis, tucanes, garzas, guacamayas, chigüiros y el oso hormiguero del Llano.",
      fullDescription:
        "El proyecto de Avistamiento de fauna de la Fundación Calidad nace de la riqueza biológica del territorio donde trabajamos, en el piedemonte de la cordillera Oriental y la sabana de la Orinoquía colombiana, en Villavicencio (Meta). Esta región alberga alrededor de 1.200 especies de aves, más de 320 mamíferos, 270 anfibios y 290 reptiles, y Villavicencio aporta cerca del 35 % de las aves registradas en el departamento, con más de 230 especies. En el Global Big Day 2025, el Meta ocupó el primer lugar nacional con 658 especies reportadas, y Colombia lideró el mundo en ese registro.\n\nA través de recorridos responsables de bajo impacto, nos acercamos a las especies más comunes y fáciles de ver en la zona: el mono tití y otras especies de primates, el oso hormiguero del Llano (bandera), chigüiros, venados cola blanca, dantas y armadillos; y entre las aves, tucanes de pico irís, guacamayas, loros, garzas, colibríes y paujiles. En los cuerpos de agua se observan babillas, tortugas y una enorme variedad de peces, y en las noches, murciélagos: en Villavicencio se han registrado al menos 62 especies. El avistamiento se realiza con binoculares, fotografías sin flash y en silencio, respetando las distancias y los horarios de mayor actividad (madrugada y atardecer), siguiendo el manual de avistamiento responsable de fauna silvestre de la Orinoquía. La reserva natural de la Fundación —una finca de 10 hectáreas con abundante vegetación en el piedemonte— es el principal escenario de estas caminatas, junto con las rutas y reservas vecinas.",
      objectives: [
        "Promover el conocimiento y la valoración de la fauna silvestre del Meta.",
        "Fomentar el avistamiento responsable y de bajo impacto en los senderos.",
        "Registrar la biodiversidad presente en los predios de la Fundación y sus alrededores.",
        "Sensibilizar sobre especies icónicas y amenazadas como el oso hormiguero del Llano.",
        "Generar ingresos sostenibles para la comunidad mediante el ecoturismo de observación.",
      ],
      activities: [
        "Caminatas guiadas de observación de aves al amanecer y al atardecer.",
        "Recorridos de búsqueda de monos titis y otros primates del piedemonte.",
        "Talleres de fotografía de naturaleza y dibujo de campo.",
        "Jornadas de ciencia ciudadana con plataformas como eBird e iNaturalist.",
        "Charlas sobre avistamiento responsable y conservación de hábitats.",
      ],
      impact:
        "La reserva natural de la Fundación, de 10 hectáreas de bosque y vegetación en el piedemonte llanero, es el escenario principal de las caminatas de avistamiento, donde se han registrado especies como el oso hormiguero del Llano, monos titis, tucanes y guacamayas, con la participación de observadores locales y visitantes de toda la región.",
    },
  },
  {
    id: "senderismo",
    slug: "senderismo",
    title: "Senderismo",
    description:
      "Recorridos a pie por los senderos ecológicos del piedemonte llanero que combinan deporte, naturaleza y educación ambiental, aptos para todas las edades.",
    image: projectSenderismo,
    detailPath: "/proyectos/senderismo",
    gallery: [
      {
        src: projectSenderismo,
        alt: "Sendero ecológico entre bosque y vegetación nativa",
      },
      {
        src: projectSenderismo2,
        alt: "Camino de senderismo a través del bosque",
      },
      {
        src: projectSenderismo3,
        alt: "Caminante con morral recorriendo la montaña",
      },
      {
        src: projectSenderismo4,
        alt: "Cascada en medio de la selva y el bosque",
      },
      {
        src: projectSenderismo5,
        alt: "Bosque de niebla y montaña en el trópico",
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
    id: "pista-eliana-caicedo",
    slug: "pista-eliana-caicedo",
    title: "Pista Eliana Caicedo",
    description:
      "La pista de ciclomontañismo de la Fundación, dedicada a Eliana Caicedo, campeona mundial y panamericana de MTB: deporte, recreación y competencias en una sola pista.",
    image: projectMtb,
    detailPath: "/proyectos/pista-eliana-caicedo",
    gallery: [
      {
        src: projectMtb1,
        alt: "Rodada por senderos de montaña estilo cross country",
      },
      {
        src: projectMtb2,
        alt: "Competencia de mountain bike en terreno irregular",
      },
      {
        src: projectMtb4,
        alt: "Camino forestal para bicicleta de montaña",
      },
      {
        src: projectMtb5,
        alt: "Descenso de MTB en carrera downhill",
      },
    ],
    detail: {
      heroTitle: "Pista Eliana Caicedo — MTB",
      summary:
        "La pista de ciclomontañismo Eliana Caicedo: un circuito dedicado a la campeona mundial llanera para la práctica deportiva, rodadas recreativas y competencias de MTB.",
      fullDescription:
        "La Fundación Calidad cuenta con la Pista Eliana Caicedo, la pista de ciclomontañismo bautizada en honor a la deportista llanera Eliana Caicedo Romero, nacida en Villavicencio (Meta). Eliana se coronó campeona mundial de Cross Country Olímpico (XCO), categoría Máster, en el Campeonato Mundial disputado en Villa La Angostura, Argentina, en abril de 2022, y semanas después se consagró campeona panamericana de la misma modalidad en Catamarca, Argentina. A su palmarés se suman el título de la Copa Colombia de Maratón, el Campeonato Nacional Máster y múltiples medallas de oro y plata en competencias nacionales, además de ser una de las mayores exponentes del ciclismo femenino de esta modalidad en el país.\n\nLa pista aprovecha el relieve natural del piedemonte llanero sobre los terrenos verdes de la Fundación, con un circuito que combina subidas, bajadas y curvas técnicas para la práctica recreativa, las rodadas y las competencias de MTB. Además del escenario deportivo, el proyecto sostiene una escuela de MTB para niños, jóvenes y principiantes, talleres de mecánica básica y seguridad en la pista, y jornadas comunitarias de mantenimiento y señalización. Las imágenes actuales corresponden a pistas genéricas referenciales; próximamente se publicarán las fotografías reales de la pista Eliana Caicedo.",
      objectives: [
        "Mantener y mejorar la única pista de MTB de la Fundación, la Pista Eliana Caicedo.",
        "Honrar la trayectoria de Eliana Caicedo como referente del ciclismo llanero y colombiano.",
        "Organizar rodadas recreativas y cronoescaladas abiertas a la comunidad.",
        "Formar una escuela de MTB para niños, jóvenes y principiantes.",
        "Promover el turismo deportivo y los hábitos de vida saludable en la región.",
      ],
      activities: [
        "Jornadas comunitarias de construcción, mantenimiento y señalización de la pista.",
        "Rodadas recreativas y cronoescaladas semanales.",
        "Escuela de MTB para niños, jóvenes y principiantes.",
        "Talleres de mecánica básica, seguridad y convivencia en la pista.",
        "Encuentros y rodadas inspiradas en la trayectoria de Eliana Caicedo.",
      ],
      impact:
        "La Pista Eliana Caicedo es el escenario de rodadas y competencias que reúnen a más de 300 deportistas de la región, y un homenaje permanente a la campeona mundial y panamericana de ciclomontañismo nacida en Villavicencio.",
    },
  },
];

export const stats = [
  { label: "Proyectos realizados", value: "5" },
  { label: "Personas beneficiadas", value: "600+" },
  { label: "Jornadas ambientales", value: "8" },
  { label: "Área natural de la finca (m²)", value: "90.000" },
];

/** PROVISIONAL: reemplazar por los datos oficiales de la Fundación. */
export const contact = {
  email: "correo@ejemplo.org",
  phone: "+57 000 000 0000",
  address: "Km 4 #3, Finca Bonaire, Villavicencio, Meta",
  /**
   * WhatsApp — PROVISIONAL: reemplazar por el número real.
   * Formato: https://wa.me/<codigo_pais><numero>?text=<mensaje%20prellenado>
   */
  whatsapp: {
    href: "https://wa.me/573000000000?text=Hola%20Fundaci%C3%B3n%20Calidad%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n.",
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
      placeholder: "Ej: donaciones@fundacioncalidad.org",
      link: "https://www.paypal.com/donate",
    },
  ],
};

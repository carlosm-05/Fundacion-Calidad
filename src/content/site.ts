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
  { label: "Compromiso ambiental", href: "#compromiso" },
  { label: "Noticias", href: "#noticias" },
  { label: "Contacto", href: "#contacto" },
];

export const projects = [
  {
    id: "conservacion",
    title: "Conservación ambiental",
    description:
      "Acciones de protección y monitoreo de ecosistemas estratégicos, con apoyo de comunidades locales. (Texto provisional editable).",
    image: projectConservation,
  },
  {
    id: "educacion",
    title: "Educación ecológica",
    description:
      "Talleres y jornadas formativas sobre cuidado del entorno dirigidos a niñas, niños y jóvenes. (Texto provisional editable).",
    image: projectEducation,
  },
  {
    id: "recuperacion",
    title: "Recuperación de espacios naturales",
    description:
      "Intervenciones para restaurar zonas verdes, senderos y áreas degradadas del territorio. (Texto provisional editable).",
    image: projectRestoration,
  },
  {
    id: "comunidad",
    title: "Participación comunitaria",
    description:
      "Espacios de trabajo conjunto con organizaciones y vecinos para liderar iniciativas ambientales. (Texto provisional editable).",
    image: projectCommunity,
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

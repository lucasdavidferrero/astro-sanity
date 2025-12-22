import groq from 'groq';

export const NOTICIAS_QUERY = groq`*[_type == "noticias" && defined(slug.current)] | order(publishedAt desc)`;

export const NOTICIA_DETALLE_QUERY = groq`*[_type == "noticias" && slug.current == $slug][0]`;
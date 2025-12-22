import groq from 'groq';

// ============================================
// QUERIES DE NOTICIAS
// ============================================

/**
 * Obtiene todas las noticias publicadas (para listados)
 * Proyección optimizada: solo campos necesarios
 */
export const NOTICIAS_QUERY = groq`
  *[_type == "noticia" && defined(slug.current)] 
  | order(fechaPublicacion desc) {
    _id,
    titulo,
    slug,
    fechaPublicacion,
    portada {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`;

/**
 * Obtiene una noticia específica por su slug
 */
export const NOTICIA_DETALLE_QUERY = groq`
  *[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    fechaPublicacion,
    portada {
      asset->,
      alt,
      hotspot,
      crop
    },
    contenido[] {
      ...,
      _type == "image" => {
        asset->,
        alt,
        hotspot,
        crop
      }
    }
  }
`;

/**
 * Obtiene solo los slugs de noticias publicadas
 * Útil para getStaticPaths (más rápido)
 */
export const NOTICIAS_SLUGS_QUERY = groq`
  *[_type == "noticia" && defined(slug.current)] {
    "slug": slug.current
  }
`;

// ============================================
// QUERIES DE BANNERS
// ============================================

/**
 * Obtiene todos los banners activos ordenados por posición
 */
export const BANNERS_QUERY = groq`
  *[_type == "banner" && activo == true] 
  | order(posicion asc) {
    _id,
    titulo,
    imagen {
      asset->,
      alt,
      hotspot,
      crop
    },
    posicion,
    link {
      tipo,
      url,
      slug-> {
        _id,
        titulo,
        slug
      }
    }
  }
`;

/**
 * Obtiene un banner específico por ID (útil para preview)
 */
export const BANNER_BY_ID_QUERY = groq`
  *[_type == "banner" && _id == $id][0] {
    _id,
    titulo,
    imagen {
      asset->,
      alt,
      hotspot,
      crop
    },
    posicion,
    activo,
    link {
      tipo,
      url,
      slug-> {
        _id,
        titulo,
        slug
      }
    }
  }
`;

// ============================================
// QUERIES COMBINADAS
// ============================================

/**
 * Obtiene datos para la homepage (banners + últimas noticias)
 * Query optimizada con una sola llamada
 */
export const HOMEPAGE_QUERY = groq`
  {
    "banners": *[_type == "banner" && activo == true] 
      | order(posicion asc) {
        _id,
        titulo,
        imagen {
          asset->,
          alt,
          hotspot,
          crop
        },
        posicion,
        link {
          tipo,
          url,
          slug-> {
            _id,
            titulo,
            slug
          }
        }
      },
    "noticias": *[_type == "noticia" && defined(slug.current)] 
      | order(fechaPublicacion desc) [0...6] {
        _id,
        titulo,
        slug,
        fechaPublicacion,
        portada {
          asset->,
          alt,
          hotspot,
          crop
        }
      }
  }
`;

// ============================================
// EXPORTS DE PARÁMETROS
// ============================================

/**
 * Proyecciones reutilizables para mantener consistencia
 */
export const PROJECTIONS = {
  imagen: `{
    asset->,
    alt,
    hotspot,
    crop
  }`,
  
  imagenConCaption: `{
    asset->,
    alt,
    caption,
    hotspot,
    crop
  }`,
  
  noticiaBasica: `{
    _id,
    titulo,
    slug,
    fechaPublicacion
  }`,
  
  linkConReferencia: `{
    tipo,
    url,
    slug-> {
      _id,
      titulo,
      slug
    }
  }`,
};
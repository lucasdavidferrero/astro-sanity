import type { PortableTextBlock } from '@portabletext/types';
import type { ImageAsset, Reference, Slug } from '@sanity/types';

// ============================================
// TIPOS BASE DE SANITY
// ============================================

/**
 * Tipo genérico para documentos de Sanity
 */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/**
 * Imagen de Sanity con asset y metadatos
 */
export interface SanityImage {
  _type: 'image';
  asset: Reference;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
}

/**
 * Referencia a otro documento
 */
export interface SanityReference {
  _type: 'reference';
  _ref: string;
}

// ============================================
// TIPOS DE LINK (PARA BANNERS Y OTROS)
// ============================================

export type LinkType = 'none' | 'internal' | 'external';

export interface BannerLink {
  tipo: LinkType;
  url?: string; // Para enlaces externos
  slug?: SanityReference; // Para enlaces internos (referencia a noticia)
}

// ============================================
// ESQUEMA DE BANNER
// ============================================

export interface Banner extends SanityDocument {
  _type: 'banner';
  titulo: string;
  imagen: SanityImage;
  posicion: number;
  activo: boolean;
  link?: BannerLink;
}

/**
 * Banner con la referencia resuelta (para queries con populate)
 */
export interface BannerPopulated extends Omit<Banner, 'link'> {
  link?: BannerLink & {
    slug?: Noticia; // Referencia resuelta
  };
}

// ============================================
// ESQUEMA DE NOTICIA
// ============================================

export interface Noticia extends SanityDocument {
  _type: 'noticia';
  titulo: string;
  slug: Slug;
  fechaPublicacion: string;
  portada?: SanityImage;
  contenido: PortableTextBlock[];
  // publicada: boolean;
}

// ============================================
// TIPOS AUXILIARES PARA QUERIES
// ============================================

/**
 * Tipo para resultados de listados con proyección
 */
export interface NoticiaListItem {
  _id: string;
  titulo: string;
  slug: Slug;
  fechaPublicacion: string;
  portada?: SanityImage;
}

/**
 * Tipo para slugs en getStaticPaths
 */
export interface SlugParam {
  slug: string;
}

// ============================================
// TYPE GUARDS (para validación en runtime)
// ============================================

export function isBanner(doc: SanityDocument): doc is Banner {
  return doc._type === 'banner';
}

export function isNoticia(doc: SanityDocument): doc is Noticia {
  return doc._type === 'noticia';
}

export function isExternalLink(link?: BannerLink): boolean {
  return link?.tipo === 'external';
}

export function isInternalLink(link?: BannerLink): boolean {
  return link?.tipo === 'internal';
}

// ============================================
// HELPERS DE TRANSFORMACIÓN
// ============================================

/**
 * Convierte un slug de Sanity a string
 */
export function slugToString(slug: Slug): string {
  return slug.current;
}

/**
 * Obtiene la URL de un link de banner (con lógica interna/externa)
 */
export function getBannerLinkUrl(banner: BannerPopulated): string | null {
  if (!banner.link || banner.link.tipo === 'none') return null;

  if (isExternalLink(banner.link)) {
    return banner.link.url || null;
  }

  if (isInternalLink(banner.link) && banner.link.slug) {
    const noticia = banner.link.slug as Noticia;
    return `/noticias/${slugToString(noticia.slug)}`;
  }

  return null;
}

/**
 * Determina si un link debe abrirse en nueva pestaña
 */
export function shouldOpenInNewTab(link?: BannerLink): boolean {
  return isExternalLink(link);
}
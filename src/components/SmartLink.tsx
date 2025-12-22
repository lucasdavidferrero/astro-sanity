import React from 'react';
import type { BannerLink } from '../types/sanity.types';
import { isExternalLink, isInternalLink } from '../types/sanity.types';

interface SmartLinkProps {
  link?: BannerLink;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Componente React que maneja links internos y externos automáticamente
 * - Links externos: abren en nueva pestaña con rel="noopener noreferrer"
 * - Links internos: navegación normal con la referencia resuelta
 * - Sin link: renderiza solo el contenido sin wrapper
 */
export function SmartLink({ link, children, className, ariaLabel }: SmartLinkProps) {
  // Si no hay link o es tipo 'none', renderizar solo los children
  if (!link || link.tipo === 'none') {
    return <>{children}</>;
  }

  // Link externo
  if (isExternalLink(link) && link.url) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  // Link interno con referencia resuelta
  if (isInternalLink(link) && link.slug) {
    // Extraer el slug de la referencia
    const href = typeof link.slug === 'object' && 'slug' in link.slug
      ? `/noticias/${link.slug.slug.current}`
      : '#';

    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  // Fallback: renderizar solo los children si la configuración es inválida
  return <>{children}</>;
}

// ============================================
// VARIANTES PARA CASOS ESPECÍFICOS
// ============================================

interface ButtonLinkProps extends SmartLinkProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Variante de botón con estilos predefinidos
 */
export function ButtonLink({ 
  link, 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ariaLabel 
}: ButtonLinkProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

  return (
    <SmartLink link={link} className={combinedClassName} ariaLabel={ariaLabel}>
      {children}
    </SmartLink>
  );
}

// ============================================
// UTILIDADES PARA USAR EN COMPONENTES ASTRO
// ============================================

/**
 * Hook para extraer props de link de manera segura
 */
export function useLinkProps(link?: BannerLink) {
  if (!link || link.tipo === 'none') {
    return null;
  }

  if (isExternalLink(link) && link.url) {
    return {
      href: link.url,
      target: '_blank' as const,
      rel: 'noopener noreferrer' as const,
    };
  }

  if (isInternalLink(link) && link.slug) {
    const href = typeof link.slug === 'object' && 'slug' in link.slug
      ? `/noticias/${link.slug.slug.current}`
      : '#';

    return {
      href,
    };
  }

  return null;
}

/**
 * Determina si un elemento debe renderizarse como link
 */
export function shouldRenderAsLink(link?: BannerLink): boolean {
  return !!(
    link && 
    link.tipo !== 'none' && 
    (
      (isExternalLink(link) && link.url) ||
      (isInternalLink(link) && link.slug)
    )
  );
}
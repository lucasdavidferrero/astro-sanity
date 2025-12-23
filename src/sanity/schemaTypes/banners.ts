import { defineField, defineType } from 'sanity';

export const banner = defineType({
  name: 'banner',
  title: 'Banners del Carousel',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del Banner',
      type: 'string',
      description: 'Título interno para identificar el banner en el CMS',
      validation: (Rule) => Rule.required().min(3).max(60),
    }),
    defineField({
      /* https://www.sanity.io/recipes/schema-validation-rules-to-enforce-maximum-file-size-b918f5c8 */
      name: 'imagen',
      title: 'Imagen del Banner',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip', 'palette'],
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
          description: 'Descripción de la imagen para accesibilidad',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'posicion',
      title: 'Orden de Aparición',
      type: 'number',
      description: 'Número que determina el orden en el carousel (menor = primero)',
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'activo',
      title: '¿Publicado?',
      type: 'boolean',
      description: 'Desactivar temporalmente sin eliminar',
      initialValue: true,
    }),
    defineField({
      name: 'link',
      title: 'Enlace (Opcional)',
      type: 'object',
      description: 'Configurar si el banner debe llevar a algún destino',
      fields: [
        defineField({
          name: 'tipo',
          title: 'Tipo de Enlace',
          type: 'string',
          options: {
            list: [
              { title: 'Sin enlace', value: 'none' },
              { title: 'Página interna (slug)', value: 'internal' },
              { title: 'URL externa', value: 'external' },
            ],
            layout: 'radio',
          },
          initialValue: 'none',
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'string',
          description: 'Para enlaces externos: https://ejemplo.com',
          hidden: ({ parent }) => parent?.tipo !== 'external',
          validation: (Rule) =>
            Rule.custom((url, context) => {
              const tipo = (context.parent as any)?.tipo;
              if (tipo === 'external' && !url) {
                return 'La URL es requerida para enlaces externos';
              }
              if (tipo === 'external' && url && !url.match(/^https?:\/\//)) {
                return 'La URL debe comenzar con http:// o https://';
              }
              return true;
            }),
        }),
        defineField({
          name: 'slug',
          title: 'Slug de la noticia',
          type: 'reference',
          to: [{ type: 'noticia' }],
          description: 'Selecciona la noticia a la que debe apuntar',
          hidden: ({ parent }) => parent?.tipo !== 'internal',
          validation: (Rule) =>
            Rule.custom((slug, context) => {
              const tipo = (context.parent as any)?.tipo;
              if (tipo === 'internal' && !slug) {
                return 'Debes seleccionar una noticia';
              }
              return true;
            }),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'imagen',
      posicion: 'posicion',
      activo: 'activo',
    },
    prepare({ title, media, posicion, activo }) {
      return {
        title: `${posicion}. ${title}`,
        subtitle: activo ? '✅ Publicado' : '⏸️ Pausado',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Posición (menor a mayor)',
      name: 'posicionAsc',
      by: [{ field: 'posicion', direction: 'asc' }],
    },
  ],
});
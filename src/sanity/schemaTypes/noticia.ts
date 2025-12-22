import { defineField, defineType } from 'sanity';

export const noticia = defineType({
  name: 'noticia',
  title: 'Noticias',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título de la Noticia',
      type: 'string',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim(),
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'fechaPublicacion',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'portada',
      title: 'Imagen de Portada',
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
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          title: 'Pie de foto (opcional)',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'contenido',
      title: 'Cuerpo de la noticia',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Cita', value: 'blockquote' },
          ],
          lists: [
            { title: 'Lista con viñetas', value: 'bullet' },
            { title: 'Lista numerada', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Negrita', value: 'strong' },
              { title: 'Cursiva', value: 'em' },
              { title: 'Subrayado', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Enlace',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              title: 'Pie de foto',
              type: 'string',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    /*defineField({
      name: 'publicada',
      title: '¿Publicada?',
      type: 'boolean',
      description: 'Solo las noticias publicadas aparecerán en el sitio',
      initialValue: true,
    }),*/
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'portada',
      fecha: 'fechaPublicacion',
      // publicada: 'publicada',
    },
    prepare({ title, media, fecha, /* publicada */ }) {
      return {
        title,
        subtitle: `${new Date(fecha).toLocaleDateString('es-ES')} ${ true ? '✅' : '⏸️'}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Fecha de publicación (más reciente primero)',
      name: 'fechaDesc',
      by: [{ field: 'fechaPublicacion', direction: 'desc' }],
    },
  ],
});
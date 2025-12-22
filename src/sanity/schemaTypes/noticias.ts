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
      options: { source: 'titulo', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fechaPublicacion',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'portada',
      title: 'Imagen de Portada',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contenido',
      title: 'Cuerpo de la noticia',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
});
import { defineField, defineType } from 'sanity';

export const presidente = defineType({
  name: 'presidente',
  title: 'Presidentes',
  type: 'document',
  fields: [
    defineField({
      name: 'nombreCompleto',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nombreCompleto',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'periodo',
      title: 'Período de Mandato',
      type: 'object',
      fields: [
        {
          name: 'añoDesde',
          title: 'Año de Inicio',
          type: 'number',
          validation: (Rule) => Rule.required().min(1800).max(2100),
        },
        {
          name: 'añoHasta',
          title: 'Año de Finalización',
          type: 'number',
          description: 'Dejar vacío si es el presidente actual.',
          validation: (Rule) => Rule.min(Rule.valueOfField('añoDesde')),
        },
      ],
      options: {
        columns: 2,
      },
    }),
    defineField({
      name: 'retrato',
      title: 'Retrato (Imagen)',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'biografia',
      title: 'Biografía Breve / Información',
      type: 'text',
      rows: 5,
      description: 'Un pequeño resumen sobre su trayectoria o aportes.',
    }),
  ],
  preview: {
    select: {
      title: 'nombreCompleto',
      desde: 'periodo.añoDesde',
      hasta: 'periodo.añoHasta',
      media: 'retrato',
    },
    prepare({ title, desde, hasta, media }) {
      return {
        title,
        subtitle: hasta ? `${desde} - ${hasta}` : `${desde} - Presente`,
        media,
      };
    },
  },
});
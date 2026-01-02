import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'course',
  title: 'Cursos',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del Curso',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'titulo',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publicoObjetivo',
      title: 'Público Objetivo',
      type: 'string',
      options: {
        list: [
          { title: 'Público General / Personas', value: 'personas' },
          { title: 'Empresas', value: 'empresas' },
          { title: 'Ambos', value: 'ambos' },
        ],
        layout: 'radio', // O 'dropdown' si prefieres una lista desplegable
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imagenPortada',
      title: 'Imagen de Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'fechaInicio',
      title: 'Fecha de Inicio',
      type: 'datetime',
    }),
    defineField({
      name: 'fechaFin',
      title: 'Fecha de Finalización',
      type: 'datetime',
    }),
    defineField({
      name: 'descripcionCorta',
      title: 'Descripción Corta',
      type: 'text',
      rows: 3,
      description: 'Breve resumen para las tarjetas de la lista de cursos.',
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido del Curso',
      type: 'array',
      of: [
        { type: 'block' }, // Texto enriquecido (Portable Text)
        { 
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Texto Alternativo',
            }
          ]
        }
      ],
    }),
    defineField({
      name: 'archivosAdjuntos',
      title: 'Documentos y Recursos (PDFs)',
      type: 'array',
      of: [
        {
          type: 'file',
          title: 'Archivo',
          options: {
            accept: '.pdf,.doc,.docx',
          },
          fields: [
            {
              name: 'nombreVisible',
              type: 'string',
              title: 'Nombre para mostrar del archivo',
            }
          ]
        }
      ],
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'imagenPortada',
      subtitle: 'publicoObjetivo',
    },
    prepare(selection) {
      const { subtitle } = selection
      return {
        ...selection,
        subtitle: subtitle ? `Para: ${subtitle.toUpperCase()}` : 'Sin público definido',
      }
    },
  },
})
# Prompt

ITERATION 1.
Actúa como un Senior Fullstack Architect experto en AstroJS, TypeScript, Sanity CMS y Netlify.

Contexto: Estoy desarrollando un sitio web para una institución educativa con presupuesto limitado. El objetivo es minimizar costos usando un enfoque Full SSG desplegado en Netlify.

Misión: Analiza el proyecto y recomiéndame los artefactos (archivos, esquemas, interfaces) necesarios, siguiendo estos requisitos estrictos:
1. TypeScript Riguroso (Sin TypeGen de Sanity): Define interfaces manuales o tipos genéricos para los documentos de Sanity. Necesito que el tipado sea robusto, especialmente para el contenido de las "Noticias" y los "Banners". Tal vez podríamos aprovechar (si es que existen) interfaces o Generics ofrecido por Sanity.
2. Esquema de Banners para Carousel: Crea el schema de Sanity para un objeto "Banner" con:
 - Imagen (con hotspot).
 - Posición (número para ordenamiento).
 - Link opcional: Debe soportar una lógica de Internal vs External link. Si es externo, el sistema debe añadir automáticamente target="_blank" rel="noopener".
3. Flujo de Despliegue Manual: Explica cómo implementar un botón personalizado dentro del Sanity Studio que dispare un Build Hook de Netlify. Esto permitirá que el cliente controle cuándo se regenera el sitio SSG. Por ejemplo, el cliente modifica todo lo necesario en el Studio y al finalizar todos los cambios presiona el boton "Desplegar cambios".
4. Arquitectura SSG: Recomienda cómo estructurar las consultas (GROQ) para asegurar que el contenido se inyecte correctamente en tiempo de compilación.

Entregables: > * Código de los Schemas de Sanity (Noticia y Banner).
* Interfaces de TypeScript correspondientes.
* Configuración o snippet para el botón de despliegue en el Studio.
* Ejemplo de componente React que maneje la lógica de links (interno vs externo).

Aclaraciones:
* Tratemos de utilizar los componentes Astro en lo posible.
* Como "Frontend Frameworks" (astro) utilizamos React.



ITERATION 2.

# Prompt

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



Necesito que analizes este proyecto y me recomiendes artefactos a agregar/modificar.
- Quiero que este proyecto utilize Typescript lo mas posible, en especial cuando lidiamos con documentos que vienen de Sanity, tal vez podríamos aprovechar interfaces o Generics que Sanity nos ofrezca. No utilices "Sanity TypeGen", ya que es algo experimental.
- Además del schema de "Noticia", quisiera otro schema para que el usuario pueda subir/modificar/eliminar Banners que serán vistos dentro de un carousel 
en la página home del sitio web. Un banner tiene una imágen, una posición, un link (opcional), donde este link puede ser interno o externo. Los links externos se habren en una nueva pestaña.
- Adicionalmente, nosotros queremos desplegar este proyecto en Netlify. La idea es minimizar costos ya que el cliente es una institución educativa con un presupuesto limitado. Para ello, decidimos que el sitio sera full SSG, salvo la parte del studio de sanity, donde ahi utilizaremos el rendering mode recomendado por el equipo de sanity.
Dicho esto, el flujo de trabajo sería que el cliente (persona externa) hace todos los cambios que desea en el studio de sanity, y luego presiona un boton "Desplegar cambios", que cuando se presiona, Netlify se encargará de hacer un nuevo build completo del sitio web tomando la información más reciente de sanity.

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { noticia } from "./src/sanity/schemaTypes/noticia";

import { visionTool } from "@sanity/vision";
import { banner } from "./src/sanity/schemaTypes/banners";
import { netlifyDeploy } from "./src/sanity/plugins/netlifyDeploy";


export default defineConfig({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool(),
    visionTool(),

    // Plugin de deploy manual a Netlify
    netlifyDeploy({
      buildHookUrl: import.meta.env.PUBLIC_NETLIFY_BUILD_HOOK || '',
      siteName: 'Sitio Educativo',
    }),
  ],
  schema: {
    types: [noticia, banner],
  },

  // Configuración de la UI del Studio
  title: 'CMS - Sitio Educativo',

  // Prevenir eliminación accidental de contenido publicado
    actions: (prev, { schemaType }) => {
      if (schemaType === 'noticia' || schemaType === 'banner') {
        return prev.map((action) =>
          action.action === 'delete'
            ? {
                ...action,
                onHandle: (props) => {
                  const confirmed = window.confirm(
                    '⚠️ ¿Estás seguro de eliminar este contenido?\n\n' +
                    'Esta acción no se puede deshacer.'
                  );
                  if (confirmed && action.onHandle) {
                    action.onHandle(props);
                  }
                },
              }
            : action
        );
      }
      return prev;
    },


});
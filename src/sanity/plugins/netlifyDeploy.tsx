import { definePlugin } from 'sanity';
import { RocketIcon } from '@sanity/icons';
import React, { useState } from 'react';
import { Card, Stack, Button, Text, Box, useToast } from '@sanity/ui';

interface NetlifyDeployConfig {
  buildHookUrl: string;
  siteName?: string;
}

/**
 * Plugin de Sanity para disparar builds de Netlify manualmente
 * 
 * Instalación en sanity.config.ts:
 * ```
 * import { netlifyDeploy } from './src/sanity/plugins/netlifyDeploy';
 * 
 * export default defineConfig({
 *   plugins: [
 *     netlifyDeploy({
 *       buildHookUrl: 'https://api.netlify.com/build_hooks/YOUR_HOOK_ID',
 *       siteName: 'Mi Sitio Educativo'
 *     })
 *   ]
 * })
 * ```
 */
export const netlifyDeploy = definePlugin<NetlifyDeployConfig>((config) => {
  return {
    name: 'netlify-deploy',
    studio: {
      components: {
        toolMenu: () => <DeployButton config={config} />,
      },
    },
  };
});

function DeployButton({ config }: { config: NetlifyDeployConfig }) {
  const [isDeploying, setIsDeploying] = useState(false);
  const toast = useToast();

  const handleDeploy = async () => {
    if (isDeploying) return;

    const confirmed = window.confirm(
      '🚀 PUBLICAR CAMBIOS EN EL SITIO WEB\n\n' +
      '¿Qué significa esto?\n' +
      '• Se regenerará el sitio web completo con TODOS los cambios realizados en el CMS\n' +
      '• Los visitantes del sitio verán el contenido actualizado\n' +
      '• Este proceso tarda entre 2-5 minutos\n\n' +
      '⚠️ Importante:\n' +
      '• Asegúrate de haber revisado todo el contenido antes de publicar\n' +
      '• Los cambios serán visibles para todos los usuarios\n\n' +
      '¿Deseas continuar con la publicación?'
    );

    if (!confirmed) return;

    setIsDeploying(true);

    try {
      const response = await fetch(config.buildHookUrl, {
        method: 'POST',
      });

      if (response.ok) {
        toast.push({
          status: 'success',
          title: '¡Deploy iniciado exitosamente!',
          description: 'El sitio se está regenerando. Los cambios estarán visibles en 2-5 minutos.',
          duration: 7000,
        });

        localStorage.setItem('lastNetlifyDeploy', new Date().toISOString());
      } else {
        throw new Error(`Error ${response.status}`);
      }
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Error al iniciar el despliegue',
        description: 'No se pudo conectar con el servidor. Por favor, contacta al administrador técnico.',
        duration: 7000,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Button
      text="🚀 Publicar"
      tone="primary"
      onClick={handleDeploy}
      disabled={isDeploying}
      loading={isDeploying}
      fontSize={1}
      padding={2}
    />
  );
}

// ============================================
// ACCIÓN PERSONALIZADA (ALTERNATIVA)
// ============================================

/**
 * Si prefieres una acción en el menú contextual de documentos:
 */
export const deployAction = definePlugin<NetlifyDeployConfig>((config) => {
  return {
    name: 'netlify-deploy-action',
    document: {
      actions: (prev, context) => {
        return [
          ...prev,
          {
            label: 'Publicar en el sitio',
            icon: RocketIcon,
            onHandle: async () => {
              const confirmed = window.confirm(
                '¿Publicar este contenido en el sitio web?\n\n' +
                'Esto regenerará el sitio completo.'
              );

              if (!confirmed) return;

              try {
                const response = await fetch(config.buildHookUrl, {
                  method: 'POST',
                });

                if (response.ok) {
                  alert('¡Deploy iniciado! Los cambios estarán visibles en 2-5 minutos.');
                } else {
                  throw new Error('Error al desplegar');
                }
              } catch (error) {
                alert('Error al iniciar el deploy. Contacta al administrador.');
                console.error(error);
              }
            },
          },
        ];
      },
    },
  };
});
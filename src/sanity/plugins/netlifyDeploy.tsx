import { definePlugin, type ToolMenuProps, ToolLink, useCurrentUser } from 'sanity';
import { PublishIcon, WarningOutlineIcon, PlugIcon } from '@sanity/icons';
import React, { useState, useCallback } from 'react';
import { 
  Button, 
  useToast, 
  Dialog, 
  Box, 
  Text, 
  Stack, 
  Flex,
  Card
} from '@sanity/ui';

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
        toolMenu: (props) => {
          return (
            <>
            <Flex gap={2}>
              <CustomToolMenu {...props} />
              <DeployButton config={config} />
            </Flex>
            </>
          )
        },
      },
    },
  };
});

function CustomToolMenu(props: ToolMenuProps) {
  const user = useCurrentUser()
  const {activeToolName, context, tools} = props
  const isAdmin = user?.roles.some(r => r.name === 'administrator')

  // Filter the tools array before passing it to the default renderer
  const filteredTools = tools.filter((tool) => {
    if (tool.name === 'vision' && !isAdmin) return false
    return true
  })

  const isSidebar = context === 'sidebar'
	// Change flex direction depending on context
	const direction = isSidebar ? 'column' : 'row'
  return (
    <Flex gap={1} direction={direction}>
      {filteredTools.map((tool) => (
        <Button
          as={ToolLink}
          icon={tool.icon || PlugIcon}
          key={tool.name}
          name={tool.name}
          padding={2}
          selected={tool.name === activeToolName}
          text={tool.title || tool.name}
          mode="bleed"
          tone="primary"
        />
      ))}
    </Flex>
  )
}

function DeployButton({ config }: { config: NetlifyDeployConfig }) {
  const [open, setOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const toast = useToast();

  const handleClose = useCallback(() => setOpen(false), []);
  const handleOpen = useCallback(() => setOpen(true), []);

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch(config.buildHookUrl, { method: 'POST' });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      toast.push({
        status: 'success',
        title: 'Despliegue iniciado',
        description: `El sitio ${config.siteName || ''} se está actualizando.`,
      });
      
      setOpen(false);
    } catch (error) {
      toast.push({
        status: 'error',
        title: 'Error de conexión',
        description: 'No se pudo contactar con Netlifyyy.',
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <>
      <Button
        fontSize={1}
        padding={2}
        text="Publicar Sitio"
        icon={PublishIcon}
        tone="positive"
        mode="bleed"
        onClick={handleOpen}
      />

      {open && (
        <Dialog
          header="Confirmar Publicación"
          id="deploy-dialog"
          onClose={handleClose}
          zOffset={1000}
          width={1} // Small width for confirmation
          footer={
            <Box padding={3}>
              <Grid columns={2} gap={2}>
                <Button 
                  mode="ghost" 
                  text="Cancelar" 
                  onClick={handleClose} 
                />
                <Button
                  text={isDeploying ? 'Publicando...' : 'Sí, publicar ahora'}
                  tone="positive"
                  onClick={handleDeploy}
                  loading={isDeploying}
                  disabled={isDeploying}
                />
              </Grid>
            </Box>
          }
        >
          <Box padding={4}>
            <Stack space={4}>
              <Flex align="center" gap={3}>
                <Text size={4} muted><PublishIcon /></Text>
                <Text weight="semibold" size={2}>
                  ¿Estás seguro de actualizar el sitio web por completo?
                </Text>
              </Flex>
              
              <Card padding={3} tone="caution" border radius={2}>
                <Stack space={3}>
                  <Flex gap={2} align="center">
                    <WarningOutlineIcon />
                    <Text size={1} weight="bold">Aviso importante</Text>
                  </Flex>
                  <Text size={1}>
                    • Se regenerará el sitio completo con los cambios actuales.<br/>
                    • El proceso tarda de 2 a 8 minutos.<br/>
                    • No se recomienda ejecutar este proceso de forma recurrente en lapsos de tiempos cortos.
                  </Text>
                </Stack>
              </Card>
              <Text size={1} muted>
                La regeneración del sitio completo implica compilar todo el sitio web con la nueva información y desplegar al hosting toda las páginas web generadas.
              </Text>
              <Text size={1} muted>
                Asegúrate de haber guardado y revisado todos tus documentos antes de proceder.
              </Text>
            </Stack>
          </Box>
        </Dialog>
      )}
    </>
  );
}

// Helper to handle the footer buttons layout
function Grid({ children, columns, gap }: { children: React.ReactNode, columns: number, gap: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: `${gap * 4}px` }}>
      {children}
    </div>
  );
}

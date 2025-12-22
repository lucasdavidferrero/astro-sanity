export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Noticia {
  _id: string;
  titulo: string;
  slug: {
    current: string;
  };
  fechaPublicacion: string;
  portada?: SanityImage;
  // Usamos 'any[]' para el contenido porque Portable Text 
  // es una estructura compleja de bloques, pero lo manejaremos con un renderizador profesional.
  contenido: any[]; 
}
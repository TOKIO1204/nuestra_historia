/**
 * Archivo de datos del álbum de recuerdos.
 *
 * Para agregar un nuevo recuerdo:
 *   1. Pon la foto en /public/fotos/
 *   2. Agrega un nuevo objeto al array con la estructura:
 *      { id, image, date, title, description, accent }
 *
 * El componente Timeline la renderiza automáticamente en orden,
 * alternando foto a la izquierda y derecha.
 */
export const memories = [
  {
    id: 1,
    image: null, // Ej: '/fotos/foto1.jpg'
    date: 'Nuestro primer capítulo',
    title: 'El día que todo empezó',
    description:
      'Nuestro primer capítulo... y sigue siendo mi favorito.',
    accent: '#fed7aa',
  },
  {
    id: 2,
    image: null,
    date: 'Una noche perfecta',
    title: 'Tú, yo y una película',
    description:
      'Tú, yo y una película de fondo. Mi plan perfecto hoy y siempre.',
    accent: '#fde68a',
  },
  {
    id: 3,
    image: null,
    date: 'En el centro de todo',
    title: 'Siempre tú',
    description:
      'En el centro de todo, siempre tú. Qué hermoso día pasamos.',
    accent: '#d4c5e2',
  },
  {
    id: 4,
    image: null,
    date: 'Las mejores noches',
    title: 'La mejor compañía del mundo',
    description:
      'Las mejores noches siempre se resumen en esto: compartir una buena cena, risas y la mejor compañía del mundo.',
    accent: '#b5d5c5',
  },
]


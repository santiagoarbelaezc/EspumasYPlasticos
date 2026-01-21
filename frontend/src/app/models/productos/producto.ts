export interface Producto {
  id: number;
  imagen: string;
  descripcion: string;
  link: string;
  altura: 'alta' | 'baja'; // Para controlar la altura de la imagen
  nombre?: string;        // Nuevo campo opcional
  precio?: number;        // Nuevo campo opcional
}
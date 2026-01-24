import { Injectable } from '@angular/core';

// Interfaz para la categoría (basada en tu estructura de base de datos)
export interface CategoriaDTO {
  id: number;
  nombre: string;
  icono_url: string;
  icono_public_id: string;
  creado_en: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasExampleService {
  
  // Categorías de ejemplo basadas en tus datos
  private categoriasEjemplo: CategoriaDTO[] = [
    {
      id: 1,
      nombre: 'Colchones',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768519454/espumas_plasticos_categorias/1768519453564-ei5nyas.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768519453564-ei5nyas',
      creado_en: '2026-01-15 23:24:14'
    },
    {
      id: 2,
      nombre: 'Alcobas',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768865775/espumas_plasticos_categorias/1768865772189-p7emg3u.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768865772189-p7emg3u',
      creado_en: '2026-01-19 23:36:15'
    },
    {
      id: 3,
      nombre: 'Almohadas',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768865796/espumas_plasticos_categorias/1768865794553-hc1bp6f.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768865794553-hc1bp6f',
      creado_en: '2026-01-19 23:36:37'
    },
    {
      id: 5,
      nombre: 'Baby',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768865998/espumas_plasticos_categorias/1768865997765-cvz67gx.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768865997765-cvz67gx',
      creado_en: '2026-01-19 23:39:59'
    },
    {
      id: 6,
      nombre: 'Cojinería',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768866023/espumas_plasticos_categorias/1768866020225-4wgsodg.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768866020225-4wgsodg',
      creado_en: '2026-01-19 23:40:24'
    },
    {
      id: 7,
      nombre: 'Sabanas',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768866038/espumas_plasticos_categorias/1768866036453-aybp8je.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768866036453-aybp8je',
      creado_en: '2026-01-19 23:40:39'
    },
    {
      id: 8,
      nombre: 'Colchonetas',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768869503/espumas_plasticos_categorias/1768869502101-huz0eos.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768869502101-huz0eos',
      creado_en: '2026-01-20 00:38:24'
    },
    {
      id: 9,
      nombre: 'Protectores',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768870105/espumas_plasticos_categorias/1768870104095-oski8wx.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768870104095-oski8wx',
      creado_en: '2026-01-20 00:48:26'
    },
    {
      id: 10,
      nombre: 'Camas',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768937227/espumas_plasticos_categorias/1768937222362-yhgmx8d.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768937222362-yhgmx8d',
      creado_en: '2026-01-20 19:27:06'
    },
    {
      id: 11,
      nombre: 'Combos',
      icono_url: 'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768944014/espumas_plasticos_categorias/1768944010257-r2mdzhi.jpg',
      icono_public_id: 'espumas_plasticos_categorias/1768944010257-r2mdzhi',
      creado_en: '2026-01-20 21:20:15'
    }
  ];

  constructor() { }

  /**
   * Obtiene todas las categorías
   */
  getCategorias(): CategoriaDTO[] {
    return this.categoriasEjemplo;
  }

  /**
   * Obtiene una categoría específica por ID
   */
  getCategoriaPorId(id: number): CategoriaDTO | undefined {
    return this.categoriasEjemplo.find(c => c.id === id);
  }

  /**
   * Obtiene una categoría específica por nombre
   */
  getCategoriaPorNombre(nombre: string): CategoriaDTO | undefined {
    return this.categoriasEjemplo.find(c => 
      c.nombre.toLowerCase() === nombre.toLowerCase()
    );
  }

  /**
   * Busca categorías por término de búsqueda
   */
  buscarCategorias(termino: string): CategoriaDTO[] {
    return this.categoriasEjemplo.filter(c =>
      c.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  }

  /**
   * Obtiene las categorías ordenadas por fecha de creación (más recientes primero)
   */
  getCategoriasRecientes(): CategoriaDTO[] {
    return [...this.categoriasEjemplo].sort((a, b) => 
      new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime()
    );
  }

  /**
   * Obtiene las categorías ordenadas por nombre alfabéticamente
   */
  getCategoriasAlfabeticamente(): CategoriaDTO[] {
    return [...this.categoriasEjemplo].sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );
  }

  /**
   * Obtiene el total de categorías disponibles
   */
  getTotalCategorias(): number {
    return this.categoriasEjemplo.length;
  }

  /**
   * Obtiene un subconjunto de categorías (para paginación)
   */
  getCategoriasPagina(pagina: number, elementosPorPagina: number): CategoriaDTO[] {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return this.categoriasEjemplo.slice(inicio, fin);
  }
}
import { Injectable } from '@angular/core';

// Interfaz para subcategorías
export interface SubcategoriaDTO {
  id: number;
  nombre: string;
  categoria_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubcategoriasExampleService {
  
  // Subcategorías de ejemplo basadas en tus datos
  private subcategoriasEjemplo: SubcategoriaDTO[] = [
    {
      id: 17,
      nombre: 'Aloe Vera',
      categoria_id: 3
    },
    {
      id: 5,
      nombre: 'Camping',
      categoria_id: 8
    },
    {
      id: 18,
      nombre: 'Casatas',
      categoria_id: 10
    },
    {
      id: 20,
      nombre: 'Clásico',
      categoria_id: 1
    },
    {
      id: 21,
      nombre: 'Cojines',
      categoria_id: 6
    },
    {
      id: 22,
      nombre: 'Combo',
      categoria_id: 11
    },
    {
      id: 2,
      nombre: 'Confort',
      categoria_id: 1
    },
    {
      id: 15,
      nombre: 'Cuna',
      categoria_id: 5
    },
    {
      id: 8,
      nombre: 'Exteriores',
      categoria_id: 6
    },
    {
      id: 13,
      nombre: 'Género y Microfibra',
      categoria_id: 7
    },
    {
      id: 6,
      nombre: 'Gimnasio',
      categoria_id: 8
    },
    {
      id: 12,
      nombre: 'Hotelero',
      categoria_id: 1
    },
    {
      id: 7,
      nombre: 'Impermeable',
      categoria_id: 9
    },
    {
      id: 16,
      nombre: 'Multifuncional',
      categoria_id: 8
    },
    {
      id: 11,
      nombre: 'Ortopédica Cervical',
      categoria_id: 3
    },
    {
      id: 19,
      nombre: 'Ortopedicas y Hoteleras',
      categoria_id: 3
    },
    {
      id: 1,
      nombre: 'Ortopedico',
      categoria_id: 1
    },
    {
      id: 10,
      nombre: 'Pino',
      categoria_id: 2
    },
    {
      id: 4,
      nombre: 'Plegable',
      categoria_id: 1
    },
    {
      id: 3,
      nombre: 'Semi Ortopedico',
      categoria_id: 1
    },
    {
      id: 9,
      nombre: 'Silla Columpio',
      categoria_id: 6
    },
    {
      id: 14,
      nombre: 'Verona',
      categoria_id: 1
    }
  ];

  constructor() { }

  /**
   * Obtiene todas las subcategorías
   */
  getSubcategorias(): SubcategoriaDTO[] {
    return this.subcategoriasEjemplo;
  }

  /**
   * Obtiene una subcategoría específica por ID
   */
  getSubcategoriaPorId(id: number): SubcategoriaDTO | undefined {
    return this.subcategoriasEjemplo.find(s => s.id === id);
  }

  /**
   * Obtiene subcategorías por nombre
   */
  getSubcategoriaPorNombre(nombre: string): SubcategoriaDTO | undefined {
    return this.subcategoriasEjemplo.find(s => 
      s.nombre.toLowerCase() === nombre.toLowerCase()
    );
  }

  /**
   * Obtiene todas las subcategorías de una categoría específica
   */
  getSubcategoriasPorCategoria(categoriaId: number): SubcategoriaDTO[] {
    return this.subcategoriasEjemplo.filter(s => s.categoria_id === categoriaId);
  }

  /**
   * Obtiene subcategorías por múltiples categorías
   */
  getSubcategoriasPorCategorias(categoriaIds: number[]): SubcategoriaDTO[] {
    return this.subcategoriasEjemplo.filter(s => 
      categoriaIds.includes(s.categoria_id)
    );
  }

  /**
   * Busca subcategorías por término de búsqueda
   */
  buscarSubcategorias(termino: string): SubcategoriaDTO[] {
    return this.subcategoriasEjemplo.filter(s =>
      s.nombre.toLowerCase().includes(termino.toLowerCase())
    );
  }

  /**
   * Obtiene subcategorías ordenadas por nombre alfabéticamente
   */
  getSubcategoriasAlfabeticamente(): SubcategoriaDTO[] {
    return [...this.subcategoriasEjemplo].sort((a, b) => 
      a.nombre.localeCompare(b.nombre)
    );
  }

  /**
   * Obtiene subcategorías agrupadas por categoría
   */
  getSubcategoriasAgrupadasPorCategoria(): Map<number, SubcategoriaDTO[]> {
    const agrupadas = new Map<number, SubcategoriaDTO[]>();
    
    this.subcategoriasEjemplo.forEach(subcategoria => {
      if (!agrupadas.has(subcategoria.categoria_id)) {
        agrupadas.set(subcategoria.categoria_id, []);
      }
      agrupadas.get(subcategoria.categoria_id)!.push(subcategoria);
    });
    
    return agrupadas;
  }

  /**
   * Obtiene el total de subcategorías disponibles
   */
  getTotalSubcategorias(): number {
    return this.subcategoriasEjemplo.length;
  }

  /**
   * Obtiene el total de subcategorías por categoría
   */
  getTotalSubcategoriasPorCategoria(categoriaId: number): number {
    return this.subcategoriasEjemplo.filter(s => s.categoria_id === categoriaId).length;
  }

  /**
   * Obtiene las categorías únicas a las que pertenecen las subcategorías
   */
  getCategoriasUnicas(): number[] {
    const categoriasUnicas = new Set<number>();
    this.subcategoriasEjemplo.forEach(s => categoriasUnicas.add(s.categoria_id));
    return Array.from(categoriasUnicas);
  }

  /**
   * Obtiene un subconjunto de subcategorías (para paginación)
   */
  getSubcategoriasPagina(pagina: number, elementosPorPagina: number): SubcategoriaDTO[] {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return this.subcategoriasEjemplo.slice(inicio, fin);
  }

  /**
   * Obtiene subcategorías paginadas por categoría
   */
  getSubcategoriasPorCategoriaPagina(
    categoriaId: number, 
    pagina: number, 
    elementosPorPagina: number
  ): SubcategoriaDTO[] {
    const subcategoriasFiltradas = this.getSubcategoriasPorCategoria(categoriaId);
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return subcategoriasFiltradas.slice(inicio, fin);
  }
}
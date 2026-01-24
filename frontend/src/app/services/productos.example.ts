import { Injectable } from '@angular/core';
import { ProductoDTO } from '../models/productos/producto.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductosExampleService {
  
  // Productos basados en tus datos reales de la base de datos
  private productosEjemplo: ProductoDTO[] = [
    {
      id: 3,
      nombre: 'Colchon Semi Ortopedico Duplex',
      descripcion: `Especificaciones

Espuma cassata D-100.

Espuma naranja D-30.

Forro tela acolchada de punto con cremallera.

Garantía: 8 años - estructura interna. -

Respiradores.

Medidas: 1.00 - 1.20 - 1.40`,
      cantidad: 10,
      precio: 600000,
      subcategoria_id: 3,
      subcategoria: 'Semi Ortopedico',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768877828/espumas_plasticos_productos/1768877827999-btdbgjl.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768877828/espumas_plasticos_productos/1768877828048-zytogep.jpg'
      ]
    },
    {
      id: 4,
      nombre: 'Colchon Confortable Tentaflex',
      descripcion: `Colchón confortable tentaflex

Especificaciones

Espuma naranja D-23

Forro de tela acolchada de punto con cremallera.

Garantía: 2 años - estructura interna.

Respiradores.

Peso a soportar: 65 kg - 75 kg

Medidas: 090 - 1.00 - 1.20 - 1.40`,
      cantidad: 8,
      precio: 720000,
      subcategoria_id: 2,
      subcategoria: 'Confort',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878430/espumas_plasticos_productos/1768878429681-eude23r.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878430/espumas_plasticos_productos/1768878429688-zo34o56.jpg'
      ]
    },
    {
      id: 5,
      nombre: 'Colchon Confortable Soberano',
      descripcion: `Colchón confortable soberano

Colchón confortable soberano

Especificaciones:

Medidas: 100 x 190 x 16 cm - 120 x 190 x 16 cm
140 x 190 x 16 cm

Espuma rosada densidad 20.

Forro en tela acolchada de punto.

16 cm de espesor.

Peso soportado: 65 - 70 kg por persona

Color del forro: De acuerdo a disponibilidad en stock`,
      cantidad: 10,
      precio: 680000,
      subcategoria_id: 2,
      subcategoria: 'Confort',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878594/espumas_plasticos_productos/1768878593681-6991eea.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878593/espumas_plasticos_productos/1768878593687-8wx2okl.jpg'
      ]
    },
    {
      id: 6,
      nombre: 'Colchoneta Multifuncional',
      descripcion: `Colchoneta multifuncional

100 x 70 x 8

$65.000

Colchoneta multifuncional para cuna o mascota, se realiza en diferentes medidas, tela antifluido estampada, cremallera para fácil lavado`,
      cantidad: 8,
      precio: 690000,
      subcategoria_id: 16,
      subcategoria: 'Multifuncional',
      categoria: 'Colchonetas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878824/espumas_plasticos_productos/1768878824182-ucltnau.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878824/espumas_plasticos_productos/1768878824189-h5wzc8x.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768878824/espumas_plasticos_productos/1768878824196-9fa1iq9.jpg'
      ]
    },
    {
      id: 7,
      nombre: 'Almohada Aloe Vera',
      descripcion: `Almohada aloe vera

$20.000

Marca: aloe vera

Modelo: tradicional

Medidas: 50 cm de ancho x 75 cm de largo

Materiales: algodón siliconado, forro con cremallera para fácil lavado`,
      cantidad: 13,
      precio: 20000,
      subcategoria_id: 17,
      subcategoria: 'Aloe Vera',
      categoria: 'Almohadas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768879025/espumas_plasticos_productos/1768879025558-4akrkvy.jpg'
      ]
    },
    {
      id: 8,
      nombre: 'Colchoneta Camping',
      descripcion: `Colchoneta de camping

45.000 $

Colchoneta de camping 60 x 180 x 5 cm`,
      cantidad: 9,
      precio: 45000,
      subcategoria_id: 5,
      subcategoria: 'Camping',
      categoria: 'Colchonetas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768879235/espumas_plasticos_productos/1768879235353-9e2oeaz.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768879235/espumas_plasticos_productos/1768879235358-fapatdb.jpg'
      ]
    },
    {
      id: 9,
      nombre: 'Colchon para Cuna',
      descripcion: `Elaborado en
- espuma naranja de 8cm
- penta espuma (suavizante)
- tela jacquard`,
      cantidad: 9,
      precio: 190000,
      subcategoria_id: 15,
      subcategoria: 'Cuna',
      categoria: 'Baby',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768937082/espumas_plasticos_productos/1768937078250-ww76pqo.jpg'
      ]
    },
    {
      id: 10,
      nombre: 'Casata Forro en Tela Acolchada con Cremallera',
      descripcion: `Casata Forro en Tela Acolchada con Cremallera
- Bandas de Resorte para Sujestion
- Medida: 140 x 190 x 10`,
      cantidad: 9,
      precio: 75000,
      subcategoria_id: 18,
      subcategoria: 'Casatas',
      categoria: 'Camas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768937436/espumas_plasticos_productos/1768937431507-gcg4rur.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768937436/espumas_plasticos_productos/1768937431513-1scsuku.jpg'
      ]
    },
    {
      id: 11,
      nombre: 'Colchon Confort Verona',
      descripcion: `Espumasyplasticos Poliflex es la mejor opción si buscas la espuma flexible más eficiente para tus colchones. Con una densidad D-30 en su núcleo y lámina Penta gris D-26, y un sistema de acolchado es el más avanzado y cómodo del mercado. ¿Deseas disfrutar de una experiencia relajante? ¡Nuestro colchón VERONA te lo garantiza!

?

100

Tela jacquard de alto gramaje, tejido de punto Manijas de sujeción en los laterales del colchón.

Núcleo de espuma Poliflex D-30 de 23 cm de espesor. Almohada independiente en espuma penta D-26 en una sola cara.

MEDIDAS

100 x 190 x 30 cm
120 x 190 x 30 cm
140 x 190 x 30 cm
160 x 190 x 30 cm
200 x 200 x 30 cm`,
      cantidad: 9,
      precio: 990000,
      subcategoria_id: 2,
      subcategoria: 'Confort',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768938896/espumas_plasticos_productos/1768938891588-pyr2ax5.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768938896/espumas_plasticos_productos/1768938891594-toqevn1.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768938896/espumas_plasticos_productos/1768938891601-79cywmw.jpg'
      ]
    },
    {
      id: 12,
      nombre: 'Colchon Ortopedico Pillow Top - Celco',
      descripcion: `Si estás buscando un colchón de alta calidad, el colchón ortopédico doble pillow es la opción perfecta para ti. Este colchón ofrece una combinación única de suavidad y firmeza gracias a sus láminas de espuma viscoelástica ubicadas en ambas caras. Ademá+---
s, su estructura interna está compuesta de espuma viscoelástica de alta densidad, lo que garantiza una excelente calidad.

Por último, es importante destacar que este colchón cuenta con la certificación de calidad Norma Icontec. 100

CARACTERÍSTICAS:

Tela jacquard de alto gramaje,
Tejido de punto - cámaras de aire para transpiración ideales del colchón.
Espuma viscoelástica D-120 de 18 cm de espesor.
Almohadas de espuma viscoelástica de 5 cm de espesor.
Altura de 30 cm
Nivel de firmeza
8 sobre 10

MEDIDAS
100 x 190 x 30 cm
120 x 190 x 30 cm
140 x 190 x 30 cm
160 x 190 x 30 cm
200 x 200 x 30 cm`,
      cantidad: 8,
      precio: 890000,
      subcategoria_id: 1,
      subcategoria: 'Ortopedico',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939217/espumas_plasticos_productos/1768939213312-9wgul8d.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939218/espumas_plasticos_productos/1768939213323-5jhuvg6.png'
      ]
    },
    {
      id: 13,
      nombre: 'Almohada Ortopedica Cervical',
      descripcion: `espumasyplasticos ¿Experimentas molestias cervicales y en los hombros al despertar cada mañana?

Nuestra innovadora almohada ortopédica cervical con tecnología de espuma viscoelástica y gel con un diseño exclusivo y ergonómico se ajusta perfectamente a la anatomía de tu cuello, proporcionándote el apoyo y la comodidad necesarios para disfrutar de un sueño reparador y un despertar revitalizado.

Su funda de tela Jacquard de alta calidad y la cremallera facilitan su mantenimiento y limpieza`,
      cantidad: 8,
      precio: 50000,
      subcategoria_id: 11,
      subcategoria: 'Ortopédica Cervical',
      categoria: 'Almohadas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939373/espumas_plasticos_productos/1768939369101-0m5t9u5.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939373/espumas_plasticos_productos/1768939369108-03ce46k.jpg'
      ]
    },
    {
      id: 14,
      nombre: 'Cojineria para Silla Columpio',
      descripcion: `Cojineria para Silla Columpio

Cojines de alta calidad, que se adaptan a la silla perfectamente`,
      cantidad: 9,
      precio: 150000,
      subcategoria_id: 9,
      subcategoria: 'Silla Columpio',
      categoria: 'Cojinería',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939575/espumas_plasticos_productos/1768939570439-lkdxsg8.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939575/espumas_plasticos_productos/1768939570444-781u225.jpg'
      ]
    },
    {
      id: 15,
      nombre: 'Almohada Ortopedica y Hoteleras',
      descripcion: `Descubre el secreto de un descanso perfecto con nuestras almohadas diseñadas para ortopédicas y hoteleras brindar el soporte y la comodidad que tu cuerpo necesita.`,
      cantidad: 13,
      precio: 30000,
      subcategoria_id: 19,
      subcategoria: 'Ortopedicas y Hoteleras',
      categoria: 'Almohadas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768939798/espumas_plasticos_productos/1768939794016-ahvdbjt.jpg'
      ]
    },
    {
      id: 16,
      nombre: 'Colchon Ortopedico Premium',
      descripcion: `El colchón ortopédico PREMIUM está hecho de espuma cassata de alta densidad y cuenta con espumas suavizantes en ambos lados para asegurar tu comodidad. Además, su forro en tela Jacquard le da un toque de elegancia y durabilidad.

Pero lo mejor de todo es que nuestro colchón viene con una garantía de 4 años sobre su estructura interna, lo que te asegura que estás haciendo una inversión duradera en tu descanso.

No lo pienses más y consigue hoy mismo nuestro colchón de alta densidad para asegurarte una noche de sueño reparador y confortable`,
      cantidad: 12,
      precio: 790000,
      subcategoria_id: 1,
      subcategoria: 'Ortopedico',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941522/espumas_plasticos_productos/1768941518199-j0kkuuh.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941522/espumas_plasticos_productos/1768941518205-udtwwf5.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941522/espumas_plasticos_productos/1768941518211-laiel5o.jpg'
      ]
    },
    {
      id: 17,
      nombre: 'Colchon Clasico',
      descripcion: `espumasyplasticos ¿Duerme como en un hotel de cinco estrellas con nuestro nuevo colchón hotelero en primavera!

Con un forro de tela de punto acolchado y suave al tacto, podrás disfrutar de un descanso placentero.

La unidad resortada en Bonell en acero garantiza la durabilidad y el soporte que necesitas para un sueño reparador.

Además, la fibra de celdas abiertas proporciona mayor comodidad y una sensación de suavidad. Y para tu tranquilidad, cuenta con aislante en ambas caras del colchón para evitar la transferencia de movimiento.

¡Descansa como te mereces!

No esperes más para disfrutar de este increíble colchón hotelero`,
      cantidad: 10,
      precio: 600000,
      subcategoria_id: 20,
      subcategoria: 'Clasico',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941873/espumas_plasticos_productos/1768941868319-9rtlh56.jpg'
      ]
    },
    {
      id: 18,
      nombre: 'Almohada Ortopedica Cervical en Espuma Memory Foam',
      descripcion: `¿Sufres de dolor de cuello y hombros al despertar cada mañana?

¡No te preocupes más!

Nuestra almohada ortopédica cervical de espuma viscoelástica es la solución que estabas buscando.

Su diseño único y ergonómico se adapta perfectamente a la forma de tu cuello, brindándote el soporte y la comodidad que necesitas para dormir profundamente y despertar sintiéndote renovado.

Además, su forro de tela Jacquard de alta calidad y su cremallera hacen que sea fácil de limpiar y mantener.

¿Qué esperas para probarla?

¡Tu cuerpo te lo agradecerá!`,
      cantidad: 10,
      precio: 60000,
      subcategoria_id: 11,
      subcategoria: 'Ortopédica Cervical',
      categoria: 'Almohadas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941959/espumas_plasticos_productos/1768941955425-604f3uq.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941960/espumas_plasticos_productos/1768941955431-5beems8.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768941960/espumas_plasticos_productos/1768941955437-pr31ou7.jpg'
      ]
    },
    {
      id: 19,
      nombre: 'Colchon Ortopedico Romance Relax',
      descripcion: `Descubre la marca Romance Relax y su colchón ortopédico de ensueño**

Este tesoro de firmeza y comodidad nunca pasará de moda gracias a su estructura interna de espuma casata y láminas suavizantes en ambas caras de espuma de alta densidad. ¿Y lo mejor? Su forro en tela Jacquard brinda una sensación de frescura y suavidad`,
      cantidad: 9,
      precio: 500000,
      subcategoria_id: 1,
      subcategoria: 'Ortopedico',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768942143/espumas_plasticos_productos/1768942138749-27hz4nn.jpg'
      ]
    },
    {
      id: 20,
      nombre: 'Colchon Premium Doble Pillow Plegable',
      descripcion: `Experimente la perfecta armonía entre comodidad y soporte con nuestro colchón. Con tela acolchada Jacquard, láminas de espuma de varias densidades y una elegante cinta de ganchillo de 40 mm, este colchón ofrece un descanso de lujo. Sumérjase en la comodidad excepcional de este colchón bien equilibrado.

SUPERIOR

Forro de tela acolchada Jacquard 180 gramos

Lámina de espuma de penta densidad 23 y 5 cm de grosor

Lámina de espuma de cassata densidad 90 y 12 cm de grosor

30 cm de grosor

Nivel de firmeza 8/10

7 años de garantía sobre la estructura interna`,
      cantidad: 9,
      precio: 600000,
      subcategoria_id: 4,
      subcategoria: 'Plegable',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768942439/espumas_plasticos_productos/1768942435248-1gfm6m0.jpg'
      ]
    },
    {
      id: 21,
      nombre: 'Colchon Semi Ortopedico Van Gogh Anatomico',
      descripcion: `espumasyplasticos Este colchón está fabricado con espuma flexible de poliuretano Bioflex y una lámina de espuma de poliuretano de alta densidad, lo que lo convierte en una superficie firme y cómoda. Es especialmente adecuado para personas con problemas de columna que buscan una superficie dura que les permita descansar cómodamente. La banda y el hiladillo de colores variados realzan la presentación del colchón. PARTE SUPERIOR

Tela acolchada tejida en punto, manijas de sujeción en los laterales del colchón.

Espuma Poliflex 5 cm de espesor D-30 ambas caras - espuma de poliuretano D-100 de 20 cm de espesor.

Altura de 20 cm.

Nivel de firmeza 8/10.

MEDIDAS

100 x 190 x 30 cm
120 x 190 x 30 cm
140 x 190 x 30 cm
160 x 190 x 30 cm
200 x 200 x 30 cm`,
      cantidad: 8,
      precio: 600000,
      subcategoria_id: 3,
      subcategoria: 'Semi Ortopedico',
      categoria: 'Colchones',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768942792/espumas_plasticos_productos/1768942787870-37vz7mu.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768942792/espumas_plasticos_productos/1768942787875-yhjarr7.jpg'
      ]
    },
    {
      id: 22,
      nombre: 'Cojin TV Triangular',
      descripcion: `Con nuestro cojín triangular para TV, podrás disfrutar cómodamente en tu sofá o cama sin dejar rastro.

Su forro de tela acolchada proporciona suavidad al tacto y es fácil de limpiar con su práctica cremallera.

Este cojín está confeccionado con espuma de alta densidad, asegurando durabilidad y resistencia.

Y lo más emocionante es que lo ofrecemos en una variedad de colores para que encuentres el perfecto para tu estilo y decoración.

¿Sabías quiénes somos fabricantes? Esto nos permite ofrecer precios altamente competitivos para que puedas compartir la felicidad de nuestros cojines con más personas.`,
      cantidad: 10,
      precio: 70000,
      subcategoria_id: 21,
      subcategoria: 'Cojines',
      categoria: 'Cojinería',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943188/espumas_plasticos_productos/1768943183746-qlxepda.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943188/espumas_plasticos_productos/1768943183752-50szde6.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943188/espumas_plasticos_productos/1768943183758-rbrb9do.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943188/espumas_plasticos_productos/1768943183763-xyfjvjy.jpg'
      ]
    },
    {
      id: 23,
      nombre: 'Protector Acolchado Impermeable',
      descripcion: `Descubra la innovación en protección para su colchón con nuestro Protector 100% impermeable de calidad confeccionado con tela resistente y bandas elásticas, asegurando una barrera impenetrable contra líquidos

Este producto de alta

Disponible en todas las medidas, desde 1.00 hasta 2.00 metros de ancho, es la opción ideal para preservar la vida útil de su colchón. No espere más, asegure la durabilidad y la higiene de su colchón hoy mismo.`,
      cantidad: 9,
      precio: 100000,
      subcategoria_id: 7,
      subcategoria: 'Impermeable',
      categoria: 'Protectores',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943713/espumas_plasticos_productos/1768943708847-t848wp8.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943713/espumas_plasticos_productos/1768943708852-6yz3o3c.jpg'
      ]
    },
    {
      id: 24,
      nombre: 'Sabanas en Género',
      descripcion: `¡Dale a tu cama el toque de suavidad y frescura que se merece con nuestro Juego de Sábanas para cama!

Nuestras sábanas generan suavidad y comodidad a la hora del descanso Z

Contenido del Juego de Sábanas:

Sábana

Sobre sabana

Dos fundas de almohada de 50 x 75 cm`,
      cantidad: 10,
      precio: 60000,
      subcategoria_id: 13,
      subcategoria: 'Género y Microfibra',
      categoria: 'Sabanas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943869/espumas_plasticos_productos/1768943865167-ccandef.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943869/espumas_plasticos_productos/1768943865172-drn13hb.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943869/espumas_plasticos_productos/1768943865177-ajv7k5v.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943870/espumas_plasticos_productos/1768943865183-qlyqei9.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768943869/espumas_plasticos_productos/1768943865189-q3q0hby.jpg'
      ]
    },
    {
      id: 25,
      nombre: 'Combo Colchon + Base Cama + Almohadas + Sabana + Protector',
      descripcion: `COMBO COLCHÓN + BASECAMA

Nuestra promoción incluye un colchón de tres medidas: 1.00 - 1.20 y 1.40 con base cama de tres medidas ? proporcionándote todo lo necesario para un descanso completo y reparador. Además de las dos almohadas, recibirás un protector acolchado impermeable que mantendrá tu colchón en óptimas condiciones por mucho más tiempo y un juego de sábanas.

Este combo es la opción ideal para aquellos que buscan calidad y comodidad`,
      cantidad: 10,
      precio: 900000,
      subcategoria_id: 22,
      subcategoria: 'Combo',
      categoria: 'Combos',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768944100/espumas_plasticos_productos/1768944096221-q586khx.jpg'
      ]
    },
    {
      id: 26,
      nombre: 'Colchoneta Gym',
      descripcion: `Colchonetas de espuma y plástico para ejercicio o gimnasio

Espuma casata de 3 cm 50 x 100

Forro antifluido en cuerotex

Ideal para hacer ejercicio en casa`,
      cantidad: 20,
      precio: 80000,
      subcategoria_id: 6,
      subcategoria: 'Gimnasio',
      categoria: 'Colchonetas',
      imagenes: [
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768954321/espumas_plasticos_productos/1768954315777-6y0xq5g.jpg',
        'https://res.cloudinary.com/dsv1gdgya/image/upload/v1768954321/espumas_plasticos_productos/1768954315786-msbuqce.jpg'
      ]
    }
  ];

  constructor() { }

  /**
   * Obtiene todos los productos de ejemplo
   */
  getProductosEjemplo(): ProductoDTO[] {
    return this.productosEjemplo;
  }

  /**
   * Obtiene un producto específico por ID
   */
  getProductoPorId(id: number): ProductoDTO | undefined {
    return this.productosEjemplo.find(p => p.id === id);
  }

  /**
   * Obtiene productos de una categoría específica
   */
  getProductosPorCategoria(categoriaNombre: string): ProductoDTO[] {
    return this.productosEjemplo.filter(p => 
      p.categoria?.toLowerCase() === categoriaNombre.toLowerCase()
    );
  }

  /**
   * Obtiene productos de una subcategoría específica
   */
  getProductosPorSubcategoria(subcategoriaId: number): ProductoDTO[] {
    return this.productosEjemplo.filter(p => p.subcategoria_id === subcategoriaId);
  }

  /**
   * Obtiene productos por ID de subcategoría
   */
  getProductosPorSubcategoriaId(subcategoriaId: number): ProductoDTO[] {
    return this.productosEjemplo.filter(p => p.subcategoria_id === subcategoriaId);
  }

  /**
   * Busca productos por término de búsqueda
   */
  buscarProductos(termino: string): ProductoDTO[] {
    const terminoLower = termino.toLowerCase();
    return this.productosEjemplo.filter(p =>
      p.nombre.toLowerCase().includes(terminoLower) ||
      p.descripcion.toLowerCase().includes(terminoLower) ||
      p.categoria?.toLowerCase().includes(terminoLower) ||
      p.subcategoria?.toLowerCase().includes(terminoLower)
    );
  }

  /**
   * Obtiene productos con stock disponible
   */
  getProductosConStock(): ProductoDTO[] {
    return this.productosEjemplo.filter(p => p.cantidad > 0);
  }

  /**
   * Obtiene productos en oferta (precio menor a 500,000)
   */
  getProductosEnOferta(): ProductoDTO[] {
    return this.productosEjemplo.filter(p => p.precio < 500000);
  }

  /**
   * Obtiene productos ordenados por precio (ascendente)
   */
  getProductosPorPrecioAsc(): ProductoDTO[] {
    return [...this.productosEjemplo].sort((a, b) => a.precio - b.precio);
  }

  /**
   * Obtiene productos ordenados por precio (descendente)
   */
  getProductosPorPrecioDesc(): ProductoDTO[] {
    return [...this.productosEjemplo].sort((a, b) => b.precio - a.precio);
  }

  /**
   * Obtiene productos destacados (con más de 2 imágenes)
   */
  getProductosDestacados(): ProductoDTO[] {
    return this.productosEjemplo.filter(p => p.imagenes && p.imagenes.length > 2);
  }

  /**
   * Obtiene productos relacionados (misma categoría)
   */
  getProductosRelacionados(productoId: number, limite: number = 4): ProductoDTO[] {
    const producto = this.getProductoPorId(productoId);
    if (!producto) return [];
    
    return this.productosEjemplo
      .filter(p => 
        p.id !== productoId && 
        p.categoria === producto.categoria
      )
      .slice(0, limite);
  }

  /**
   * Obtiene productos paginados
   */
  getProductosPaginados(pagina: number, elementosPorPagina: number): ProductoDTO[] {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    return this.productosEjemplo.slice(inicio, fin);
  }

  /**
   * Obtiene el total de productos
   */
  getTotalProductos(): number {
    return this.productosEjemplo.length;
  }

  /**
   * Obtiene las categorías únicas de los productos
   */
  getCategoriasUnicas(): string[] {
    const categorias = new Set(this.productosEjemplo.map(p => p.categoria).filter(c => c !== undefined));
    return Array.from(categorias) as string[];
  }

  /**
   * Obtiene las subcategorías únicas por categoría
   */
  getSubcategoriasPorCategoria(categoriaNombre: string): string[] {
    const subcategorias = new Set(
      this.productosEjemplo
        .filter(p => p.categoria === categoriaNombre)
        .map(p => p.subcategoria)
        .filter(s => s !== undefined)
    );
    return Array.from(subcategorias) as string[];
  }
}
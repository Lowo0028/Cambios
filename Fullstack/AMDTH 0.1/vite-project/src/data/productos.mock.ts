interface ProductProps {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  imagen: string;
  
}

export const products: ProductProps[] = [
  {
    id: 1,
    nombre: "Alimento Premium para Perro",
    categoria: "Alimento",
    descripcion: "Bolsa de 10kg con ingredientes naturales y alto valor proteico.",
    precio: 28990,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_2X_816237-MLA96122145657_102025-F.webp",
   
  },
  {
    id: 2,
    nombre: "Rascador para Gato",
    categoria: "Accesorios",
    descripcion: "Rascador de sisal con base de madera, ideal para afilar uñas.",
    precio: 15990,
    imagen: "https://felinus.cl/12913-large_default/pilar-rascador-para-gatitos-cebra.jpg",
    
  },
  {
    id: 3,
    nombre: "Juguete de Cuerda",
    categoria: "Juguetes",
    descripcion: "Perfecto para juegos con el gato.",
    precio: 5990,
    imagen: "https://http2.mlstatic.com/D_NQ_NP_881857-CBT84612738130_052025-O-para-gatos-juguete-de-cuerda-para-gatos-divertido-juguete-de.webp",
    
  },
  {
    id: 4,
    nombre: "Cama Acolchada para Mascota",
    categoria: "Descanso",
    descripcion: "Cama de felpa lavable, ideal para perros y gatos medianos.",
    precio: 19990,
    imagen: "https://m.media-amazon.com/images/I/71N8j09LwOL._AC_UF1000,1000_QL80_.jpg",
    
  },
  {
    id: 5,
    nombre: "Comedero Doble Antideslizante",
    categoria: "Accesorios",
    descripcion: "Dos compartimientos con base de silicona antideslizante.",
    precio: 9990,
    imagen: "https://rimage.ripley.cl/home.ripley/Attachment/MKP/6092/MPM00078267048/imagen2-1.png",
    
  },
  {
    id: 6,
    nombre: "Collar Reflectante",
    categoria: "Seguridad",
    descripcion: "Collar ajustable con tira reflectante para paseos nocturnos.",
    precio: 4990,
    imagen: "https://i5.walmartimages.com/asr/a9d05295-76e9-4758-a151-e36459fa05bc.b5de571c941aa3fc8864f7df94446430.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
    
  },
  {
    id: 7,
    nombre: "Transportadora Mediana",
    categoria: "Transporte",
    descripcion: "Plástico resistente con ventilación y puerta metálica.",
    precio: 25990,
    imagen: "https://pobreguacho.cl/wp-content/uploads/2019/10/111-MEDIDA.jpg",
    
  },
  {
    id: 8,
    nombre: "Snacks Naturales",
    categoria: "Alimento",
    descripcion: "Bolsita de 100g de snacks de pollo deshidratado, sin aditivos.",
    precio: 4990,
    imagen: "https://petvet.cl/cdn/shop/files/cats-snack-hierba-gatera-salmon-y-pollo-80g-688451.jpg?v=1717247293",
    
  },
  {
    id: 9,
    nombre: "Champú Hipoalergénico",
    categoria: "Higiene",
    descripcion: "Libre de parabenos, apto para pieles sensibles.",
    precio: 6990,
    imagen: "https://felinus.cl/10934-large_default/traper-shampoo-neutro-para-gatos.jpg",
    
  },
  {
    id: 10,
    nombre: "Correa Extensible",
    categoria: "Accesorios",
    descripcion: "De 5 metros, ideal para paseos seguros y cómodos.",
    precio: 12990,
    imagen: "https://images-na.ssl-images-amazon.com/images/I/51zPbFA946L._AC_SL1001_.jpg",
    
  }
];

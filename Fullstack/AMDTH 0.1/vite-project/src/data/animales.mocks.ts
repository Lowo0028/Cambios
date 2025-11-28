interface AnimalProps {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: string;
  descripcion: string;
  imagen: string;
  estado: "Disponible" | "Adoptado";
}

export const animals: AnimalProps[] = [
  {
    id: 1,
    nombre: "Luna",
    especie: "Perro",
    raza: "Labrador Retriever",
    edad: "2 años",
    descripcion: "Amigable, cariñosa y le encanta jugar con niños.",
    imagen: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
    estado: "Disponible"
  },
  {
    id: 2,
    nombre: "Milo",
    especie: "Gato",
    raza: "Siames",
    edad: "1 año",
    descripcion: "Curioso y tranquilo, ideal para departamentos.",
    imagen: "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    estado: "Disponible"
  },
  {
    id: 3,
    nombre: "Rocky",
    especie: "Perro",
    raza: "Bulldog Francés",
    edad: "3 años",
    descripcion: "Sociable y divertido, se lleva bien con otros animales.",
    imagen: "https://images.unsplash.com/photo-1561754050-9a1ee0470c73?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
    estado: "Adoptado"
  },
  {
    id: 4,
    nombre: "Coco",
    especie: "Gato",
    raza: "Persa",
    edad: "4 años",
    descripcion: "Tranquilo y elegante, adora las siestas largas.",
    imagen: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6",
    estado: "Disponible"
  },
  {
    id: 5,
    nombre: "Max",
    especie: "Perro",
    raza: "Boyero de Berna",
    edad: "5 años",
    descripcion: "Muy obediente y cariñoso, ideal como perro de familia.",
    imagen: "https://images.unsplash.com/photo-1637852423718-277c307750cc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    estado: "Disponible"
  },
  {
    id: 6,
    nombre: "Nala",
    especie: "Gato",
    raza: "Mestizo",
    edad: "6 meses",
    descripcion: "Pequeña y juguetona, busca un hogar lleno de amor.",
    imagen: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    estado: "Disponible"
  },
  {
    id: 7,
    nombre: "Thor",
    especie: "Perro",
    raza: "Pastor Alemán",
    edad: "4 años",
    descripcion: "Fiel guardián, protector y muy inteligente.",
    imagen: "https://images.unsplash.com/photo-1552053831-71594a27632d",
    estado: "Adoptado"
  },
  {
    id: 8,
    nombre: "Canelita",
    especie: "Conejo",
    raza: "Mini Lop",
    edad: "1 año",
    descripcion: "Dulce y de orejas caídas, le encanta comer zanahorias.",
    imagen: "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    estado: "Disponible"
  },
  {
    id: 9,
    nombre: "Kiara",
    especie: "Perro",
    raza: "Beagle",
    edad: "4 meses",
    descripcion: "Curiosa y energética, le encanta explorar.",
    imagen: "https://plus.unsplash.com/premium_photo-1723514553579-b589437b3b06?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
    estado: "Disponible"
  },
  {
    id: 10,
    nombre: "Tommy",
    especie: "Gato",
    raza: "Angora",
    edad: "1 año",
    descripcion: "Muy juguetón, adora las caricias y las cajas de cartón.",
    imagen: "https://plus.unsplash.com/premium_photo-1677181729163-33e6b59d5c8f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    estado: "Adoptado"
  }
];

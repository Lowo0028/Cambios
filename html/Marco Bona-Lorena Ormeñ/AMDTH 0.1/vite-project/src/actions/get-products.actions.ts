import { products } from "../data/productos.mock";

export function getProductsByName(name: string) {
  return products.filter((p) =>
    p.nombre.toLowerCase().includes(name.toLowerCase())
  );
}

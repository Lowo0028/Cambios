import React from "react";
import Tienda from "../components/tiendacomponents/tienda";

interface TiendaPageProps {
  agregarAlCarrito: (producto: any) => void;
}

export default function TiendaPage({ agregarAlCarrito }: TiendaPageProps) {
  return <Tienda agregarAlCarrito={agregarAlCarrito} />;
}

import React from "react";

export default function NavBar() {
  return (
    <header className="app-header">
      <h1>A milímetros de tu hogar</h1>
      <nav>
        <a href="#inicio">Inicio</a> {" | "}
        <a href="#tienda">Tienda</a> {" | "}
        <a href="#adopcion">Adopción</a> {" | "}
        <a href="#carrito">Carrito</a>
      </nav>
    </header>
  );
}

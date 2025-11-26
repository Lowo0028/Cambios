import React from "react";
import NavBar from "../sharedcomponents/NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-root">
      <NavBar />
      <main style={{ padding: "1rem" }}>{children}</main>
      <footer>
        <small>Proyecto React — A milímetros de tu hogar</small>
      </footer>
    </div>
  );
}

import type { ReactNode } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/layout/PageTransition";
import Cursor from "../fx/Cursor";
import Curtain from "../fx/Curtain";
import Preloader from "../fx/Preloader";
import ThemeController from "../fx/ThemeController";
import "../fx/fx.css";
import "../components/layout/layout.css";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app motion-app">
      <Preloader />
      <Curtain />
      <Cursor />
      <ThemeController />

      <Navbar />

      <main id="main" className="motion-app-content">
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
    </div>
  );
}

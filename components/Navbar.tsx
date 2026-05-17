"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PrimaryButton } from "./ui";

const LINKS = [
  { label: "Home",     href: "/",        key: "home" },
  { label: "Serviços", href: "/servicos", key: "servicos" },
  { label: "Contato",  href: "/contato",  key: "contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* fechar menu ao trocar de rota */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useGSAP(() => {
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 });
  }, { scope: navRef });

  const navBg = scrolled || menuOpen ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.35)";

  return (
    <nav ref={navRef} style={{
      position: "sticky", top: 0, zIndex: 40,
      background: navBg,
      backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition: "background 200ms ease, border-color 200ms ease",
    }}>
      {/* barra principal */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src="/assets/logo-df-2x.png" alt="DF COMPANY" width={176} height={44} quality={100} style={{ height: 20, width: "auto" }} />
        </Link>

        {/* links desktop */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {LINKS.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link key={l.key} href={l.href} style={{
                position: "relative", padding: "10px 16px",
                color: isActive ? "#fff" : "var(--fg-muted)",
                fontSize: 14, fontWeight: 500, letterSpacing: "0.02em",
                transition: "color 120ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? "#fff" : "var(--fg-muted)")}
              >
                {l.label}
                {isActive && (
                  <span style={{
                    position: "absolute", left: 16, right: 16, bottom: 4, height: 2,
                    background: "var(--accent)", borderRadius: 2, boxShadow: "0 0 12px var(--accent)",
                  }} />
                )}
              </Link>
            );
          })}
          <span style={{ width: 12 }} />
          <PrimaryButton size="sm" href="/contato">AGENDAR DIAGNÓSTICO</PrimaryButton>
        </div>

        {/* hambúrguer mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="nav-hamburger" style={{ display: "none" }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: menuOpen ? "var(--accent)" : "var(--surface)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
                cursor: "pointer", padding: 0,
              }}
              aria-label="Menu"
            >
              <span style={{ width: 18, height: 2, background: "#fff", borderRadius: 2, transition: "all 200ms ease", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span style={{ width: 18, height: 2, background: "#fff", borderRadius: 2, transition: "all 200ms ease", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: 18, height: 2, background: "#fff", borderRadius: 2, transition: "all 200ms ease", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </button>
          </div>
        </div>
      </div>

      {/* menu mobile dropdown */}
      {menuOpen && (
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 20px 24px",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {LINKS.map((l) => {
            const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link key={l.key} href={l.href} style={{
                padding: "14px 16px", borderRadius: 12,
                background: isActive ? "rgba(255,0,0,0.1)" : "transparent",
                border: `1px solid ${isActive ? "rgba(255,0,0,0.25)" : "transparent"}`,
                color: isActive ? "#fff" : "var(--fg-2)",
                fontSize: 16, fontWeight: 600, letterSpacing: "0.02em",
                display: "block",
              }}>
                {l.label}
              </Link>
            );
          })}
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <PrimaryButton size="md" href="/contato">AGENDAR DIAGNÓSTICO</PrimaryButton>
          </div>
        </div>
      )}
    </nav>
  );
}

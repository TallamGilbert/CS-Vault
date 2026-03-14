"use client";

import { useState, useEffect } from "react";
import { Search, Layers, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface NavbarProps {
  onSearchOpen: () => void;
}

export function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Sources", href: "#sources" },
    { label: "Browse", href: "#browse" },
    { label: "About", href: "#about" },
  ];

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 md:px-10 transition-all duration-200 ${
        scrolled
          ? "bg-dv-surface/95 backdrop-blur-xl border-b border-dv-border2"
          : "bg-dv-surface/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <a href="/" className="flex items-center gap-2 group">
        <div className="w-6 h-6 rounded-md bg-dv-accent flex items-center justify-center">
          <Layers size={13} className="text-dv-bg" strokeWidth={2.5} />
        </div>
        <span className="font-heading font-semibold text-[15px] tracking-tight text-dv-text">
          DevVault
        </span>
        <span className="font-mono text-[10px] text-dv-text3 ml-1 hidden sm:inline">
          v2.4
        </span>
      </a>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-dv-text2 text-[13px] font-medium hover:text-dv-text transition-colors hidden md:block"
          >
            {link.label}
          </a>
        ))}

        <div className="w-px h-4 bg-dv-border hidden md:block" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-lg text-dv-text3 hover:text-dv-text hover:bg-dv-elevated/50 transition-colors cursor-pointer bg-transparent border-none"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Sun size={14} />
          ) : (
            <Moon size={14} />
          )}
        </button>

        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 text-dv-text3 hover:text-dv-text2 transition-colors cursor-pointer bg-transparent border-none"
        >
          <Search size={14} />
          <span className="text-[13px] font-medium hidden sm:inline">Search</span>
          <kbd className="text-[10px] text-dv-text3 border border-dv-border rounded px-1.5 py-0.5 font-mono hidden sm:inline">
            /
          </kbd>
        </button>
      </div>
    </nav>
  );
}

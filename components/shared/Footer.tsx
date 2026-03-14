"use client";

import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer id="about" className="border-t border-dv-border2 scroll-mt-20">
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="max-w-[280px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-dv-accent flex items-center justify-center">
                <Layers size={11} className="text-dv-bg" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-semibold text-[14px] text-dv-text tracking-tight">
                DevVault
              </span>
            </div>
            <p className="text-[13px] text-dv-text3 leading-relaxed">
              Aggregating curated CS learning resources from top GitHub repositories.
              Open source, always free.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-14 flex-wrap">
            {[
              {
                heading: "Resources",
                links: [
                  { label: "CS Video Courses", href: "#cs-courses" },
                  { label: "Free Books", href: "#free-books" },
                  { label: "System Design", href: "#system-design-primer" },
                  { label: "Public APIs", href: "#public-apis" },
                ],
              },
              {
                heading: "Project",
                links: [
                  { label: "GitHub", href: "https://github.com/TallamGilbert/CS-Vault" },
                  { label: "Changelog", href: "https://github.com/TallamGilbert/CS-Vault/releases" },
                  { label: "Contribute", href: "https://github.com/TallamGilbert/CS-Vault" },
                  { label: "License", href: "https://github.com/TallamGilbert/CS-Vault/blob/main/README.md" },
                ],
              },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className="font-heading font-semibold text-[11px] text-dv-text2 uppercase tracking-[0.08em] mb-4">
                  {col.heading}
                </h4>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[13px] text-dv-text3 hover:text-dv-text2 transition-colors no-underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-dv-border2 flex flex-col sm:flex-row justify-between gap-3">
          <span className="text-[12px] text-dv-text3">
            &copy; 2026 DevVault. Data sourced from open GitHub repositories.
          </span>
          <span className="text-[12px] text-dv-text3">
            Built for learners, by learners.
          </span>
        </div>
      </div>
    </footer>
  );
}

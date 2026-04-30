"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFunnel } from "@/context/FunnelContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  FileText, 
  Zap, 
  Building2,
  Plus, 
  Columns, 
  Moon, 
  Sun,
  User,
  File as FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CommandType = "action" | "nav" | "theme" | "company" | "lead" | "document";

interface Command {
  id: string;
  shortcut?: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ElementType;
  type: CommandType;
  path?: string;
  actionId?: string;
}

const STATIC_COMMANDS: Command[] = [
  { id: "new-deal",        shortcut: "N", title: "Criar Novo Negócio",             category: "Ações Rápidas", icon: Plus,            type: "action", actionId: "cmd-new-deal" },
  { id: "new-funnel",      shortcut: "E", title: "Criar Novo Funil",               category: "Ações Rápidas", icon: Columns,         type: "action", actionId: "cmd-new-funnel" },
  { id: "nav-home",        shortcut: "H", title: "Dashboard / Kanban",             category: "Navegação",     icon: LayoutDashboard, type: "nav",    path: "/" },
  { id: "nav-leads",       shortcut: "L", title: "Contatos e Leads",               category: "Navegação",     icon: Users,           type: "nav",    path: "/leads" },
  { id: "nav-companies",   shortcut: "C", title: "Empresas",                       category: "Navegação",     icon: Building2,       type: "nav",    path: "/companies" },
  { id: "nav-analytics",   shortcut: "A", title: "Analytics",                      category: "Navegação",     icon: BarChart3,       type: "nav",    path: "/analytics" },
  { id: "nav-docs",        shortcut: "D", title: "Documentos",                     category: "Navegação",     icon: FileText,        type: "nav",    path: "/documents" },
  { id: "nav-automations", shortcut: "Z", title: "Automações",                     category: "Navegação",     icon: Zap,             type: "nav",    path: "/automations" },
  { id: "nav-settings",    shortcut: "S", title: "Configurações",                  category: "Navegação",     icon: Settings,        type: "nav",    path: "/settings" },
  { id: "sys-theme",       shortcut: "T", title: "Alternar Tema (Claro / Escuro)", category: "Sistema",       icon: Moon,            type: "theme" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { theme, setTheme, companies, leads, deals } = useFunnel();

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC") || navigator.userAgent.toUpperCase().includes("MAC"));
  }, []);

  // Build dynamic commands from real data (only when searching)
  const allDocuments = (deals || []).flatMap((deal: any) =>
    (deal.documents || []).map((doc: any) => ({ ...doc, dealTitle: deal.title }))
  );

  const dynamicCommands: Command[] = [
    ...(companies || []).map((c: any): Command => ({
      id: `company-${c.id}`,
      title: c.name,
      subtitle: c.industry || "Empresa",
      category: "Empresas",
      icon: Building2,
      type: "company",
      path: "/companies",
    })),
    ...(leads || []).map((l: any): Command => ({
      id: `lead-${l.id}`,
      title: l.name,
      subtitle: `${l.role ? l.role + " · " : ""}${l.company || ""}`,
      category: "Contatos",
      icon: User,
      type: "lead",
      path: "/leads",
    })),
    ...allDocuments.map((doc: any): Command => ({
      id: `doc-${doc.id}`,
      title: doc.name,
      subtitle: doc.dealTitle,
      category: "Documentos",
      icon: FileIcon,
      type: "document",
      path: "/documents",
    })),
  ];

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const dispatchAction = (actionId: string) => {
    if (window.location.pathname !== "/") router.push("/");
    setTimeout(() => window.dispatchEvent(new CustomEvent(actionId)), 150);
  };

  const executeCommand = (cmd: Command) => {
    if (cmd.type === "action" && cmd.actionId) dispatchAction(cmd.actionId);
    else if (cmd.type === "nav" || cmd.type === "company" || cmd.type === "lead" || cmd.type === "document") router.push(cmd.path!);
    else if (cmd.type === "theme") toggleTheme();
    setIsOpen(false);
  };

  // Which pool to use: static when no query, static + dynamic when query exists
  const pool = query.trim().length > 0
    ? [...STATIC_COMMANDS, ...dynamicCommands]
    : STATIC_COMMANDS;

  const filteredCommands = pool.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      (c.subtitle || "").toLowerCase().includes(query.toLowerCase()) ||
      (c.shortcut || "").toLowerCase() === query.toLowerCase()
  );

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) acc[command.category] = [];
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, Command[]>);

  const flattenedResults = Object.values(groupedCommands).flat();

  // Global keyboard listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((o) => !o);
        return;
      }
      if (!isOpen) return;
      if (e.key === "Escape") { setIsOpen(false); return; }

      // Single-letter shortcuts only when no search text
      if (query === "" && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const match = STATIC_COMMANDS.find((c) => c.shortcut?.toLowerCase() === e.key.toLowerCase());
        if (match) { e.preventDefault(); executeCommand(match); return; }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, query, theme]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((p) => (p + 1) % flattenedResults.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((p) => (p - 1 + flattenedResults.length) % flattenedResults.length); }
    else if (e.key === "Enter") { e.preventDefault(); if (flattenedResults.length > 0) executeCommand(flattenedResults[selectedIndex]); }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-[200] flex items-start justify-center pt-[15vh] p-4">
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -16 }}
          transition={{ duration: 0.15 }}
          className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden z-10 flex flex-col"
        >
          {/* Search input */}
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pesquise empresas, leads, documentos ou pressione uma letra…"
              className="w-full bg-transparent border-none py-4 outline-none text-foreground text-base placeholder:text-muted-foreground"
            />
            <kbd className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-mono font-bold shrink-0">ESC</kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
            {flattenedResults.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-muted-foreground text-sm">Nenhum resultado para "{query}"</p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="mb-2 last:mb-0">
                  <div className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                    <span>{category}</span>
                    <span className="font-medium normal-case tracking-normal">{items.length}</span>
                  </div>
                  <div className="space-y-0.5">
                    {items.map((command) => {
                      const globalIndex = flattenedResults.indexOf(command);
                      const isSelected = selectedIndex === globalIndex;

                      return (
                        <div
                          key={command.id}
                          data-index={globalIndex}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          onClick={() => executeCommand(command)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors",
                            isSelected ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <command.icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-primary-foreground" : "text-muted-foreground")} />
                            <div className="min-w-0">
                              <span className="text-sm font-medium truncate block">{command.title}</span>
                              {command.subtitle && (
                                <span className={cn("text-[11px] truncate block", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                  {command.subtitle}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Shortcut badge (static commands only) */}
                          {command.shortcut && (
                            <kbd className={cn(
                              "w-6 h-6 flex items-center justify-center rounded text-[11px] font-black font-mono transition-colors shrink-0 ml-2",
                              isSelected
                                ? "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30"
                                : "bg-muted text-muted-foreground border border-border"
                            )}>
                              {command.shortcut}
                            </kbd>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}

            {/* Hint when no query */}
            {query.trim() === "" && (
              <p className="text-center text-[11px] text-muted-foreground py-3 px-4 border-t border-border mt-2">
                💡 Digite para buscar empresas, leads e documentos cadastrados
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex justify-between items-center">
            <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="bg-background border border-border px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">↑</kbd>
                <kbd className="bg-background border border-border px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">↓</kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-background border border-border px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">Enter</kbd>
                selecionar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-background border border-border px-1.5 py-0.5 rounded text-[10px] font-mono shadow-sm">Letra</kbd>
                ação direta
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
              <kbd className="bg-background border border-border px-1.5 py-0.5 rounded font-mono shadow-sm">
                {isMac ? "⌘" : "Ctrl"}
              </kbd>
              <kbd className="bg-background border border-border px-1.5 py-0.5 rounded font-mono shadow-sm">K</kbd>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

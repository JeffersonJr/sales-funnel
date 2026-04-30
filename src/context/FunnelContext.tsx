"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import mockDb from "@/data/mock-db.json";

const FunnelContext = createContext<any>(null);

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [deals, setDeals] = useState<any[]>(mockDb.deals);
  const [users, setUsers] = useState<any[]>(mockDb.users);
  const [stages, setStages] = useState<any[]>(mockDb.stages);
  const [funnels, setFunnels] = useState<any[]>((mockDb as any).funnels || []);
  const [activeFunnelId, setActiveFunnelId] = useState<string>("main");
  const [templates, setTemplates] = useState<any[]>(mockDb.templates);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>((mockDb as any).leads || []);
  const [companies, setCompanies] = useState<any[]>((mockDb as any).companies || []);
  const [groups, setGroups] = useState<any[]>([]);
  const [automations, setAutomations] = useState<any[]>([]);
  const [automationTemplates, setAutomationTemplates] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null); // Visual auth
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("light");
  const [fontSize, setFontSizeState] = useState(16);

  useEffect(() => {
    setIsMounted(true);
    const load = (key: string, setter: any, fallback: any) => {
      const saved = localStorage.getItem(key);
      if (saved) setter(JSON.parse(saved));
      else if (fallback) setter(fallback);
    };

    const savedFunnels = localStorage.getItem("funnel_pipelines");
    let initialFunnels = (mockDb as any).funnels || [{ id: "main", name: "Pipeline Principal" }];
    if (savedFunnels) {
      initialFunnels = JSON.parse(savedFunnels);
    }
    setFunnels(initialFunnels);

    const savedActiveFunnelId = localStorage.getItem("active_funnel_id");
    const initialActiveFunnelId = savedActiveFunnelId || initialFunnels[0]?.id || "main";
    setActiveFunnelId(initialActiveFunnelId);

    const savedStages = localStorage.getItem("funnel_stages");
    let initialStages = mockDb.stages;
    if (savedStages) {
      initialStages = JSON.parse(savedStages);
      let migrated = false;
      initialStages = initialStages.map((s: any) => {
        let updated = { ...s };
        if (s.id === "closed" || s.title === "Fechado") {
          migrated = true;
          updated = { ...updated, id: "won", title: "Ganho" };
        }
        
        if (!updated.color) {
          migrated = true;
          if (updated.id === "won") updated.color = "#22c55e";
          else if (updated.id === "lost") updated.color = "#ef4444";
          else updated.color = "#3b82f6";
        }
        return updated;
      });
      
      if (!initialStages.some((s: any) => s.id === "lost")) {
        initialStages.push({ id: "lost", title: "Perdido", color: "#ef4444" });
        migrated = true;
      }
      
      if (migrated) {
        localStorage.setItem("funnel_stages", JSON.stringify(initialStages));
      }
    }

    // Ensure all stages have a funnelId
    let migratedStagesToFunnel = false;
    initialStages = initialStages.map((s: any) => {
      if (!s.funnelId) {
        migratedStagesToFunnel = true;
        // Default migration to main funnel
        return { ...s, funnelId: "main" };
      }
      return s;
    });

    if (migratedStagesToFunnel) {
      localStorage.setItem("funnel_stages", JSON.stringify(initialStages));
    }
    setStages(initialStages);

    const savedDeals = localStorage.getItem("funnel_deals");
    let initialDeals = mockDb.deals;
    if (savedDeals) {
      initialDeals = JSON.parse(savedDeals);
      let migratedDeals = false;
      initialDeals = initialDeals.map((d: any) => {
        if (d.stage === "closed") {
          migratedDeals = true;
          return { ...d, stage: "won" };
        }
        return d;
      });
      
      if (migratedDeals) {
        localStorage.setItem("funnel_deals", JSON.stringify(initialDeals));
      }
    }
    setDeals(initialDeals);

    load("funnel_users", setUsers, mockDb.users);
    load("funnel_templates", setTemplates, mockDb.templates);
    load("funnel_tags", setAvailableTags, [
      { id: "1", name: "Valor Alto", color: "#ef4444" },
      { id: "2", name: "Nuvem", color: "#3b82f6" },
      { id: "3", name: "VIP", color: "#a855f7" },
      { id: "4", name: "Urgente", color: "#f97316" }
    ]);
    load("funnel_leads", setLeads, (mockDb as any).leads || []);
    load("funnel_companies", setCompanies, (mockDb as any).companies || []);
    load("funnel_groups", setGroups, [{ id: "g1", name: "Comercial SP", members: ["u1"] }]);
    load("funnel_automations", setAutomations, [
      {
        id: "auto-initial",
        name: "Boas vindas automático",
        triggerStageId: "lead",
        status: "active",
        actions: [
          { id: "act1", type: "whatsapp", config: { message: "Olá! Seja bem-vindo ao Leads.site. Como podemos ajudar?" } }
        ]
      }
    ]);
    load("funnel_automation_templates", setAutomationTemplates, [
      {
        id: "tmpl-1",
        name: "Follow-up de Boas Vindas",
        triggerStageId: "",
        status: "active",
        isTemplate: true,
        actions: [
          { id: "a1", type: "whatsapp", config: { message: "Olá! Recebemos seu interesse e logo um consultor entrará em contato." } },
          { id: "a2", type: "activity", config: { title: "Primeiro contato telefônico" } }
        ]
      },
      {
        id: "tmpl-2",
        name: "Recuperação de Lead Frio",
        triggerStageId: "",
        status: "active",
        isTemplate: true,
        actions: [
          { id: "a3", type: "email", config: { message: "Notamos que você não respondeu nosso último contato..." } },
          { id: "a4", type: "activity", config: { title: "Verificar redes sociais do lead" } }
        ]
      }
    ]);
    load("funnel_user", setUser, null);
    
    // Theme and Font Size
    const savedTheme = localStorage.getItem("app-theme") as any || "light";
    const savedFontSize = Number(localStorage.getItem("app-font-size")) || 16;
    setThemeState(savedTheme);
    setFontSizeState(savedFontSize);
    document.documentElement.style.setProperty("--base-font-size", `${savedFontSize}px`);
    if (savedTheme === "dark" || (savedTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("funnel_deals", JSON.stringify(deals));
      localStorage.setItem("funnel_users", JSON.stringify(users));
      localStorage.setItem("funnel_stages", JSON.stringify(stages));
      localStorage.setItem("funnel_templates", JSON.stringify(templates));
      localStorage.setItem("funnel_tags", JSON.stringify(availableTags));
      localStorage.setItem("funnel_leads", JSON.stringify(leads));
      localStorage.setItem("funnel_companies", JSON.stringify(companies));
      localStorage.setItem("funnel_groups", JSON.stringify(groups));
      localStorage.setItem("funnel_automations", JSON.stringify(automations));
      localStorage.setItem("funnel_automation_templates", JSON.stringify(automationTemplates));
      localStorage.setItem("funnel_user", JSON.stringify(user));
      localStorage.setItem("funnel_pipelines", JSON.stringify(funnels));
      localStorage.setItem("active_funnel_id", activeFunnelId);
    }
  }, [deals, users, stages, templates, availableTags, leads, companies, groups, automations, automationTemplates, user, funnels, activeFunnelId, isMounted]);

  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setFontSize = (newSize: number) => {
    setFontSizeState(newSize);
    localStorage.setItem("app-font-size", newSize.toString());
    document.documentElement.style.setProperty("--base-font-size", `${newSize}px`);
  };

  const addFunnel = (name: string) => {
    const newFunnel = { id: `f-${Date.now()}`, name };
    setFunnels([...funnels, newFunnel]);
    
    // Add default stages for new funnel
    const defaultStages = [
      { id: `lead-${Date.now()}`, title: "Lead", color: "#64748b", funnelId: newFunnel.id },
      { id: `discovery-${Date.now()}`, title: "Descoberta", color: "#3b82f6", funnelId: newFunnel.id },
      { id: `proposal-${Date.now()}`, title: "Proposta", color: "#8b5cf6", funnelId: newFunnel.id },
      { id: `won-${Date.now()}`, title: "Ganho", color: "#22c55e", funnelId: newFunnel.id },
      { id: `lost-${Date.now()}`, title: "Perdido", color: "#ef4444", funnelId: newFunnel.id }
    ];
    setStages([...stages, ...defaultStages]);
    setActiveFunnelId(newFunnel.id);
    return newFunnel;
  };

  const deleteFunnel = (funnelId: string, action: 'delete' | 'move' = 'delete', targetStageId?: string) => {
    if (funnels.length <= 1) return;
    
    const funnelStages = stages.filter(s => s.funnelId === funnelId);
    const funnelStageIds = funnelStages.map(s => s.id);

    if (action === 'move' && targetStageId) {
      setDeals(prev => prev.map(d => 
        funnelStageIds.includes(d.stage) ? { ...d, stage: targetStageId } : d
      ));
    } else {
      setDeals(prev => prev.filter(d => !funnelStageIds.includes(d.stage)));
    }

    const remainingFunnels = funnels.filter(f => f.id !== funnelId);
    setFunnels(remainingFunnels);
    setStages(prev => prev.filter(s => s.funnelId !== funnelId));
    
    if (activeFunnelId === funnelId) {
      setActiveFunnelId(remainingFunnels[0].id);
    }
  };

  const updateFunnel = (funnelId: string, updates: any) => {
    setFunnels(prev => prev.map(f => f.id === funnelId ? { ...f, ...updates } : f));
  };

  return (
    <FunnelContext.Provider value={{
      deals, setDeals,
      users, setUsers,
      stages, setStages,
      funnels, setFunnels,
      activeFunnelId, setActiveFunnelId,
      addFunnel, deleteFunnel, updateFunnel,
      templates, setTemplates,
      availableTags, setAvailableTags,
      leads, setLeads,
      companies, setCompanies,
      groups, setGroups,
      automations, setAutomations,
      automationTemplates, setAutomationTemplates,
      user, login, logout,
      theme, setTheme,
      fontSize, setFontSize
    }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  return useContext(FunnelContext);
}

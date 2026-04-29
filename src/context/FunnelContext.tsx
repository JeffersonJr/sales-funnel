"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import mockDb from "@/data/mock-db.json";

const FunnelContext = createContext<any>(null);

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [deals, setDeals] = useState<any[]>(mockDb.deals);
  const [users, setUsers] = useState<any[]>(mockDb.users);
  const [stages, setStages] = useState<any[]>(mockDb.stages);
  const [templates, setTemplates] = useState<any[]>(mockDb.templates);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [automations, setAutomations] = useState<any[]>([]);
  const [automationTemplates, setAutomationTemplates] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null); // Visual auth

  useEffect(() => {
    setIsMounted(true);
    const load = (key: string, setter: any, fallback: any) => {
      const saved = localStorage.getItem(key);
      if (saved) setter(JSON.parse(saved));
      else if (fallback) setter(fallback);
    };

    load("funnel_deals", setDeals, mockDb.deals);
    load("funnel_users", setUsers, mockDb.users);
    load("funnel_stages", setStages, mockDb.stages);
    load("funnel_templates", setTemplates, mockDb.templates);
    load("funnel_tags", setAvailableTags, [
      { id: "1", name: "Valor Alto", color: "#ef4444" },
      { id: "2", name: "Nuvem", color: "#3b82f6" },
      { id: "3", name: "VIP", color: "#a855f7" },
      { id: "4", name: "Urgente", color: "#f97316" }
    ]);
    load("funnel_leads", setLeads, []);
    load("funnel_companies", setCompanies, []);
    load("funnel_groups", setGroups, [{ id: "g1", name: "Comercial SP", members: ["u1"] }]);
    load("funnel_automations", setAutomations, []);
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
    }
  }, [deals, users, stages, templates, availableTags, leads, companies, groups, automations, automationTemplates, user, isMounted]);

  const login = (userData: any) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <FunnelContext.Provider value={{
      deals, setDeals,
      users, setUsers,
      stages, setStages,
      templates, setTemplates,
      availableTags, setAvailableTags,
      leads, setLeads,
      companies, setCompanies,
      groups, setGroups,
      automations, setAutomations,
      automationTemplates, setAutomationTemplates,
      user, login, logout
    }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  return useContext(FunnelContext);
}

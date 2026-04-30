"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, Building2, User, Target, ChevronRight, Zap, TrendingUp,
  BarChart3, Users, CreditCard, Clock, Star, Megaphone, Shield,
  Handshake, Globe, GraduationCap, Home, ShoppingBag, Stethoscope,
  Truck, Landmark, Cpu, Layers, MessageSquare, PenTool, PhoneCall,
  UserCheck, BarChart2, FileText, Calendar, Package
} from "lucide-react";
import Link from "next/link";

const TOTAL_STEPS = 5;

const INDUSTRIES = [
  { label: "Tecnologia & SaaS", icon: Cpu },
  { label: "Imobiliário", icon: Home },
  { label: "Educação & Cursos", icon: GraduationCap },
  { label: "Varejo & E-commerce", icon: ShoppingBag },
  { label: "Serviços Digitais", icon: Globe },
  { label: "Saúde & Clínicas", icon: Stethoscope },
  { label: "Agência de Marketing", icon: Megaphone },
  { label: "Jurídico & Compliance", icon: Shield },
  { label: "Consultoria", icon: Handshake },
  { label: "Logística & Supply", icon: Truck },
  { label: "Financeiro & Seguros", icon: Landmark },
  { label: "Outros", icon: Layers },
];

const ROLES = [
  { label: "Fundador / CEO" },
  { label: "Gestor de Vendas" },
  { label: "Vendedor Senior" },
  { label: "Vendedor Junior / SDR" },
  { label: "Analista de Marketing" },
  { label: "Customer Success" },
  { label: "Consultor Comercial" },
  { label: "Diretor de Operações" },
];

const GOALS = [
  { id: "sales", label: "Aumentar Vendas", icon: TrendingUp, desc: "Foco em conversão e fechamento" },
  { id: "leads", label: "Gerenciar Leads", icon: Users, desc: "Organização e nutrição de contatos" },
  { id: "auto", label: "Automatizar Processos", icon: Zap, desc: "Economia de tempo com workflow" },
  { id: "data", label: "Análise de Dados", icon: BarChart3, desc: "Insights e métricas de performance" },
  { id: "crm", label: "Gestão de CRM", icon: UserCheck, desc: "Relacionamento com clientes" },
  { id: "pipeline", label: "Controle de Pipeline", icon: Layers, desc: "Visualização clara do funil" },
  { id: "proposals", label: "Envio de Propostas", icon: FileText, desc: "Agilidade em cotações" },
  { id: "followup", label: "Follow-up Ativo", icon: PhoneCall, desc: "Contato recorrente com leads" },
  { id: "reports", label: "Relatórios de Performance", icon: BarChart2, desc: "Métricas e KPIs detalhados" },
  { id: "calendar", label: "Agendamento & Reuniões", icon: Calendar, desc: "Organizar agenda de vendas" },
  { id: "marketing", label: "Integrar com Marketing", icon: Megaphone, desc: "Conectar campanhas ao CRM" },
  { id: "inventory", label: "Gestão de Produtos", icon: Package, desc: "Catálogo e propostas rápidas" },
];

export function OnboardingModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [roleCustom, setRoleCustom] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [planChoice, setPlanChoice] = useState<"trial" | "plan" | null>(null);

  useEffect(() => {
    setMounted(true);
    const hasCompleted = localStorage.getItem("leads_site_onboarding_completed");
    if (!hasCompleted) setIsOpen(true);
  }, []);

  const handleComplete = () => {
    localStorage.setItem("leads_site_onboarding_completed", "true");
    setIsOpen(false);
  };

  const toggleGoal = (label: string) => {
    setGoals((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const isNextDisabled = () => {
    if (step === 1) return !industry;
    if (step === 2) return !role && !roleCustom.trim();
    if (step === 3) return goals.length === 0;
    if (step === 4) return !planChoice;
    return false;
  };

  if (!mounted || !isOpen) return null;

  const effectiveRole = role === "Outros" ? roleCustom : role;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
            <motion.div
              className="h-full bg-blue-600"
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <button
            onClick={handleComplete}
            className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-900 transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="flex-1 overflow-y-auto scrollbar-hide pr-1">

            {/* ── Step 1: Setor ── */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                  <Building2 size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Torne o Leads.site seu</h2>
                <p className="text-gray-500 font-medium mb-8 text-base">Qual é o setor principal do seu negócio?</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {INDUSTRIES.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => setIndustry(label)}
                      className={cn(
                        "p-4 rounded-2xl border text-sm font-bold transition-all text-left flex items-center gap-3",
                        industry === label
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white"
                      )}
                    >
                      <Icon size={16} className={industry === label ? "text-blue-600" : "text-gray-400"} />
                      <span className="leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Papel ── */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                  <User size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Qual seu papel?</h2>
                <p className="text-gray-500 font-medium mb-8 text-base">Isso nos ajuda a configurar sua experiência inicial.</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {ROLES.map(({ label }) => (
                    <button
                      key={label}
                      onClick={() => { setRole(label); setRoleCustom(""); }}
                      className={cn(
                        "p-4 rounded-2xl border text-sm font-bold transition-all text-left flex justify-between items-center",
                        role === label
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white"
                      )}
                    >
                      {label}
                      {role === label && <Check size={16} className="shrink-0" />}
                    </button>
                  ))}
                  {/* Outros */}
                  <button
                    onClick={() => setRole("Outros")}
                    className={cn(
                      "p-4 rounded-2xl border text-sm font-bold transition-all text-left flex justify-between items-center",
                      role === "Outros"
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-white"
                    )}
                  >
                    <span className="flex items-center gap-2"><PenTool size={14} /> Outros</span>
                    {role === "Outros" && <Check size={16} className="shrink-0" />}
                  </button>
                </div>

                <AnimatePresence>
                  {role === "Outros" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <input
                        autoFocus
                        placeholder="Descreva seu papel..."
                        value={roleCustom}
                        onChange={(e) => setRoleCustom(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 outline-none focus:border-purple-500 transition-colors mt-2"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ── Step 3: Objetivos (multi-select) ── */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-8">
                  <Target size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Seu foco principal</h2>
                <p className="text-gray-500 font-medium mb-2 text-base">Selecione um ou mais objetivos para sua equipe.</p>
                {goals.length > 0 && (
                  <p className="text-xs font-black text-orange-600 mb-6 uppercase tracking-widest">{goals.length} selecionado{goals.length > 1 ? "s" : ""}</p>
                )}
                {goals.length === 0 && <div className="mb-6" />}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {GOALS.map((g) => {
                    const selected = goals.includes(g.label);
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.label)}
                        className={cn(
                          "p-4 rounded-2xl border transition-all text-left relative group",
                          selected
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white"
                        )}
                      >
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center">
                            <Check size={12} />
                          </div>
                        )}
                        <g.icon size={20} className={cn("mb-2 transition-colors", selected ? "text-orange-600" : "text-gray-400 group-hover:text-gray-700")} />
                        <p className={cn("text-xs font-black leading-tight", selected ? "text-orange-900" : "text-gray-800")}>{g.label}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 leading-tight">{g.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ── Step 4: Plano ── */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8">
                  <Star size={32} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Escolha como começar</h2>
                <p className="text-gray-500 font-medium mb-8 text-base">Você pode mudar de plano a qualquer momento.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Pro Plan */}
                  <button
                    onClick={() => setPlanChoice("plan")}
                    className={cn(
                      "relative p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-4",
                      planChoice === "plan"
                        ? "border-gray-900 bg-gray-900 ring-4 ring-gray-900/20"
                        : "border-gray-900 bg-gray-900 hover:ring-4 hover:ring-gray-900/20"
                    )}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Mais Popular</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">Plano Pro</p>
                      <p className="text-2xl font-black text-white mt-1">R$ 97<span className="text-sm font-bold text-gray-400">/mês</span></p>
                      <ul className="mt-3 space-y-1.5">
                        {["Pipelines ilimitados", "Automações avançadas", "Relatórios completos", "Suporte prioritário"].map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs font-bold text-gray-300">
                            <Check size={12} className="text-green-400 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {planChoice === "plan" && (
                      <div className="absolute bottom-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check size={14} className="text-gray-900" />
                      </div>
                    )}
                  </button>

                  {/* Business Plan */}
                  <button
                    onClick={() => setPlanChoice("trial")}
                    className={cn(
                      "relative p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-4",
                      planChoice === "trial"
                        ? "border-blue-600 bg-blue-50 ring-4 ring-blue-600/20"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100 text-blue-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className={cn("text-lg font-black", planChoice === "trial" ? "text-blue-900" : "text-gray-900")}>Teste Grátis</p>
                      <p className={cn("text-2xl font-black mt-1", planChoice === "trial" ? "text-blue-700" : "text-gray-900")}>15 dias<span className={cn("text-sm font-bold", planChoice === "trial" ? "text-blue-400" : "text-gray-400")}> sem custo</span></p>
                      <ul className="mt-3 space-y-1.5">
                        {["Sem cartão de crédito", "Acesso completo", "Dados salvos ao assinar", "Cancele quando quiser"].map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                            <Check size={12} className="text-blue-500 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {planChoice === "trial" && (
                      <div className="absolute bottom-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {planChoice === "plan" && (
                  <Link
                    href="/plans"
                    onClick={handleComplete}
                    className="block w-full text-center bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-gray-800 transition-all mt-2"
                  >
                    Ver Planos e Assinar →
                  </Link>
                )}

                {/* Continue free */}
                <button
                  onClick={() => { setPlanChoice("trial"); }}
                  className="w-full mt-4 text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors py-1"
                >
                  Ou continuar no plano free com recursos limitados →
                </button>
              </motion.div>
            )}

            {/* ── Step 5: Concluído ── */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-6">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-[2rem] flex items-center justify-center mb-8 mx-auto">
                  <Check size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Tudo pronto!</h2>
                <p className="text-gray-500 font-medium mb-10 text-base">
                  Seu funil foi otimizado para <span className="text-gray-900 font-black">{industry}</span>
                  {goals.length > 0 && <> com foco em <span className="text-gray-900 font-black">{goals[0]}</span></>}.
                </p>

                <div className="bg-gray-50 p-8 rounded-3xl mb-8 text-left border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">O que configuramos para você:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <Check size={16} className="text-green-500" /> Pipeline de {industry} Ativado
                    </li>
                    {goals.slice(0, 3).map((g) => (
                      <li key={g} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <Check size={16} className="text-green-500" /> {g} configurado
                      </li>
                    ))}
                    <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <Check size={16} className="text-green-500" /> Dashboard de Performance Integrado
                    </li>
                    {planChoice === "trial" && (
                      <li className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <Clock size={16} className="text-blue-500" /> Teste grátis de 15 dias ativado
                      </li>
                    )}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer navigation */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-4 shrink-0">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              className={cn("text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors", step === 1 && "invisible")}
            >
              Voltar
            </button>
            {!(step === 4 && planChoice === "plan") && (
              <button
                onClick={() => {
                  if (step < TOTAL_STEPS) setStep(step + 1);
                  else handleComplete();
                }}
                disabled={isNextDisabled()}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {step === TOTAL_STEPS ? "Começar a Vender" : "Próximo Passo"}
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

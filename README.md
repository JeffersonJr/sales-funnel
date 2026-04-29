# Funnel.io - Orquestrador de Funil de Vendas & Motor de Automação

Um aplicativo de Funil de Vendas de alta performance e minimalista, construído com **Next.js 15**, **Tailwind CSS v4** e **Framer Motion**. Projetado para máxima eficiência com uma estética inspirada no Intercom.

## 🚀 Funcionalidades

### 🛠 Arquitetura Core
- **Next.js App Router**: Roteamento otimizado e renderização no lado do servidor.
- **Integração DND-Kit**: Quadro Kanban robusto com drag-and-drop para gestão de negócios.
- **Framer Motion**: Transições de layout suaves e micro-animações.
- **Motor de Mock DB**: Estrutura baseada em JSON pronta para persistência para prototipagem rápida.

### 📊 Pipeline Kanban
- **Estágios Dinâmicos**: Gerencie negócios desde `Lead` até `Fechado`.
- **Indicadores de Inatividade**: Alertas visuais para negócios sem atividade por mais de 3 dias.
- **Cards de Alta Performance**: Cálculo de valor em tempo real e gestão de tags.

### 🤖 Automações Inteligentes
- **Geração Automática de Propostas**: Dispara automaticamente um rascunho de proposta quando um negócio atinge o estágio de "Proposta".
- **Alertas de Inatividade**: Monitoramento automático da atividade dos negócios para evitar perda de leads.

### 📄 Motor de Documentos & Detalhes
- **Checklists Padrão (Modelos)**: Aplique modelos de checklist pré-definidos a qualquer negócio.
- **Marcadores de Atividade**: Checkboxes interativos para acompanhar o progresso.
- **Gerador de Resumo por IA**: Geração em um clique de resumos do status do negócio.
- **Notas e Atividades**: Adicione notas persistentes e agende reuniões ou tarefas diretamente no card.
- **Perfil do Cliente**: Visualização detalhada do perfil da empresa ou pessoa associada ao negócio.

### 🔐 Sistema de Permissões
- **Acesso Baseado em Funções (RBAC)**: Suporte para funções de Administrador, Gerente e Vendedor.
- **Controle em Nível de Componente**: Verificações para ações sensíveis.

## 🛠 Stack Tecnológica
- **Framework**: [Next.js](https://nextjs.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Manipulação de Datas**: [date-fns](https://date-fns.org/)

## 📂 Estrutura do Projeto
```text
/src
  /app           - Páginas do Next.js 15 App Router
  /components
    /kanban      - Lógica do quadro Kanban e DealCard
    /layout      - Componentes de Sidebar e Navegação
    /deals       - Motor de Documentos e visualização de Detalhes
  /hooks         - Hooks de Permissões e estado da UI
  /services      - Motores de Automação e geração de Documentos
  /data          - Mock DB e dados estáticos
  /lib           - Utilitários Tailwind e helpers
```

## 🚦 Primeiros Passos

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar o App**:
   Abra [http://localhost:3000](http://localhost:3000)

---
Construído com ⚡️ por Antigravity AI

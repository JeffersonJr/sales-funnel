/**
 * Document Generation Engine
 */

export const docGenerator = {
  /**
   * Generates a summary based on "Activity Markers"
   */
  async generateDealSummary(deal: any) {
    const allItems = deal.checklists?.flatMap((cl: any) => cl.items) || [];
    const completedItems = allItems.filter((it: any) => it.checked);
    
    const progressText = allItems.length > 0 
      ? `${completedItems.length} de ${allItems.length} tarefas concluídas (${Math.round((completedItems.length / allItems.length) * 100)}%)`
      : "Nenhuma tarefa definida.";

    const summary = `
# PROPOSTA COMERCIAL: ${deal.title}
**Cliente:** ${deal.company}
**Responsável:** Jefferson Jr
**Valor do Investimento:** R$ ${deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
**Data de Emissão:** ${new Date().toLocaleDateString('pt-BR')}

## 1. Visão Geral
Esta proposta detalha a solução estratégica para a ${deal.company}, focando nos objetivos alinhados durante as fases de Descoberta.

## 2. Status de Execução (Checklist)
Atualmente, o projeto encontra-se no estágio **${deal.stage.toUpperCase()}**.
Progresso atual: ${progressText}

${completedItems.map((it: any) => `[x] ${it.text}`).join('\n')}
${allItems.filter((it: any) => !it.checked).map((it: any) => `[ ] ${it.text}`).join('\n')}

## 3. Próximos Passos
- Conclusão das tarefas pendentes acima.
- Agendamento da reunião de revisão final.
- Assinatura do contrato e onboarding.

---
Documento gerado automaticamente pelo Leads.site - Inteligência em Vendas
    `;

    console.log(`[DOC_GEN] Resumo gerado para ${deal.id}`);
    return summary;
  },

  async triggerFileWrite(filename: string, content: string) {
    console.log(`[FS_ACTION] Escrevendo arquivo: ${filename}`);
    return true;
  }
};

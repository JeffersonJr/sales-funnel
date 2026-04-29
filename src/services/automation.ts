/**
 * Smart Automations (Pipefy-style)
 */

export const automationService = {
  /**
   * Trigger: Quando o estágio do negócio muda para "Proposta".
   * Action: Gera um PDF 'Proposal_Draft' automaticamente.
   */
  async handleStageChange(dealId: string, newStage: string) {
    if (newStage === "proposal") {
      console.log(`[AUTOMAÇÃO] Ativada para o negócio ${dealId}: Gerando Proposal_Draft.pdf`);
      return {
        type: "DOCUMENT_GENERATED",
        name: "Proposal_Draft.pdf",
        timestamp: new Date().toISOString(),
      };
    }
    return null;
  },

  /**
   * Trigger: Quando o negócio está inativo por 3 dias.
   * Action: Marca com indicador "Inativo" e cria uma tarefa de acompanhamento.
   */
  async checkStaleDeals(deals: any[]) {
    const staleDeals = deals.filter(deal => {
      const lastActivity = new Date(deal.lastActivity);
      const diff = Date.now() - lastActivity.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      return days >= 3;
    });

    return staleDeals.map(deal => ({
      dealId: deal.id,
      action: "CREATE_TASK",
      taskTitle: `Acompanhar negócio inativo: ${deal.title}`,
    }));
  }
};

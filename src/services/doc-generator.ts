/**
 * Document Generation Engine
 */

export const docGenerator = {
  /**
   * Generates a summary based on "Activity Markers"
   */
  async generateDealSummary(deal: any) {
    const markers = deal.activityMarkers || {};
    const completedMarkers = Object.entries(markers)
      .filter(([_, value]) => value === true)
      .map(([key]) => `- ${key}`);

    const summary = `
# Resumo do Negócio: ${deal.title}
**Empresa:** ${deal.company}
**Valor:** R$${deal.value.toLocaleString('pt-BR')}
**Estágio:** ${deal.stage.toUpperCase()}

## Marcos de Progresso
${completedMarkers.length > 0 ? completedMarkers.join('\n') : "Nenhum marco concluído ainda."}

---
Gerado pelo Motor de IA Funnel.io em ${new Date().toLocaleDateString('pt-BR')}
    `;

    console.log(`[DOC_GEN] Resumo gerado para ${deal.id}`);
    return summary;
  },

  async triggerFileWrite(filename: string, content: string) {
    console.log(`[FS_ACTION] Escrevendo arquivo: ${filename}`);
    return true;
  }
};

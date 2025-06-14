
export const getStockStatus = (currentStock: number, stockCoverageDays: number, isStockSufficient: boolean) => {
  if (currentStock === 0) return { color: 'bg-gray-100 text-gray-800', text: 'Sem dados de estoque' };
  if (stockCoverageDays < 1) return { color: 'bg-red-100 text-red-800', text: 'Estoque crítico' };
  if (stockCoverageDays < 3) return { color: 'bg-orange-100 text-orange-800', text: 'Estoque baixo' };
  if (isStockSufficient) return { color: 'bg-green-100 text-green-800', text: 'Estoque suficiente' };
  return { color: 'bg-yellow-100 text-yellow-800', text: 'Atenção necessária' };
};

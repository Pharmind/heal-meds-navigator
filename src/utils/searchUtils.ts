
// Função para normalizar strings removendo acentos e convertendo para lowercase
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .trim();
};

// Função para calcular distância de Levenshtein (para busca fuzzy)
export const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

// Função para verificar se uma string contém outra de forma inteligente
export const intelligentSearch = (searchTerm: string, targetText: string): boolean => {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedTarget = normalizeString(targetText);

  // Se não há termo de busca, retorna false
  if (!normalizedSearch) return false;

  // Busca exata (mais rápida)
  if (normalizedTarget.includes(normalizedSearch)) {
    return true;
  }

  // Busca por palavras individuais
  const searchWords = normalizedSearch.split(/\s+/).filter(word => word.length > 0);
  const targetWords = normalizedTarget.split(/\s+/).filter(word => word.length > 0);

  // Verifica se todas as palavras da busca estão presentes no target
  const allWordsFound = searchWords.every(searchWord => {
    return targetWords.some(targetWord => {
      // Busca exata da palavra
      if (targetWord.includes(searchWord)) {
        return true;
      }

      // Busca fuzzy apenas para palavras com mais de 3 caracteres
      if (searchWord.length > 3 && targetWord.length > 3) {
        const maxDistance = Math.floor(searchWord.length * 0.2); // Permite 20% de erro
        const distance = levenshteinDistance(searchWord, targetWord);
        return distance <= maxDistance;
      }

      return false;
    });
  });

  return allWordsFound;
};

// Função para calcular score de relevância
export const calculateRelevanceScore = (searchTerm: string, targetText: string): number => {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedTarget = normalizeString(targetText);

  if (!normalizedSearch) return 0;

  let score = 0;

  // Bonus para match exato
  if (normalizedTarget === normalizedSearch) {
    score += 100;
  }

  // Bonus para início da string
  if (normalizedTarget.startsWith(normalizedSearch)) {
    score += 50;
  }

  // Bonus para conter a busca completa
  if (normalizedTarget.includes(normalizedSearch)) {
    score += 30;
  }

  // Score baseado na proporção de palavras encontradas
  const searchWords = normalizedSearch.split(/\s+/).filter(word => word.length > 0);
  const targetWords = normalizedTarget.split(/\s+/).filter(word => word.length > 0);

  let wordsFound = 0;
  searchWords.forEach(searchWord => {
    const found = targetWords.some(targetWord => {
      if (targetWord.includes(searchWord)) return true;
      if (searchWord.length > 3 && targetWord.length > 3) {
        const maxDistance = Math.floor(searchWord.length * 0.2);
        return levenshteinDistance(searchWord, targetWord) <= maxDistance;
      }
      return false;
    });
    if (found) wordsFound++;
  });

  score += (wordsFound / searchWords.length) * 20;

  return score;
};

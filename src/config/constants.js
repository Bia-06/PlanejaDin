// Paleta "Prosperidade Fresca"
export const THEME = {
  mint: '#00D48F',     // Principal / Ação
  teal: '#0E3A47',     // Secundária / Base
  tealDark: '#06252e', // Variação mais escura para degradê
  yellow: '#FFC800',   // Acento / Alerta
  white: '#FFFFFF',
  bgLight: '#F4F6F8',  // Fundo Geral
  textDark: '#0E3A47', // Texto Principal
  textLight: '#64748B' // Texto Secundário
};

// Cores para gráficos adaptadas à paleta
export const CHART_COLORS = [
  THEME.mint, 
  THEME.teal, 
  THEME.yellow, 
  '#FF8042', 
  '#8884d8', 
  '#ff595e', 
  '#1982c4'
];

export const DEFAULT_CATEGORIES = [
  'Casa', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Trabalho', 'Outros'
];
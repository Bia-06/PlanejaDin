// src/utils/formatters.js

export const formatCurrency = (value) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\./g, '').replace(',', '.')) : Number(value);
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(isNaN(numValue) ? 0 : numValue);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
  
  if (typeof dateString === 'string' && dateString.includes('T')) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  if (dateString instanceof Date) {
    return dateString.toLocaleDateString('pt-BR');
  }

  return '';
};

export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ATUALIZADO: Agora remove os pontos antes de converter para número
export const parseCommaValue = (value) => {
  if (!value) return 0;
  // Remove pontos de milhar e troca vírgula por ponto
  const cleanedValue = value.toString().replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleanedValue);
  return isNaN(parsed) ? 0 : parsed;
};

// ATUALIZADO: Adiciona pontos de milhar na visualização inicial
export const formatValueForInput = (value) => {
  if (!value && value !== '0') return '';
  
  // Se já estiver formatado corretamente (com pontos e virgula), retorna
  const stringValue = value.toString();
  
  // Limpa tudo que não é digito para reformatar do zero e garantir padrão
  return handleAmountInputChange(stringValue);
};

// ATUALIZADO: Lógica completa de máscara (1.000.000,00)
export const handleAmountInputChange = (value) => {
  // Remove tudo que não é dígito
  let cleaned = value.replace(/\D/g, '');
  
  if (!cleaned) return '';
  
  // Remove zeros à esquerda excessivos
  cleaned = cleaned.replace(/^0+/, '');
  
  // Garante que tenha pelo menos 3 dígitos (para fazer 0,0X)
  if (cleaned.length === 0) return '0,00';
  if (cleaned.length === 1) return '0,0' + cleaned;
  if (cleaned.length === 2) return '0,' + cleaned;
  
  // Separa os centavos (últimos 2 dígitos)
  const cents = cleaned.slice(-2);
  // Pega a parte inteira
  let integer = cleaned.slice(0, -2);
  
  // Adiciona os pontos de milhar na parte inteira
  // A regex olha de trás pra frente blocos de 3 números
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return integer + ',' + cents;
};
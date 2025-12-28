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

export const parseCommaValue = (value) => {
  if (!value) return 0;
  const cleanedValue = value.toString().replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleanedValue);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatValueForInput = (value) => {
  if (!value && value !== '0') return '';
  
  const stringValue = value.toString();
  
  return handleAmountInputChange(stringValue);
};

export const handleAmountInputChange = (value) => {
  let cleaned = value.replace(/\D/g, '');
  
  if (!cleaned) return '';

  cleaned = cleaned.replace(/^0+/, '');
  
  if (cleaned.length === 0) return '0,00';
  if (cleaned.length === 1) return '0,0' + cleaned;
  if (cleaned.length === 2) return '0,' + cleaned;
  
  const cents = cleaned.slice(-2);
  let integer = cleaned.slice(0, -2);
  
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return integer + ',' + cents;
};
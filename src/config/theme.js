export const theme = {
  colors: {
    light: {
      bg: '#F8FAFC',
      card: '#FFFFFF',
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        muted: '#64748B',
      },
      border: '#E2E8F0',
    },
    dark: {
      bg: '#0F172A',
      card: '#1E293B',
      text: {
        primary: '#F1F5F9',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
      },
      border: '#334155',
    },
  },
 
  classes: {
    text: {
      heading: 'text-teal dark:text-white',
      body: 'text-gray-700 dark:text-gray-300',
      muted: 'text-gray-600 dark:text-gray-400',
      label: 'text-gray-500 dark:text-gray-400',
    },
    bg: {
      card: 'bg-white dark:bg-gray-800',
      subtle: 'bg-gray-50 dark:bg-gray-700/30',
      hover: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
    },
    border: {
      default: 'border-gray-200 dark:border-gray-700',
      light: 'border-gray-100 dark:border-gray-600',
    }
  }
};
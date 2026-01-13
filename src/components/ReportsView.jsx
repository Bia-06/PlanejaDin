import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, PieChart as PieChartIcon, Download, Filter, CreditCard, Wallet
} from 'lucide-react'; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ComposedChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import Card from './UI/Card';
import Button from './UI/Button';
import { formatCurrency } from '../utils/formatters';
import { THEME, CHART_COLORS } from '../config/constants';

const ReportsView = ({ transactions = [], categories = [], paymentMethods = [] }) => {
  const [timeRange, setTimeRange] = useState('currentMonth'); 
  const [chartType, setChartType] = useState('composed');
  
  const FALLBACK_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter(t => {
       const tDate = new Date(t.date + 'T12:00:00');
       
       if (timeRange === 'currentMonth') {
           return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
       }
       
       if (timeRange === '3months') {
           const cutOff = new Date();
           cutOff.setMonth(now.getMonth() - 3);
           return tDate >= cutOff;
       }

       if (timeRange === '6months') {
           const cutOff = new Date();
           cutOff.setMonth(now.getMonth() - 6);
           return tDate >= cutOff;
       }

       if (timeRange === '1year') {
           const cutOff = new Date();
           cutOff.setMonth(now.getMonth() - 12);
           return tDate >= cutOff;
       }

       return true; 
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, timeRange]);

  const evolutionData = useMemo(() => {
    const grouped = {};
    const isDailyView = timeRange === 'currentMonth'; 

    filteredTransactions.forEach(t => {
      const dateObj = new Date(t.date + 'T12:00:00');
      
      let key;
      if (isDailyView) {
          key = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else {
          key = dateObj.toISOString().slice(0, 7); 
      }
      
      if (!grouped[key]) {
        grouped[key] = { 
            name: key, 
            displayDate: isDailyView ? key : new Date(key + '-02').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
            Receitas: 0, 
            Despesas: 0, 
            Lucro: 0 
        };
      }

      if (t.type === 'income') {
        grouped[key].Receitas += Number(t.amount);
      } else {
        grouped[key].Despesas += Number(t.amount);
      }
    });

    return Object.values(grouped).map(item => ({
      ...item,
      Lucro: item.Receitas - item.Despesas
    }));
  }, [filteredTransactions, timeRange]);

  const categoryData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const grouped = {};

    expenses.forEach(t => {
      const cat = t.category || 'Outros';
      if (!grouped[cat]) grouped[cat] = 0;
      grouped[cat] += Number(t.amount);
    });

    return Object.entries(grouped)
      .map(([name, value], index) => {
        const categoryObj = categories.find(c => c.name === name);
        const realColor = categoryObj ? categoryObj.color : CHART_COLORS[index % CHART_COLORS.length];
        
        return {
          name,
          value,
          color: realColor
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, categories]);

  const paymentMethodData = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const grouped = {};

    expenses.forEach(t => {
      const method = t.payment_method || 'Outros';
      if (!grouped[method]) grouped[method] = 0;
      grouped[method] += Number(t.amount);
    });

    return Object.entries(grouped)
      .map(([name, value], index) => {
        const methodObj = paymentMethods.find(p => p.name === name);
        const realColor = methodObj ? methodObj.color : FALLBACK_COLORS[index % FALLBACK_COLORS.length];

        return {
          name,
          value,
          color: realColor
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions, paymentMethods]);

  const monthlyComparison = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const groupedByMonth = {};

    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    monthNames.forEach((m, i) => {
      groupedByMonth[i] = { month: m, atual: 0, anterior: 0, economia: 0 };
    });

    transactions.forEach(t => {
      const date = new Date(t.date + 'T12:00:00');
      const year = date.getFullYear();
      const monthIndex = date.getMonth();

      if (t.type === 'income') { 
        if (year === currentYear) groupedByMonth[monthIndex].atual += Number(t.amount);
        if (year === lastYear) groupedByMonth[monthIndex].anterior += Number(t.amount);
      }
    });

    return Object.values(groupedByMonth).map(item => ({
      ...item,
      economia: item.atual - item.anterior 
    })).filter(item => item.atual > 0 || item.anterior > 0); 
  }, [transactions]);

  const totalIncome = evolutionData.reduce((sum, m) => sum + m.Receitas, 0);
  const totalProfit = evolutionData.reduce((sum, m) => sum + m.Lucro, 0);
  const totalExpensesCat = categoryData.reduce((sum, c) => sum + c.value, 0);
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  const topPaymentMethod = paymentMethodData.length > 0 ? paymentMethodData[0] : null;

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const displayLabel = payload[0]?.payload?.displayDate || label;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <p className="font-bold text-teal dark:text-white mb-2">{displayLabel}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mb-1 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color || entry.fill }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}:</span>
              </div>
              <span className="font-bold">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percentage = totalExpensesCat > 0 ? ((payload[0].value / totalExpensesCat) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50">
          <p className="font-bold text-teal dark:text-white">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-gray-500">{percentage}% do total</p>
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    alert('Funcionalidade de exportação será implementada em breve!');
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
          <TrendingUp className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-teal dark:text-white mb-2">Sem dados suficientes</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Adicione algumas receitas e despesas para ver seus relatórios detalhados aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn pb-24 font-inter">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins">Relatórios</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Análises detalhadas da sua saúde financeira</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
            >
              <option value="currentMonth" className="dark:bg-gray-800">Mês Atual</option>
              <option value="3months" className="dark:bg-gray-800">Últimos 3 meses</option>
              <option value="6months" className="dark:bg-gray-800">Últimos 6 meses</option>
              <option value="1year" className="dark:bg-gray-800">Último ano</option>
            </select>
          </div>
          
          <Button onClick={handleExport} variant="secondary" className="text-sm">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-mint h-full flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Receitas Totais</p>
              <p className="text-xl font-bold text-mint truncate">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-2 bg-mint/10 rounded-lg shrink-0">
              <TrendingUp className="w-6 h-6 text-mint" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-yellow h-full flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Lucro Líquido</p>
              <p className="text-xl font-bold text-yellow truncate">{formatCurrency(totalProfit)}</p>
            </div>
            <div className="p-2 bg-yellow/10 rounded-lg shrink-0">
              <TrendingUp className="w-6 h-6 text-yellow" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-purple-500 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Maior Gasto em</p>
              <p className="text-sm font-bold text-purple-600 dark:text-purple-300 truncate" title={topCategory ? topCategory.name : '-'}>
                {topCategory ? topCategory.name : '-'}
              </p>
              <p className="text-xs text-gray-400">{topCategory ? formatCurrency(topCategory.value) : 'R$ 0,00'}</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg shrink-0">
              <Wallet className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-l-orange-400 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Paga mais com</p>
              <p className="text-sm font-bold text-orange-500 truncate" title={topPaymentMethod ? topPaymentMethod.name : '-'}>
                {topPaymentMethod ? topPaymentMethod.name : '-'}
              </p>
               <p className="text-xs text-gray-400">{topPaymentMethod ? formatCurrency(topPaymentMethod.value) : 'R$ 0,00'}</p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg shrink-0">
              <CreditCard className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-teal dark:text-white">Categorias</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Onde você gasta mais</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Despesas</p>
              <p className="font-bold text-teal dark:text-white">{formatCurrency(totalExpensesCat)}</p>
            </div>
          </div>
          
          <div className="flex-1 min-h-0">
            {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80} 
                    paddingAngle={3}
                    dataKey="value"
                    >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px', width: '35%', overflow: 'hidden' }} 
                        formatter={(value, entry) => (
                            <span className="text-gray-700 dark:text-gray-200 ml-2 font-medium truncate align-middle" style={{ color: entry.color }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <PieChartIcon className="w-10 h-10 mb-2 opacity-50" />
                    <p>Sem dados</p>
                </div>
            )}
          </div>
        </Card>

        <Card className="flex flex-col h-[400px]">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-teal dark:text-white">Formas de Pagamento</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Como você costuma pagar</p>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
            {paymentMethodData.length > 0 ? (
                 <div className="space-y-5">
                    {paymentMethodData.map((item, index) => {
                        const percentage = ((item.value / totalExpensesCat) * 100).toFixed(0);
                        return (
                            <div key={item.name} className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        {item.name}
                                    </span>
                                    <div className="text-right">
                                        <span className="font-bold text-sm text-gray-800 dark:text-white block">{formatCurrency(item.value)}</span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="h-2.5 rounded-full transition-all duration-500" 
                                        style={{ width: `${percentage}%`, backgroundColor: item.color }}
                                    ></div>
                                </div>
                                <div className="text-right mt-0.5">
                                    <span className="text-xs text-gray-400">{percentage}% do total</span>
                                </div>
                            </div>
                        );
                    })}
                 </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <CreditCard className="w-10 h-10 mb-2 opacity-50" />
                    <p>Sem dados</p>
                </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-teal dark:text-white">Fluxo Financeiro</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {timeRange === 'currentMonth' ? 'Detalhamento diário' : 'Evolução mensal'}
              </p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0 overflow-x-auto pb-1 md:pb-0">
              {['composed', 'area', 'bar'].map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    chartType === type
                    ? 'bg-mint text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {type === 'composed' ? 'Composto' : type === 'area' ? 'Área' : 'Barras'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'composed' ? (
                <ComposedChart data={evolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} vertical={false} />
                  <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `R$${value/1000}k`} width={48} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="Receitas" fill={THEME.mint} radius={[6, 6, 0, 0]} barSize={20} name="Receitas" />
                  <Bar dataKey="Despesas" fill={THEME.teal} radius={[6, 6, 0, 0]} barSize={20} name="Despesas" />
                  <Line type="monotone" dataKey="Lucro" stroke={THEME.yellow} strokeWidth={3} dot={{ r: 4, fill: THEME.yellow }} activeDot={{ r: 6 }} name="Lucro" />
                </ComposedChart>
              ) : chartType === 'area' ? (
                <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.mint} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={THEME.mint} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME.teal} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={THEME.teal} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="displayDate" tick={{ fill: '#94a3b8' }} />
                  <YAxis tickFormatter={(value) => `R$${value/1000}k`} tick={{ fill: '#94a3b8' }} width={48} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Area type="monotone" dataKey="Receitas" stroke={THEME.mint} fill="url(#colorReceitas)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Despesas" stroke={THEME.teal} fill="url(#colorDespesas)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={evolutionData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="displayDate" tick={{ fill: '#94a3b8' }} />
                  <YAxis tickFormatter={(value) => `R$${value/1000}k`} tick={{ fill: '#94a3b8' }} width={48} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="Receitas" fill={THEME.mint} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Despesas" fill={THEME.teal} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <h3 className="text-lg font-bold text-teal dark:text-white">Comparativo Anual (Jan-Dez)</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-mint"></div>
              <span className="text-gray-600 dark:text-gray-300">Este Ano</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-gray-600 dark:text-gray-300">Ano Passado</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left py-3 pr-4 text-gray-500 dark:text-gray-400 font-medium">Mês</th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Este Ano</th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Ano Passado</th>
                <th className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">Diferença</th>
                <th className="text-left py-3 pl-4 text-gray-500 dark:text-gray-400 font-medium">Variação</th>
              </tr>
            </thead>
            <tbody>
              {monthlyComparison.map((item) => {
                const variation = item.anterior > 0 ? ((item.atual - item.anterior) / item.anterior) * 100 : item.atual > 0 ? 100 : 0;
                const isPositive = variation >= 0;
                
                return (
                  <tr key={item.month} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 pr-4 font-medium text-teal dark:text-white">{item.month}</td>
                    <td className="py-4 px-4 font-bold text-teal dark:text-white">
                      {formatCurrency(item.atual)}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.anterior)}
                    </td>
                    <td className="py-4 px-4 font-bold text-mint">
                      {formatCurrency(item.economia)}
                    </td>
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isPositive ? 'text-mint' : 'text-red-500'}`}>
                          {isPositive ? '+' : ''}{variation.toFixed(1)}%
                        </span>
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-mint" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {monthlyComparison.length === 0 && (
            <div className="p-8 text-center text-gray-400">Sem dados suficientes para comparação anual.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReportsView;
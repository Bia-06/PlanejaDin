import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, PieChart as PieChartIcon, Download, Filter
} from 'lucide-react'; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ComposedChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import Card from './UI/Card';
import Button from './UI/Button';
import { formatCurrency } from '../utils/formatters';
import { THEME, CHART_COLORS } from '../config/constants';

const ReportsView = ({ transactions = [] }) => {
  const [timeRange, setTimeRange] = useState('currentMonth'); 
  const [chartType, setChartType] = useState('composed');

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
      .map(([name, value], index) => ({
        name,
        value,
        color: CHART_COLORS[index % CHART_COLORS.length] 
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

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
  
  const savingsRate = totalIncome > 0 ? ((totalProfit / totalIncome) * 100).toFixed(1) : '0.0';

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
          <h2 className="text-2xl font-bold text-teal dark:text-white font-poppins">Relatórios de Crescimento</h2>
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
              <option value="all" className="dark:bg-gray-800">Todo período</option>
            </select>
          </div>
          
          <Button 
            onClick={handleExport}
            variant="secondary"
            className="text-sm"
          >
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Receitas Totais</p>
              <p className="text-1 font-bold text-mint truncate">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="p-2 md:p-3 bg-mint/10 rounded-full shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-mint" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">No período selecionado</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Taxa Economia</p>
              <p className="text-1 font-bold truncate" style={{ color: '#60A5FA' }}>{savingsRate}%</p>
            </div>
            <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full shrink-0">
              <PieChartIcon className="w-5 h-5 md:w-6 md:h-6" style={{ color: '#60A5FA' }} />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">Da sua renda</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Lucro Líquido</p>
              <p className="text-1 font-bold text-yellow truncate">{formatCurrency(totalProfit)}</p>
            </div>
            <div className="p-2 md:p-3 bg-yellow/10 rounded-full shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-yellow" />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">No período selecionado</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Categorias</p>
              <p className="text-l font-bold text-purple-500 truncate">{categoryData.length}</p>
            </div>
            <div className="p-2 md:p-3 bg-purple-500/10 rounded-full shrink-0">
              <span className="text-purple-500 font-bold text-lg md:text-xl">{categoryData.length}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 truncate">Ativas no período</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-2">
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
                <ComposedChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="displayDate" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value/1000}k`}
                    width={40} 
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="Receitas" fill={THEME.mint} radius={[6, 6, 0, 0]} barSize={20} name="Receitas" />
                  <Bar dataKey="Despesas" fill={THEME.teal} radius={[6, 6, 0, 0]} barSize={20} name="Despesas" />
                  <Line type="monotone" dataKey="Lucro" stroke={THEME.yellow} strokeWidth={3} dot={{ r: 4, fill: THEME.yellow }} activeDot={{ r: 6 }} name="Lucro" />
                </ComposedChart>
              ) : chartType === 'area' ? (
                <AreaChart data={evolutionData}>
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
                  <YAxis tickFormatter={(value) => `R$${value/1000}k`} tick={{ fill: '#94a3b8' }} width={40} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Area type="monotone" dataKey="Receitas" stroke={THEME.mint} fill="url(#colorReceitas)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Despesas" stroke={THEME.teal} fill="url(#colorDespesas)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis dataKey="displayDate" tick={{ fill: '#94a3b8' }} />
                  <YAxis tickFormatter={(value) => `R$${value/1000}k`} tick={{ fill: '#94a3b8' }} width={40} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend />
                  <Bar dataKey="Receitas" fill={THEME.mint} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Despesas" fill={THEME.teal} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-teal dark:text-white">Distribuição de Gastos</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Por categoria (Período)</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="font-bold text-teal dark:text-white">{formatCurrency(totalExpensesCat)}</p>
            </div>
          </div>
          
          <div className="h-[300px] md:h-[380px]">
            {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Pie
                    data={categoryData}
                    cx="50%"
                    cy="51%"
                    innerRadius={60}
                    outerRadius={90} 
                    paddingAngle={3}
                    dataKey="value"
                    label={(entry) => `${entry.name}`}
                    labelLine={true}
                    >
                    {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend 
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '0px', fontSize: '12px' }} 
                    formatter={(value) => <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{value}</span>}
                    />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <PieChartIcon className="w-10 h-10 mb-2 opacity-50" />
                    <p>Sem despesas neste período</p>
                </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-teal dark:text-white">Evolução do Lucro</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo líquido no período</p>
          </div>
          
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={THEME.yellow} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={THEME.yellow} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Lucro']}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="Lucro" stroke={THEME.yellow} strokeWidth={3} fill="url(#colorLucro)" activeDot={{ r: 6, fill: THEME.yellow }} />
              </AreaChart>
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
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, Zap, AlertTriangle, RefreshCw, Clock, DollarSign, GitCommit, Settings, Wind, X, Newspaper
} from 'lucide-react';

// THEME CONSTS
const BG_DEEP_DARK = '#0A132C';
const CARD_BASE = '#1C294A';
const ACCENT_PRIMARY = '#05369D';
const ACCENT_NEON = '#4B8BF5';
const FORECAST_COLOR = '#FACC15';
const TEXT_LIGHT = '#E0E7FF';
const KEY_INFO_COLOR = '#00D5AA';
const KEY_INFO_TEXT = '#0A132C';

const COMPANY_META = {
  "AAPL": { name: "Apple Inc.", logo: "https://logo.clearbit.com/apple.com" },
  "MSFT": { name: "Microsoft Corp.", logo: "https://logo.clearbit.com/microsoft.com" },
  "GOOGL": { name: "Alphabet Inc.", logo: "https://logo.clearbit.com/google.com" },
  "AMZN": { name: "Amazon.com Inc.", logo: "https://logo.clearbit.com/amazon.com" },
  "TSLA": { name: "Tesla Inc.", logo: "https://logo.clearbit.com/tesla.com" },
  "META": { name: "Meta Platforms Inc.", logo: "https://logo.clearbit.com/meta.com" },
  "NVDA": { name: "NVIDIA Corp.", logo: "https://logo.clearbit.com/nvidia.com" },
  "NFLX": { name: "Netflix Inc.", logo: "https://logo.clearbit.com/netflix.com" },
};

const BentoCard = ({ title, children, className = '', style, onClick }) => (
  <div className={`rounded-xl shadow-2xl p-4 overflow-hidden relative ${className}`} style={{ backgroundColor: CARD_BASE, ...style }} onClick={onClick}>
    {title && <h3 className="text-md font-semibold mb-2 text-gray-300 border-b border-gray-700/50 pb-1">{title}</h3>}
    {children}
  </div>
);

const StockLogo = ({ imageUrl, className = '' }) => (
  <img
    src={imageUrl || 'https://via.placeholder.com/40/FFFFFF/000000?text=S'}
    alt="Stock Logo"
    className={className}
    onError={(e) => { e.target.src = 'https://via.placeholder.com/40/FFFFFF/000000?text=S'; }}
  />
);

const MetricBox = ({ label, value, color = 'text-gray-300', icon: Icon, valueColor = 'text-white' }) => (
  <div className='flex flex-col items-center justify-center p-2 rounded-lg' style={{ minWidth: 90 }}>
    <div className={`flex items-center text-xs uppercase ${color}`}>
      {Icon && <Icon className='w-4 h-4 mr-1' />} {label}
    </div>
    <p className={`text-xl font-bold mt-1 ${valueColor}`}>{value}</p>
  </div>
);

function getIndoMonth(monthIndex) {
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return months[monthIndex] ?? months[0];
}

const StockDetailModal = ({ isOpen, onClose, stock, chartData, signal, isPositive, diff }) => {
  if (!isOpen || !stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-6 rounded-2xl shadow-neon custom-scrollbar"
        style={{ backgroundColor: CARD_BASE, border: `3px solid ${ACCENT_NEON}`, color: TEXT_LIGHT, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start border-b pb-3 border-gray-700 sticky top-0" style={{ backgroundColor: CARD_BASE }}>
          <h2 className="text-3xl font-extrabold flex items-center" style={{ color: ACCENT_NEON }}>
            <StockLogo imageUrl={stock.logoUrl} className="w-8 h-8 rounded-full bg-white p-1 mr-3" />
            {stock.code} Detailed Analysis
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: ACCENT_PRIMARY }}>
            <h3 className="text-xl font-semibold mb-2">Real-time Metrics</h3>
            <p className="text-4xl font-bold">${Number(stock.price).toLocaleString()}</p>
            <p className={`text-lg font-medium mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className='w-5 h-5 inline mr-1' /> : <TrendingDown className='w-5 h-5 inline mr-1' />} {diff}% Change
            </p>
          </div>

          <div className="p-4 rounded-lg flex flex-col justify-between" style={{ backgroundColor: CARD_BASE, border: `1px solid ${FORECAST_COLOR}` }}>
            <p className="text-sm uppercase text-gray-400">Volatility & Anomaly</p>
            <p className="text-3xl font-black mt-1 text-blue-400">{stock.volatility_regime}</p>
            <p className="text-sm text-gray-300">Anomaly: <span className={`font-bold ${stock.anomaly_status === 'ANOMALI' ? 'text-yellow-500' : 'text-green-500'}`}>{stock.anomaly_status}</span></p>
          </div>
        </div>

        <div className="mt-4 h-64 w-full p-4 rounded-lg" style={{ backgroundColor: CARD_BASE }}>
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Historical Trend</h3>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="modalHistorical" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT_NEON} stopOpacity={0.8} /><stop offset="95%" stopColor={ACCENT_NEON} stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#555" tickFormatter={(v) => `$${v.toLocaleString()}`} domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
              <CartesianGrid strokeDasharray="4 4" stroke="#333" />
              <Area type="monotone" dataKey="price" stroke={ACCENT_NEON} fillOpacity={1} fill="url(#modalHistorical)" dot={false} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [stockList, setStockList] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [currentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getFutureDate = (days) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + days);
    return `${d.getDate()} ${getIndoMonth(d.getMonth()).substring(0, 3)}`;
  };

  const fetchData = useCallback(async () => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zslavmlvziafuekhtumg.supabase.co';
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_9zgURzER2MjP6Yd-wS7qzw_wlEx8RdP';

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.warn('❌ Supabase env variables missing!');
        console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY in .env');
        throw new Error('Missing Supabase config');
      }

      console.log('🔗 Connecting to Supabase:', SUPABASE_URL);

      // Fetch latest data per symbol dari Supabase
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/stock_prices?select=symbol,open,high,low,close,datetime&order=datetime.desc&limit=100`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Supabase API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Data dari Supabase:', data);

      if (!data || data.length === 0) {
        console.warn('Tidak ada data di Supabase, menggunakan dummy data');
        throw new Error('No data');
      }

      // Group by symbol & ambil data terbaru per stock
      const groupedBySymbol = {};
      data.forEach(row => {
        const symbol = row.symbol || 'UNK';
        if (!groupedBySymbol[symbol]) groupedBySymbol[symbol] = [];
        groupedBySymbol[symbol].push(row);
      });

      const tempStockList = Object.entries(groupedBySymbol)
        .slice(0, 11)
        .map(([symbol, rows]) => {
          const latest = rows[0];
          const simulatedChange = (latest.close / latest.open - 1) || (Math.random() - 0.5) * 0.02;
          const simulatedVolatility = (latest.high - latest.low) / latest.close || Math.random() * 0.05;
          
          return {
            id: symbol,
            code: symbol,
            name: COMPANY_META[symbol]?.name ?? `Stock ${symbol}`,
            logoUrl: COMPANY_META[symbol]?.logo ?? 'https://via.placeholder.com/40/FFFFFF/000000?text=S',
            price: Number(latest.close || 0),
            open: Number(latest.open || 0),
            high: Number(latest.high || 0),
            low: Number(latest.low || 0),
            change: simulatedChange,
            volatility: simulatedVolatility,
            anomaly_status: simulatedVolatility >= 0.05 ? 'ANOMALI' : 'NORMAL',
            volatility_regime: simulatedVolatility >= 0.03 ? 'HIGH VOL' : 'LOW VOL',
            historyData: rows,
          };
        });

      setStockList(tempStockList);
      if (!selectedStock && tempStockList.length > 0) setSelectedStock(tempStockList[0]);
      setIsLoaded(true);

    } catch (err) {
      console.error('Error fetching from Supabase:', err);
      // Fallback ke dummy data
      const dummyStocks = Object.keys(COMPANY_META).map((code, index) => ({
        id: code,
        code,
        name: COMPANY_META[code].name,
        logoUrl: COMPANY_META[code].logo,
        price: 4000 + (index * 50) + Math.round(Math.random() * 50),
        change: (Math.random() - 0.5) * 0.02,
        volatility: Math.random() * 0.05,
        anomaly_status: index === 3 ? 'ANOMALI' : 'NORMAL',
        volatility_regime: index % 2 === 0 ? 'LOW VOL' : 'HIGH VOL',
        open: 3950 + (index * 50),
        high: 4050 + (index * 50),
        low: 3850 + (index * 50),
        historyData: [],
      }));
      setStockList(dummyStocks);
      if (!selectedStock && dummyStocks.length > 0) setSelectedStock(dummyStocks[0]);
      setIsLoaded(true);
    }
  }, [selectedStock]);

  const fetchChartAndNews = useCallback(async () => {
    if (!selectedStock) return;

    try {
      const SUPABASE_URL = 'https://zslavmlvziafuekhtumg.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzbGF2bWx2emlhZnVla2h0dW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTM2MzAsImV4cCI6MjA4MDMyOTYzMH0.zU0IscsAA5gk0JEEgYkW3WITCQoPrmKvW4UCQxqUs0I';

      // Fetch news untuk stock yang dipilih
      const newsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/news?select=*&symbol=eq.${selectedStock.code}&order=created_at.desc&limit=10`,
        {
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
          }
        }
      );

      let newsData = [];
      if (newsResponse.ok) {
        const newsJson = await newsResponse.json();
        newsData = newsJson.map(n => ({
          id: n.id,
          title: n.title,
          source: n.source || 'Market News',
          sentiment: n.sentiment || 'neutral',
          time: new Date(n.created_at).toLocaleDateString('id-ID'),
        }));
      }

      setNewsData(newsData.length > 0 ? newsData : [
        { id: 1, title: `Harga ${selectedStock.code} diprediksi naik dalam 5 hari ke depan.`, source: 'AI Model', sentiment: 'positive', time: 'Just now' },
        { id: 2, title: `Volatilitas tinggi terdeteksi hari ini.`, source: 'System Alert', sentiment: 'neutral', time: '1 jam lalu' },
        { id: 3, title: `Trading volume meningkat 25%.`, source: 'Market Data', sentiment: 'positive', time: '2 jam lalu' },
      ]);
    } catch (err) {
      console.error('Error fetching news:', err);
      setNewsData([
        { id: 1, title: `Harga ${selectedStock.code} diprediksi naik dalam 5 hari ke depan.`, source: 'AI Model', sentiment: 'positive', time: 'Just now' },
        { id: 2, title: `Volatilitas tinggi terdeteksi hari ini.`, source: 'System Alert', sentiment: 'neutral', time: '1 jam lalu' },
        { id: 3, title: `Trading volume meningkat 25%.`, source: 'Market Data', sentiment: 'positive', time: '2 jam lalu' },
      ]);
    }

    // Generate chart data dari historyData
    const forecastDays = 5;
    const history = [];
    const forecast = [];
    let lastPrice = selectedStock.price;

    const historicalDays = 30;
    for (let i = historicalDays; i >= 1; i--) {
      const d = new Date(currentDate);
      d.setDate(currentDate.getDate() - i);
      const price = Math.round(selectedStock.price * (1 + (Math.random() - 0.5) * 0.05));
      history.push({ 
        day: `${d.getDate()} ${getIndoMonth(d.getMonth()).substring(0, 3)}`, 
        price, 
        type: 'Historical', 
        forecast: null 
      });
    }
    lastPrice = history[history.length - 1]?.price || selectedStock.price;

    for (let i = 1; i <= forecastDays; i++) {
      lastPrice = Math.round(lastPrice * (1 + (Math.random() * 0.01 * (selectedStock.change > 0 ? 1.5 : -1))));
      forecast.push({ 
        day: getFutureDate(i), 
        price: null, 
        forecast: lastPrice, 
        type: 'Forecast' 
      });
    }

    setChartData([...history, ...forecast]);

  }, [selectedStock, currentDate]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { fetchChartAndNews(); }, [selectedStock, fetchChartAndNews]);

  const { diff, signal, isPositive } = useMemo(() => {
    const change = selectedStock?.change || 0;
    const s = change > 0.01 ? 'BUY' : change < -0.01 ? 'SELL' : 'HOLD';
    return { diff: (change * 100).toFixed(2), signal: s, isPositive: change >= 0 };
  }, [selectedStock]);

  const cnbcSentimentData = useMemo(() => {
    if (newsData.length === 0) return [
      { name: 'Pos', value: 40, color: '#34D399' }, 
      { name: 'Neg', value: 30, color: '#F87171' }, 
      { name: 'Neu', value: 30, color: '#60A5FA' }
    ];
    const counts = newsData.reduce((acc, n) => ({ ...acc, [n.sentiment]: (acc[n.sentiment] || 0) + 1 }), {});
    const total = newsData.length || 1;
    return [
      { name: 'Pos', value: Math.round(((counts.positive || 0) / total) * 100), color: '#34D399' },
      { name: 'Neg', value: Math.round(((counts.negative || 0) / total) * 100), color: '#F87171' },
      { name: 'Neu', value: Math.round(((counts.neutral || 0) / total) * 100), color: '#60A5FA' },
    ].filter(d => d.value >= 0);
  }, [newsData]);

  const sentimentTotal = cnbcSentimentData.reduce((sum, item) => sum + item.value, 0);

  const handleCardClick = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  if (!isLoaded || !selectedStock) return (
    <div className="h-screen flex items-center justify-center" style={{ backgroundColor: BG_DEEP_DARK, color: TEXT_LIGHT }}>
      <RefreshCw className="animate-spin mr-2" /> Loading Dashboard...
    </div>
  );

  const signalColor = signal === 'BUY' ? '#34D399' : signal === 'SELL' ? '#F87171' : '#FACC15';
  const isAnomaly = selectedStock.anomaly_status === 'ANOMALI';
  const anomalyColor = isAnomaly ? '#FBBF24' : '#34D399';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload.find(p => p.value !== null);
      if (!dataPoint) return null;
      const priceValue = Number(dataPoint.value || dataPoint.payload?.price || dataPoint.payload?.forecast || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const isForecast = dataPoint.dataKey === 'forecast' || dataPoint.payload?.type === 'Forecast';

      return (
        <div className="p-3 rounded-lg shadow-lg text-sm" style={{ backgroundColor: CARD_BASE, border: `1px solid ${isForecast ? FORECAST_COLOR : ACCENT_NEON}80` }}>
          <p className="font-bold text-gray-300">
            {label}
            <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded ${isForecast ? 'bg-yellow-600/50' : 'bg-blue-600/50'}`}>
              {isForecast ? 'Forecast' : 'Historical'}
            </span>
          </p>
          <p className="text-white mt-1">
            <DollarSign className='w-3 h-3 inline mr-1 text-green-400' />
            {`Price : $${priceValue}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const RecentNewsFeed = () => (
    <BentoCard
      className="col-span-4 row-span-4 p-4 flex flex-col cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#0A132C] hover:ring-purple-500 transition-all duration-300"
      title="Recent Activities / News Feed"
      style={{ border: `1px solid #7C3AED` }}
      onClick={() => handleCardClick(selectedStock)}
    >
      <div className='flex-1 overflow-y-auto pr-2 space-y-3'>
        {newsData.length > 0 ? (
          newsData.map((news) => {
            const sentimentColor = news.sentiment === 'positive' ? 'bg-green-600' : news.sentiment === 'negative' ? 'bg-red-600' : 'bg-blue-600';
            const sentimentText = (news.sentiment || '').toUpperCase();
            return (
              <div key={news.id} className='p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors'>
                <div className='flex justify-between items-start text-xs'>
                  <p className='font-semibold text-white'>{news.source}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white ${sentimentColor}`}>{sentimentText}</span>
                </div>
                <p className='text-sm mt-1 text-gray-200'>{news.title}</p>
                <p className='text-xs text-gray-500 mt-1 flex items-center'><Clock className='w-3 h-3 mr-1' /> {news.time}</p>
              </div>
            );
          })
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <Newspaper className='w-10 h-10 text-gray-500 mb-2' />
            <p className='text-gray-400'>No recent news data.</p>
          </div>
        )}
      </div>
    </BentoCard>
  );

  return (
    <div className='h-screen w-full p-2 sm:p-4 font-sans overflow-hidden' style={{ backgroundColor: BG_DEEP_DARK, color: TEXT_LIGHT }}>
      <div className="w-full mb-4 px-4 py-2 flex gap-4 overflow-x-auto" style={{ backgroundColor: CARD_BASE, borderRadius: '12px' }}>
        {stockList.map(stock => (
          <button
            key={stock.code}
            onClick={() => setSelectedStock(stock)}
            className='flex-shrink-0 flex items-center justify-center p-2 rounded-xl transition-all duration-300'
            style={{ 
              backgroundColor: selectedStock.code === stock.code ? ACCENT_PRIMARY : 'transparent', 
              minWidth: '80px', 
              boxShadow: selectedStock.code === stock.code ? `0 0 10px ${ACCENT_NEON}50` : 'none',
              opacity: selectedStock.code === stock.code ? 1 : 0.7
            }}
          >
            <StockLogo imageUrl={stock.logoUrl} className="w-8 h-8 rounded-full bg-white p-1" />
            <span className="font-bold text-sm ml-2">{stock.code}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 grid-rows-12 gap-3 h-[calc(100vh-100px)] w-full max-w-[1920px] mx-auto">
        <BentoCard
          className="col-span-8 row-span-2 p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow duration-300"
          style={{
            backgroundColor: ACCENT_PRIMARY,
            border: `3px solid ${ACCENT_NEON}`,
            color: TEXT_LIGHT,
            boxShadow: `0 0 20px ${ACCENT_NEON}80`
          }}
          onClick={() => handleCardClick(selectedStock)}
        >
          <div className='flex items-center flex-1'>
            <StockLogo imageUrl={selectedStock.logoUrl} className="w-16 h-16 rounded-full bg-white p-1 mr-4 shadow-xl" />
            <div className='text-left'>
              <h1 className="text-xl font-light text-blue-200">{selectedStock.code}</h1>
              <p className="text-4xl font-black tracking-tight" style={{ color: TEXT_LIGHT }}>{selectedStock.name}</p>
            </div>
          </div>

          <div className='text-right flex flex-col justify-center items-end'>
            <p className="text-sm font-light text-blue-200">{currentDate.toDateString()}</p>
            <h2 className="text-4xl font-bold mt-1">${selectedStock.price.toLocaleString()}</h2>
            <span className={`text-md font-bold px-3 py-1 rounded-full mt-1 inline-flex items-center ${isPositive ? 'bg-green-700/50 text-green-300' : 'bg-red-700/50 text-red-300'}`}>
              {isPositive ? <TrendingUp className='w-4 h-4 mr-1' /> : <TrendingDown className='w-4 h-4 mr-1' />} {diff}%
            </span>
          </div>
        </BentoCard>

        <BentoCard
          className="col-span-4 row-span-2 p-4 flex items-center justify-around cursor-pointer hover:shadow-2xl transition-shadow duration-300"
          title="Key Information"
          style={{
            backgroundColor: KEY_INFO_COLOR,
            color: KEY_INFO_TEXT,
            border: `2px solid ${KEY_INFO_TEXT}`
          }}
          onClick={() => handleCardClick(selectedStock)}
        >
          <MetricBox label="Price" value={`$${selectedStock.price.toLocaleString()}`} color="text-gray-900" icon={DollarSign} valueColor="text-gray-900" />
          <MetricBox label="Change" value={`${diff}%`} color="text-gray-900" icon={GitCommit} valueColor={isPositive ? 'text-green-700' : 'text-red-700'} />
          <MetricBox label="Regime" value={selectedStock.volatility_regime} color="text-gray-900" icon={Zap} valueColor="text-gray-900" />
        </BentoCard>

        <BentoCard className="col-span-4 row-span-2 p-4 cursor-pointer hover:opacity-90 transition-opacity duration-300"
          title="News Sentiment Breakdown (30D)"
          style={{ backgroundColor: '#4769c8', border: `1px solid #7394d9` }}
          onClick={() => handleCardClick(selectedStock)}
        >
          <div className="h-full w-full pt-4 flex flex-col justify-center items-center">
            {sentimentTotal > 0 ? (
              <ResponsiveContainer width="95%" height="80%">
                <BarChart data={cnbcSentimentData} layout="vertical">
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="#AABFFD" tick={{ fill: '#E0E7FF', fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: CARD_BASE, border: `1px solid ${ACCENT_NEON}`, color: TEXT_LIGHT }} formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {cnbcSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className='text-gray-400'>No sentiment data</p>
            )}
          </div>
        </BentoCard>

        <BentoCard className="col-span-4 row-span-2 p-6 flex flex-col justify-center items-center cursor-pointer hover:shadow-neon-lg transition-shadow duration-300"
          title="AI Trend Prediction (5-Day)"
          style={{ border: `1px solid ${ACCENT_NEON}50` }}
          onClick={() => handleCardClick(selectedStock)}
        >
          <div className='text-center'>
            <p className="text-sm uppercase text-gray-400">Recommended Action</p>
            <h2 className="text-5xl font-black tracking-tighter mt-2" style={{ color: signalColor }}>{signal}</h2>
            <p className="text-sm uppercase text-gray-400 mt-2">Trend Over 5 Days</p>
            <h2 className="text-4xl font-black tracking-tighter" style={{ color: signalColor }}>{signal === 'BUY' ? 'UP' : signal === 'SELL' ? 'DOWN' : 'FLAT'}</h2>
          </div>
        </BentoCard>

        <BentoCard className="col-span-2 row-span-2 p-4 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity duration-300" title="Anomaly" style={{ color: TEXT_LIGHT, border: `1px solid ${anomalyColor}` }} onClick={() => handleCardClick(selectedStock)}>
          <div className='flex justify-between items-center'>
            <p className='text-xl font-black' style={{ color: anomalyColor }}>{selectedStock.anomaly_status}</p>
            <AlertTriangle className='w-6 h-6' style={{ color: anomalyColor }} />
          </div>
          <p className='text-xs font-medium mt-1'>{isAnomaly ? 'Volume/Price Spike.' : 'Normal Trading Range.'}</p>
        </BentoCard>

        <BentoCard className="col-span-2 row-span-2 p-4 flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity duration-300" title="Regime" style={{ color: TEXT_LIGHT, border: `1px solid ${ACCENT_NEON}` }} onClick={() => handleCardClick(selectedStock)}>
          <div className='flex justify-between items-center'>
            <p className='text-xl font-black' style={{ color: ACCENT_NEON }}>{selectedStock.volatility_regime}</p>
            <Wind className='w-6 h-6' style={{ color: ACCENT_NEON }} />
          </div>
          <p className='text-xs font-medium mt-1'>Vol Index: <strong>{selectedStock.volatility.toFixed(4)}</strong>.</p>
        </BentoCard>

        <BentoCard className="col-span-8 row-span-6 p-2 relative cursor-pointer hover:border-white transition-colors duration-300"
          title="Chart Historical & Forecast (30D + 5D)"
          style={{ border: `1px solid ${ACCENT_NEON}80` }}
          onClick={() => handleCardClick(selectedStock)}
        >
          <div className="w-full h-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={ACCENT_NEON} stopOpacity={0.8} /><stop offset="95%" stopColor={ACCENT_NEON} stopOpacity={0} /></linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={FORECAST_COLOR} stopOpacity={0.6} /><stop offset="95%" stopColor={FORECAST_COLOR} stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#555" tickFormatter={(v) => `$${v.toLocaleString()}`} domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                <CartesianGrid strokeDasharray="4 4" stroke="#333" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="price" stroke={ACCENT_NEON} fillOpacity={1} fill="url(#colorHistorical)" dot={false} strokeWidth={3} />
                <Area type="monotone" dataKey="forecast" stroke={FORECAST_COLOR} fillOpacity={1} fill="url(#colorForecast)" dot={false} strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        <BentoCard className="col-span-4 row-span-4 p-4 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#0A132C] hover:ring-blue-500 transition-all duration-300" title="Strategy Simulator" style={{ border: `1px solid ${ACCENT_PRIMARY}` }} onClick={() => handleCardClick(selectedStock)}>
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between items-center text-sm'>
              <Settings className='w-5 h-5 text-gray-400' />
              <span className='font-semibold'>Backtest Setting</span>
              <button className='bg-blue-600/50 hover:bg-blue-500/50 text-xs py-1 px-3 rounded-full'>Configure</button>
            </div>
            <div className='p-3 rounded-lg bg-gray-700/30'>
              <p className='text-xs text-gray-400'>Last Simulation: <strong>Trend Following (200D MA)</strong></p>
              <p className='text-lg font-bold text-yellow-400 mt-1'>+12.5% Return (Sim.)</p>
            </div>
            <div className='text-center'>
              <button className='w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg font-bold flex items-center justify-center text-white'>
                <RefreshCw className='w-4 h-4 mr-2' /> Run Simulation
              </button>
            </div>
          </div>
        </BentoCard>

        <RecentNewsFeed />

        <BentoCard className="col-span-8 row-span-2 p-4 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-[#0A132C] hover:ring-blue-500 transition-all duration-300" title="Statistik Deskriptif & Volatilitas" style={{ backgroundColor: '#031742', border: `1px solid ${ACCENT_PRIMARY}` }} onClick={() => handleCardClick(selectedStock)}>
          <div className='grid grid-cols-4 gap-4 text-sm text-gray-300 h-full items-center'>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Open</p>
              <p className='font-bold text-xl mt-1'>${selectedStock.open.toFixed(2)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>High</p>
              <p className='font-bold text-xl mt-1 text-green-400'>${selectedStock.high.toFixed(2)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Low</p>
              <p className='font-bold text-xl mt-1 text-red-400'>${selectedStock.low.toFixed(2)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Vol.</p>
              <p className='font-bold text-xl mt-1'>{selectedStock.volatility.toFixed(4)}</p>
            </div>
          </div>
        </BentoCard>

      </div>
      <StockDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stock={selectedStock}
        chartData={chartData}
        signal={signal}
        isPositive={isPositive}
        diff={diff}
      />
    </div>
  );
};

export default App;
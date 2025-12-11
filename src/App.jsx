import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { 
<<<<<<< HEAD
  TrendingUp, TrendingDown, Zap, AlertTriangle, ShieldHalf, RefreshCw, Menu, Wind, Clock, User, DollarSign, Activity, GitCommit
} from 'lucide-react';

// --- IMPORT DARI FOLDER LAIN ---
import { supabase } from './services/supabaseClient'; 
// Asumsi COMPANY_META sekarang ada di file ini atau sudah dimodifikasi
// import { COMPANY_META } from './config/constants';
import { formatFullDate, getIndoMonth } from './utils/formatters';
import BentoCard from './components/BentoCard';
// StockLogo sekarang menerima URL
import StockLogo from './components/StockLogo'; 
=======
  TrendingUp, TrendingDown, Zap, AlertTriangle, RefreshCw, 
  Menu, Wind, DollarSign, Clock 
} from 'lucide-react';

// --- IMPORT DARI FOLDER LAIN ---
import { supabase } from './services/supabaseClient';
import { COMPANY_META, SENTIMENT_COLORS } from './config/constants';
import { formatFullDate, getIndoMonth } from './utils/formatters';
import BentoCard from './components/BentoCard';
import StockLogo from './components/StockLogo';
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5

// --- THEME CONSTANTS (Agar sesuai dengan style JSX Anda) ---
const BG_DEEP_DARK = '#0B1221';
const CARD_BASE = '#151E32';
const TEXT_LIGHT = '#E2E8F0';
const ACCENT_PRIMARY = '#3B82F6'; // Blue
const ACCENT_NEON = '#60A5FA';    // Light Blue

// --- KONSTANTA SAHAM BARU & SIMULASI LOGO ---
const STOCKS_TO_FETCH = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
    "META", "NVDA", "NFLX", "AMD", "BABA", "CRM" // Tambahan
];

// Simulasi Data Meta (Gantilah dengan URL logo nyata jika ada)
const COMPANY_META = {
    "AAPL": { name: "Apple Inc.", logo: "https://logo.clearbit.com/apple.com" },
    "MSFT": { name: "Microsoft Corp.", logo: "https://logo.clearbit.com/microsoft.com" },
    "GOOGL": { name: "Alphabet Inc.", logo: "https://logo.clearbit.com/google.com" },
    "AMZN": { name: "Amazon.com Inc.", logo: "https://logo.clearbit.com/amazon.com" },
    "TSLA": { name: "Tesla Inc.", logo: "https://logo.clearbit.com/tesla.com" },
    "META": { name: "Meta Platforms Inc.", logo: "https://logo.clearbit.com/meta.com" },
    "NVDA": { name: "NVIDIA Corp.", logo: "https://logo.clearbit.com/nvidia.com" },
    "NFLX": { name: "Netflix Inc.", logo: "https://logo.clearbit.com/netflix.com" },
    "AMD": { name: "Advanced Micro Devices", logo: "https://logo.clearbit.com/amd.com" },
    "BABA": { name: "Alibaba Group Holding", logo: "https://logo.clearbit.com/alibaba.com" },
    "CRM": { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
};

const App = () => {
  // --- STATE MANAGEMENT ---
  const [stockList, setStockList] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [currentDate] = useState(new Date());

<<<<<<< HEAD
  // --- DATA FETCHING (DIREVISI UNTUK ANOMALI & LOGO) ---
  const fetchMarketData = useCallback(async () => {
    try {
      const codes = STOCKS_TO_FETCH;
      let tempStockList = [];

      for (const code of codes) {
        // --- SIMULASI DATA FETCHING ---
        // Asumsi data ini sudah diolah dengan IsolationForest di Backend/Python
        const price = Math.floor(Math.random() * 5000) + 1000;
        const change = Math.random() * 0.05 - 0.02;
        const volatility = Math.random() * 0.05;

        // Simulasi Anomali & Regim (Berdasarkan Logika IsolationForest/Volatilitas)
        const isAnomaly = Math.random() < 0.1; // 10% peluang Anomali
        const anomalyStatus = isAnomaly ? 'ANOMALI' : 'NORMAL';
        const volatilityRegime = volatility >= 0.03 ? 'HIGH VOL' : 'LOW VOL';

        tempStockList.push({
          code: code,
          name: COMPANY_META[code]?.name || 'Unknown Company',
          logoUrl: COMPANY_META[code]?.logo, // Tambahkan URL Logo
          price: price,
          change: change,
          volatility: volatility,
          anomaly_status: anomalyStatus, // Data Anomali
          volatility_regime: volatilityRegime // Data Regim
        });
      }
      
      setStockList(tempStockList);
      if (!selectedStock && tempStockList.length > 0) {
        setSelectedStock(tempStockList[0]);
      }
    } catch (err) { console.error(err); }
=======
  // --- 1. FETCH MARKET DATA (Daftar Saham & Harga Terbaru) ---
  const fetchMarketData = useCallback(async () => {
    try {
        const codes = Object.keys(COMPANY_META);
        let tempStockList = [];

        // Ambil harga terakhir dari tabel history (stock_prices)
        for (const code of codes) {
            const { data } = await supabase
                .from('stock_prices')
                .select('close')
                .eq('symbol', code)
                .order('date', { ascending: false })
                .limit(1);
            
            const price = data && data.length > 0 ? data[0].close : 0;
            
            tempStockList.push({
                code: code,
                name: COMPANY_META[code].name,
                type: COMPANY_META[code].type,
                price: price,
            });
        }
        
        setStockList(tempStockList);
        
        // Default pilih saham pertama jika belum ada yang dipilih
        if (!selectedStock && tempStockList.length > 0) {
            setSelectedStock(tempStockList[0]);
        }
    } catch (err) { console.error("Error fetching market data:", err); }
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
  }, [selectedStock]);

  // --- 2. FETCH CHART DATA (Grafik Historis) ---
  const fetchChartData = useCallback(async () => {
<<<<<<< HEAD
      if (!selectedStock) return;
      const dummyData = Array(30).fill(0).map((_, i) => ({
          day: `${i + 1} ${getIndoMonth(new Date().getMonth()).substring(0, 3)}`,
          price: Math.round(selectedStock.price * (1 + (Math.random() - 0.5) * 0.1)), 
          forecast: null
      })).reverse();
      setChartData(dummyData);
=======
    if (!selectedStock) return;
    
    // Ambil 30 hari terakhir dari tabel stock_prices
    const { data: historyData } = await supabase
        .from('stock_prices') 
        .select('date, close')
        .eq('symbol', selectedStock.code)
        .order('date', { ascending: false })
        .limit(30);

    if (historyData && historyData.length > 0) {
        // Format data untuk Recharts
        const mappedData = historyData.reverse().map(item => ({
            day: formatFullDate(item.date),
            price: item.close,
        }));
        setChartData(mappedData);
    } else {
        setChartData([]);
    }
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
  }, [selectedStock]);

  // --- 3. FETCH NEWS (Berita & Sentimen) ---
  const fetchNews = useCallback(async () => {
<<<<<<< HEAD
      if (!selectedStock) return;
      const dummyNews = [
        { id: 1, title: `Harga ${selectedStock.code} diprediksi naik setelah rilis laporan Q3.`, source: 'News Source A', sentiment: 'positive' },
        { id: 2, title: `Volatilitas pasar menahan laju pertumbuhan sektor teknologi.`, source: 'Tech Daily', sentiment: 'neutral' },
        { id: 3, title: `Analisis teknikal menunjukkan sinyal jual kuat untuk ${selectedStock.code}.`, source: 'Market Insight', sentiment: 'negative' },
        { id: 4, title: `Regime pasar menunjukkan tren sideways jangka pendek.`, source: 'Algo Report', sentiment: 'neutral' },
        { id: 5, title: `Investor asing kembali melakukan aksi beli besar-besaran.`, source: 'IDX Watch', sentiment: 'positive' },
      ];
      setNewsData(dummyNews);
=======
    if (!selectedStock) return;
    
    // Ambil berita dari tabel news_sentiment
    let { data } = await supabase
        .from('news_sentiment')
        .select('*')
        .eq('symbol', selectedStock.code) 
        .order('published_at', { ascending: false })
        .limit(10);

    const mappedNews = data ? data.map(n => ({
        id: n.id,
        title: n.title,
        source: n.source || 'News Source',
        sentiment: n.sentiment_label ? n.sentiment_label.toLowerCase() : 'neutral',
    })) : [];
    setNewsData(mappedNews);
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
  }, [selectedStock]); 

  // --- INITIAL EFFECTS ---
  useEffect(() => { fetchMarketData(); }, []);
  
  useEffect(() => {
    if (selectedStock) { 
        fetchChartData(); 
        fetchNews(); 
    }
  }, [selectedStock, fetchChartData, fetchNews]);

  // --- LOGIC: ANALISIS DATA (MEMO) ---
  
  // 1. Hitung Volatilitas & Regime (Simulasi sederhana based on chart)
  const volatilityData = useMemo(() => {
<<<<<<< HEAD
      if (!selectedStock) return { volatility: 0, regime: 'N/A' };
      return { 
          volatility: (selectedStock.volatility * 100).toFixed(2), 
          regime: selectedStock.volatility_regime 
      };
  }, [selectedStock]);
=======
      if (chartData.length < 2) return { volatility: 0, regime: 'Low Volatility' };
      
      // Hitung perubahan harga harian sederhana
      let sumChange = 0;
      for(let i=1; i<chartData.length; i++) {
        const prev = chartData[i-1].price;
        const curr = chartData[i].price;
        sumChange += Math.abs((curr - prev) / prev);
      }
      const avgVol = (sumChange / chartData.length) * 100;
      
      return { 
          volatility: avgVol.toFixed(2), 
          regime: avgVol > 1.5 ? 'High Volatility' : 'Low Volatility' 
      };
  }, [chartData]);
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5

  // 2. Breakdown Sentimen untuk BarChart
  const cnbcSentimentData = useMemo(() => {
<<<<<<< HEAD
    // Logika Sentimen (dipertahankan)
    if (!selectedStock || newsData.length === 0) return [];
=======
    if (!newsData.length) return [];
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
    const pos = newsData.filter(n => n.sentiment === 'positive').length;
    const neg = newsData.filter(n => n.sentiment === 'negative').length;
    const neu = newsData.filter(n => n.sentiment === 'neutral').length;
    const total = pos + neg + neu || 1;
    return [
        { name: 'Pos', value: Math.round((pos/total)*100), color: SENTIMENT_COLORS.positive },
        { name: 'Neg', value: Math.round((neg/total)*100), color: SENTIMENT_COLORS.negative },
        { name: 'Neu', value: Math.round((neu/total)*100), color: SENTIMENT_COLORS.neutral },
    ];
  }, [newsData]);

  // 3. Interpretasi Sinyal (BUY/SELL/HOLD)
  const priceForecastInterpretation = useMemo(() => {
<<<<<<< HEAD
    // Logika Sinyal (dipertahankan)
    const change = selectedStock?.change || 0;
    const signal = change > 0.01 ? 'BUY' : change < -0.01 ? 'SELL' : 'HOLD';
    const isPositive = change >= 0;
=======
    if (chartData.length < 2) return { signal: 'HOLD', diff: 0, isPositive: true };
    
    const lastPrice = chartData[chartData.length - 1].price;
    const prevPrice = chartData[0].price; // Bandingkan dengan awal periode (30 hari lalu)
    const diff = ((lastPrice - prevPrice) / prevPrice) * 100;
    
    let signal = 'HOLD';
    if (diff > 5) signal = 'BUY';
    if (diff < -5) signal = 'SELL';
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5

    return { 
        signal, 
        diff: diff.toFixed(2), 
        isPositive: diff >= 0 
    };
  }, [chartData]);


<<<<<<< HEAD
  const signalColor = priceForecastInterpretation.signal === 'BUY' ? '#34D399' : 
                      priceForecastInterpretation.signal === 'SELL' ? '#F87171' : 
                      '#FACC15'; 
                      
  const isAnomaly = selectedStock.anomaly_status === 'ANOMALI';
  const anomalyColor = isAnomaly ? '#FBBF24' : '#34D399'; // Kuning/Oranye untuk Anomali, Hijau untuk Normal

=======
  // --- RENDER UI (Sesuai Request Anda) ---

  if (!selectedStock) 
    return (
      <div 
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: BG_DEEP_DARK, color: TEXT_LIGHT }}
      >
        <RefreshCw className="animate-spin mr-2"/> Loading Dashboard...
      </div>
    );

  const signalColor = 
    priceForecastInterpretation.signal === 'BUY' ? '#34D399' : 
    priceForecastInterpretation.signal === 'SELL' ? '#F87171' : '#FACC15';
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const priceValue = payload[0].value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return (
        <div 
          className="p-3 rounded-lg text-sm backdrop-blur-sm"
          style={{ 
            backgroundColor: '#1C294AEE', 
            border: `1px solid ${ACCENT_NEON}60`,
            color: TEXT_LIGHT 
          }}
        >
          <p className="font-bold text-gray-300">{`Date: ${label}`}</p>
          <p className="mt-1 flex items-center">
            <DollarSign className="w-3 h-3 mr-1 text-green-400" />
            {`$${priceValue}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // --- Komponen Pembantu untuk Metrik (Diperbarui) ---
  const MetricBox = ({ label, value, color, icon: Icon }) => (
      <div className='p-3 rounded-xl' style={{ backgroundColor: '#263353', border: `1px solid ${ACCENT_PRIMARY}` }}>
          <div className='flex items-center text-xs text-gray-400 uppercase'>
              <Icon className='w-3 h-3 mr-1'/> {label}
          </div>
          <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
      </div>
  );

  return (
    <div 
      className="h-screen w-full p-3 sm:p-4 font-sans overflow-hidden"
      style={{ backgroundColor: BG_DEEP_DARK, color: TEXT_LIGHT }}
    >
      
      {/* STOCKS AVAILABLE */}
      <BentoCard 
        className="w-full mb-4 px-3 py-2 rounded-xl"
        title="Stocks Available"
        style={{ backgroundColor: CARD_BASE, border: `1px solid ${ACCENT_PRIMARY}60` }}
      >
<<<<<<< HEAD
        <div className="flex gap-6 overflow-x-auto w-full hide-scrollbar items-center">
            {stockList.map(stock => (
              <button 
                key={stock.code}
                onClick={() => setSelectedStock(stock)}
                className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 transform 
                            ${selectedStock.code === stock.code ? 'ring-2 ring-offset-2 ring-offset-[#0A132C] scale-105 shadow-xl' : 'opacity-70 hover:opacity-100'}`}
                style={{ 
                    borderColor: selectedStock.code === stock.code ? ACCENT_NEON : 'transparent', 
                    backgroundColor: selectedStock.code === stock.code ? ACCENT_PRIMARY : CARD_BASE, 
                    minWidth: '100px',
                    boxShadow: selectedStock.code === stock.code ? `0 0 15px ${ACCENT_NEON}50` : 'none'
                }}
              >
                {/* MENGGUNAKAN LOGO URL DARI COMPANY_META */}
                <StockLogo 
                    code={stock.code} 
                    imageUrl={stock.logoUrl} // Meneruskan URL Logo
                    className="w-10 h-10 rounded-full bg-white p-1 mb-1 shadow-md" 
                />
                <span className="font-bold text-sm mt-1">{stock.code.replace('.JK','')}</span>
              </button>
            ))}
=======
        <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
          {stockList.map(stock => (
            <button 
              key={stock.code}
              onClick={() => setSelectedStock(stock)}
              className={`flex-shrink-0 flex flex-col items-center justify-center p-2.5 rounded-lg transition-all duration-200
                ${selectedStock.code === stock.code 
                  ? 'ring-2 ring-offset-1 ring-offset-[#0A132C] ring-[#4B8BF5] scale-[1.03] shadow-[0_0_12px_#4B8BF540]' 
                  : 'opacity-80 hover:opacity-100 hover:bg-[#26355b]'}`}
              style={{ 
                backgroundColor: selectedStock.code === stock.code ? ACCENT_PRIMARY : 'transparent',
                minWidth: '88px'
              }}
            >
              <StockLogo code={stock.code} className="w-9 h-9 rounded bg-white p-0.5 shadow" />
              <span className="font-semibold text-xs mt-1 text-center">{stock.code.replace('.JK','')}</span>
            </button>
          ))}
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
        </div>
      </BentoCard>

      <div className="grid grid-cols-12 grid-rows-9 gap-3 h-[calc(100vh-112px)] w-full max-w-7xl mx-auto">
        
        {/* Judul & Data Utama */}
        <BentoCard 
<<<<<<< HEAD
            className="col-span-8 row-span-2 p-6 flex flex-col justify-between relative overflow-hidden" 
            title={selectedStock.name}
            style={{ backgroundColor: CARD_BASE, border: `1px solid ${ACCENT_PRIMARY}80` }}
=======
          className="col-span-8 row-span-2 p-5 rounded-xl flex justify-between items-start"
          style={{ backgroundColor: CARD_BASE, border: `1px solid ${ACCENT_PRIMARY}50` }}
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
        >
          <div>
            <p className="text-xs uppercase font-medium text-gray-400 tracking-wide">Selected Stock • {currentDate.getFullYear()}</p>
            <h1 className="text-4xl font-bold mt-1" style={{ color: ACCENT_NEON }}>
              {selectedStock.code.replace('.JK','')}
            </h1>
            <p className="text-base text-gray-300 mt-0.5">{selectedStock.name}</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold">
              ${selectedStock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <span className={`text-sm font-semibold px-2.5 py-1 rounded-full mt-1 inline-flex items-center ${
              priceForecastInterpretation.isPositive 
                ? 'bg-green-900/40 text-green-300' 
                : 'bg-red-900/40 text-red-300'
            }`}>
              {priceForecastInterpretation.isPositive ? 
                <TrendingUp className="w-3.5 h-3.5 mr-1" /> : 
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
              }
              {priceForecastInterpretation.diff}%
            </span>
          </div>
<<<<<<< HEAD
          <div className="absolute inset-0 z-0 opacity-[0.1]" style={{ background: `radial-gradient(circle at 100% 100%, ${ACCENT_NEON} 0%, transparent 40%)` }}></div>
=======
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
        </BentoCard>

        {/* Chart Area */}
        <BentoCard 
          className="col-span-8 row-span-5 p-3 rounded-xl"
          title="Market Trend Analysis (30D)"
          style={{ backgroundColor: CARD_BASE }}
        >
          <div className="w-full h-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT_NEON} stopOpacity={0.6}/>
                      <stop offset="95%" stopColor={ACCENT_NEON} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#555" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis 
                    stroke="#555" 
                    tickFormatter={(v) => `$${v.toLocaleString()}`} 
                    tick={{ fontSize: 9 }} 
                    domain={['auto', 'auto']} 
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3B5C" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={ACCENT_NEON} 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    dot={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                Fetching Historical Data...
              </div>
            )}
          </div>
        </BentoCard>

        {/* AI Forecast Signal */}
        <BentoCard 
          className="col-span-4 row-span-2 p-4 rounded-xl flex flex-col justify-between"
          title="AI Forecast Signal"
          style={{ 
            backgroundColor: `${ACCENT_PRIMARY}CC`, 
            backdropFilter: 'blur(8px)',
            border: `1px solid ${ACCENT_NEON}40`,
            boxShadow: '0 4px 20px rgba(75, 139, 245, 0.2)' 
          }}
        >
<<<<<<< HEAD
            <div className='flex items-center justify-between mt-2'>
                <div className='flex flex-col'>
                    <p className="text-blue-200 text-sm uppercase mb-1">Recommended Action</p>
                    <h2 className="text-5xl font-black tracking-tighter" style={{ color: signalColor }}>
                        {priceForecastInterpretation.signal}
                    </h2>
                </div>
                <div className="h-20 w-20 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#fff' + '10', color: TEXT_LIGHT, border: `2px solid ${TEXT_LIGHT}80`, boxShadow: `0 0 10px ${TEXT_LIGHT}80` }}>
                    <Zap className='w-10 h-10 animate-pulse' style={{ color: signalColor }}/>
                </div>
            </div>
            
            <div className="flex justify-between items-end border-t border-blue-600 pt-3 mt-3 text-blue-100">
                <div className='flex items-center text-sm font-semibold'>
                    <Wind className='w-4 h-4 mr-1 text-blue-200' /> Volatility Regime
                </div>
                <span className={`text-sm px-2 py-0.5 rounded font-bold ${selectedStock.volatility_regime === 'HIGH VOL' ? 'bg-orange-700/50 text-orange-300' : 'bg-teal-700/50 text-teal-300'}`}>
                    {selectedStock.volatility_regime}
                </span>
=======
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-xs uppercase mb-1">Recommended Action</p>
              <h2 className="text-4xl font-black tracking-tight" style={{ color: signalColor }}>
                {priceForecastInterpretation.signal}
              </h2>
            </div>
            <div 
              className="h-16 w-16 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(255, 255, 255, 0.08)', 
                border: `1px solid rgba(224, 231, 255, 0.3)`,
                boxShadow: `0 0 8px ${signalColor}60`
              }}
            >
              <Zap className="w-8 h-8 animate-pulse" style={{ color: signalColor }} />
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-blue-600/40 pt-2.5 mt-2 text-blue-200 text-sm">
            <div className="flex items-center">
              <Wind className="w-3.5 h-3.5 mr-1 text-blue-300" /> Volatility Index
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              volatilityData.regime === 'High Volatility' 
                ? 'bg-orange-900/50 text-orange-300' 
                : 'bg-teal-900/50 text-teal-300'
            }`}>
              {volatilityData.volatility}% ({volatilityData.regime})
            </span>
          </div>
        </BentoCard>

<<<<<<< HEAD
        {/* 4. ANOMALY & REGIME BOXES (col-span-4 row-span-2) */}
        <BentoCard 
            className="col-span-4 row-span-2 p-4 grid grid-cols-2 gap-3" 
            title="Model Diagnostics"
            style={{ backgroundColor: CARD_BASE }}
        >
            <div className='p-3 rounded-xl col-span-2' style={{ backgroundColor: '#263353', border: `1px solid ${ACCENT_PRIMARY}` }}>
                <div className='flex items-center text-xs text-gray-400 uppercase'>
                    <Activity className='w-4 h-4 mr-1'/> Anomaly Detection (iForest)
                </div>
                <div className='flex justify-between items-center mt-1'>
                    <p className='text-3xl font-bold' style={{ color: anomalyColor }}>
                        {selectedStock.anomaly_status}
                    </p>
                    {isAnomaly && <AlertTriangle className='w-6 h-6 animate-pulse' style={{ color: anomalyColor }} />}
                </div>
            </div>
            
            <MetricBox label="Change (24H)" value={`${priceForecastInterpretation.diff}%`} color={priceForecastInterpretation.isPositive ? 'text-green-400' : 'text-red-400'} icon={DollarSign}/>
            <MetricBox label="Vol Index" value={`${volatilityData.volatility}%`} color="text-yellow-400" icon={Wind}/>
=======
        {/* Key Metrics */}
        <BentoCard 
          className="col-span-4 row-span-2 p-3 rounded-xl grid grid-cols-2 gap-2"
          title="Key Metrics"
          style={{ backgroundColor: CARD_BASE }}
        >
          <MetricBox label="Change (30D)" value={`${priceForecastInterpretation.diff}%`} color={priceForecastInterpretation.isPositive ? 'text-green-400' : 'text-red-400'} icon={DollarSign}/>
          <MetricBox label="Sentiment Pos" value={`${cnbcSentimentData.find(d => d.name === 'Pos')?.value || 0}%`} color="text-green-400" icon={TrendingUp}/>
          <MetricBox label="Sentiment Neg" value={`${cnbcSentimentData.find(d => d.name === 'Neg')?.value || 0}%`} color="text-red-400" icon={TrendingDown}/>
          <MetricBox label="Anomaly Status" value="Normal" color="text-teal-400" icon={AlertTriangle}/>
>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
        </BentoCard>
        
        {/* Sentiment Chart */}
        <BentoCard 
          className="col-span-4 row-span-3 p-3 rounded-xl"
          title="News Sentiment Breakdown"
          style={{ backgroundColor: CARD_BASE }}
        >
          <div className="h-full w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cnbcSentimentData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#555" 
                  tick={{ fill: TEXT_LIGHT, fontSize: 10 }} 
                  axisLine={false} 
                  tickLine={false} 
                  width={35}
                />
                <Tooltip 
                  cursor={{ fill: '#263353' }} 
                  formatter={(value) => [`${value}%`]}
                  contentStyle={{ 
                    backgroundColor: CARD_BASE, 
                    border: `1px solid ${ACCENT_NEON}80`, 
                    color: TEXT_LIGHT,
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" radius={[3, 3, 3, 3]} barSize={14}>
                  {cnbcSentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </BentoCard>

        {/* News Feed */}
        <BentoCard 
          className="col-span-8 row-span-2 p-3 rounded-xl flex flex-col"
          title="Recent Activities / News Feed"
          style={{ backgroundColor: CARD_BASE }}
        >
          <div className="flex-1 overflow-y-auto mt-2 space-y-2 pr-1 custom-scrollbar">
            {newsData.slice(0, 4).map((news, i) => (
              <div 
                key={i} 
                className="flex items-start p-2.5 rounded-lg hover:bg-[#26355b]/60 transition-colors border border-transparent hover:border-[#32456C]"
              >
                <Clock className="w-3.5 h-3.5 mt-0.5 text-gray-500 flex-shrink-0" />
                <div className="ml-2.5 flex-1">
                  <p className="text-sm text-gray-200 leading-relaxed">{news.title}</p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-xs text-gray-500">{news.source}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      news.sentiment === 'positive' ? 'bg-green-900/60 text-green-400' : 
                      news.sentiment === 'negative' ? 'bg-red-900/60 text-red-400' : 
                      'bg-blue-900/60 text-blue-400'
                    }`}>
                      {news.sentiment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BentoCard>

      </div>
    </div>
  );
};

<<<<<<< HEAD
=======
// --- HELPER COMPONENT ---
const MetricBox = ({ label, value, color, icon: Icon }) => (
  <div 
    className="p-2.5 rounded-lg"
    style={{ backgroundColor: '#263353', border: `1px solid ${ACCENT_PRIMARY}40` }}
  >
    <div className="flex items-center text-[10px] text-gray-400 uppercase">
      <Icon className="w-2.5 h-2.5 mr-1" /> {label}
    </div>
    <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
  </div>
);

>>>>>>> 26c10b30bda32a9099d1e2c733c6143b56febfa5
export default App;
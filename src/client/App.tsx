/// <reference types="@devvit/public-api" />
import React, { useEffect, useState } from 'react';
import { Stonk, Portfolio, ServerMessage, ClientMessage } from '../shared/types/api';
import { MarketTicker } from './components/MarketTicker';

const App = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [market, setMarket] = useState<Stonk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for messages
    const handler = (event: MessageEvent) => {
      const msg = event.data as ServerMessage;
      if (msg.type === 'UPDATE_STATE') {
        setPortfolio(msg.data.portfolio);
        setMarket(msg.data.market);
        setLoading(false);
      }
    };
    window.addEventListener('message', handler);

    // Request init
    const initMsg: ClientMessage = { type: 'INITIAL_LOAD' };
    window.parent.postMessage(initMsg, '*');

    return () => window.removeEventListener('message', handler);
  }, []);

  const handleBuy = (ticker: string) => {
    const msg: ClientMessage = { type: 'BUY', data: { ticker, quantity: 1 } };
    window.parent.postMessage(msg, '*');
  };

  const handleSell = (ticker: string) => {
    const msg: ClientMessage = { type: 'SELL', data: { ticker, quantity: 1 } };
    window.parent.postMessage(msg, '*');
  };

  if (loading) return <div className="bg-black h-screen text-white flex items-center justify-center">Loading Stoncx...</div>;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
      <MarketTicker market={market} />

      <div className="p-4 max-w-4xl mx-auto">
        {/* Header / Portfolio Summary */}
        <header className="mb-8 p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                STONCX PIECE
              </h1>
              <p className="text-slate-400 text-sm">Fantasy Anime Market</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Available Cash</p>
              <p className="text-4xl font-mono text-emerald-400">
                ${portfolio?.balance.toLocaleString()}
              </p>
            </div>
          </div>
        </header>

        {/* Market Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {market.map((stonk) => {
            const owned = portfolio?.holdings[stonk.ticker] || 0;
            return (
              <div key={stonk.ticker} className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Image Placeholder */}
                <div className="h-48 bg-slate-800 relative overflow-hidden">
                  <img src={stonk.image} alt={stonk.name} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x300/1e293b/cbd5e1?text=' + stonk.ticker)} />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold font-mono border border-white/10">
                    {stonk.ticker}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg leading-tight">{stonk.name}</h3>
                    <div className="text-right">
                      <div className="text-xl font-mono font-bold">${stonk.price}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400">
                      Owned: <span className="text-white font-bold text-sm ml-1">{owned}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSell(stonk.ticker)}
                        disabled={owned <= 0}
                        className="px-3 py-1 text-xs font-bold rounded bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        SELL
                      </button>
                      <button
                        onClick={() => handleBuy(stonk.ticker)}
                        disabled={(portfolio?.balance || 0) < stonk.price}
                        className="px-3 py-1 text-xs font-bold rounded bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-900/20"
                      >
                        BUY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;

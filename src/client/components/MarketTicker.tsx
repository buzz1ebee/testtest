import React from 'react';
import { Stonk } from '../../shared/types/api';

export const MarketTicker = ({ market }: { market: Stonk[] }) => {
    return (
        <div className="w-full bg-slate-900 overflow-hidden py-2 border-b border-slate-700">
            <div className="flex animate-marquee whitespace-nowrap">
                {market.map((stonk) => (
                    <div key={stonk.ticker} className="mx-4 flex items-center space-x-2">
                        <span className="font-bold text-neon-blue">{stonk.ticker}</span>
                        <span className="text-white">${stonk.price}</span>
                        <span className={Math.random() > 0.5 ? "text-green-500" : "text-red-500"}>
                            {Math.random() > 0.5 ? "▲" : "▼"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { RedisClient } from '@devvit/public-api';
import { Stonk, Portfolio, INITIAL_MARKET as SHARED_MARKET } from '../shared/types/api.js';

export const INITIAL_MARKET = [
  { ticker: 'LUF', name: 'Monkey D. Luffy', price: 1200, image: 'https://i.redd.it/luffy_placeholder.png' },
  { ticker: 'ZOR', name: 'Roronoa Zoro', price: 950, image: 'https://i.redd.it/zoro_placeholder.png' },
  { ticker: 'NMI', name: 'Nami', price: 750, image: 'https://i.redd.it/nami_placeholder.png' },
  { ticker: 'SAN', name: 'Sanji', price: 920, image: 'https://i.redd.it/sanji_placeholder.png' },
  { ticker: 'CHP', name: 'Tony Tony Chopper', price: 300, image: 'https://i.redd.it/chopper_placeholder.png' },
];

const KEYS = {
  USER: (userId: string) => `user:${userId}`,
  MARKET: 'market:stocks',
};

export async function getUserPortfolio(redis: RedisClient, userId: string): Promise<Portfolio> {
  const data = await redis.get(KEYS.USER(userId));
  if (!data) {
    // Initialize new user
    const portfolio: Portfolio = {
      balance: 10000,
      holdings: {},
    };
    await redis.set(KEYS.USER(userId), JSON.stringify(portfolio));
    return portfolio;
  }
  return JSON.parse(data);
}

export async function getMarket(redis: RedisClient): Promise<Stonk[]> {
  const data = await redis.get(KEYS.MARKET);
  if (!data) {
    // Initialize market if empty
    await redis.set(KEYS.MARKET, JSON.stringify(INITIAL_MARKET));
    return INITIAL_MARKET;
  }
  return JSON.parse(data);
}

export async function buyStock(redis: RedisClient, userId: string, ticker: string, quantity: number = 1) {
    const portfolio = await getUserPortfolio(redis, userId);
    const market = await getMarket(redis);
    const stock = market.find(s => s.ticker === ticker);

    if (!stock) throw new Error('Stock not found');
    
    const cost = stock.price * quantity;
    if (portfolio.balance < cost) throw new Error('Insufficient funds');

    // Transact
    portfolio.balance -= cost;
    portfolio.holdings[ticker] = (portfolio.holdings[ticker] || 0) + quantity;

    // Simulate Price Impact (Simple: 1% increase per buy)
    stock.price = Math.ceil(stock.price * 1.01);

    // Save
    await redis.set(KEYS.USER(userId), JSON.stringify(portfolio));
    await redis.set(KEYS.MARKET, JSON.stringify(market));

    return { portfolio, market };
}

export async function sellStock(redis: RedisClient, userId: string, ticker: string, quantity: number = 1) {
    const portfolio = await getUserPortfolio(redis, userId);
    const market = await getMarket(redis);
    const stock = market.find(s => s.ticker === ticker);

    if (!stock) throw new Error('Stock not found');

    const currentQty = portfolio.holdings[ticker] || 0;
    if (currentQty < quantity) throw new Error('Not enough shares');

    const revenue = stock.price * quantity;

    // Transact
    portfolio.balance += revenue;
    portfolio.holdings[ticker] -= quantity;
    
    // Cleanup 0 holdings
    if (portfolio.holdings[ticker] <= 0) {
        delete portfolio.holdings[ticker];
    }

    // Simulate Price Impact (Simple: 1% decrease per sell)
    stock.price = Math.max(1, Math.floor(stock.price * 0.99));

    // Save
    await redis.set(KEYS.USER(userId), JSON.stringify(portfolio));
    await redis.set(KEYS.MARKET, JSON.stringify(market));

    return { portfolio, market };
}

export async function resetGame(redis: RedisClient, userId: string) {
    await redis.del(KEYS.USER(userId));
    await redis.set(KEYS.MARKET, JSON.stringify(INITIAL_MARKET));
    return {
        portfolio: await getUserPortfolio(redis, userId),
        market: INITIAL_MARKET
    };
}

export type Stonk = {
  ticker: string;
  name: string;
  price: number;
  image: string;
};

export type Portfolio = {
  balance: number;
  holdings: Record<string, number>; // ticker -> quantity
};

// Client -> Server Messages
export type ClientMessage = 
  | { type: 'INITIAL_LOAD'; data?: any }
  | { type: 'BUY'; data: { ticker: string; quantity: number } }
  | { type: 'SELL'; data: { ticker: string; quantity: number } }
  | { type: 'RESET'; data?: any };

// Server -> Client Messages
export type ServerMessage = 
  | { type: 'UPDATE_STATE'; data: { portfolio: Portfolio; market: Stonk[] } }
  | { type: 'ERROR'; data: { message: string } };

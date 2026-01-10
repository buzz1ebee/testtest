export type AppState = {
  balance: number;
  portfolio: Record<string, number>; // assuming symbol -> quantity
  lastUpdated: number;
};

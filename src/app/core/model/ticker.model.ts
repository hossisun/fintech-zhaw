export interface Ticker {
  ticker: string;
  exchange: string;
  prices: TickerPrice[];
}

export interface TickerPrice {
  date: Date;
  volume: number;
}

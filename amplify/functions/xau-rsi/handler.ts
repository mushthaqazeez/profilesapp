import axios from 'axios';
import { RSI } from 'technicalindicators';

const BOT  = process.env.TG_BOT!;
const CHAT = process.env.TG_CHAT!;

export const handler = async () => {
  // 1) closed candles
  const { data } = await axios.get('https://api.binance.com/api/v3/klines', {
    params: { symbol: 'XAUUSDT', interval: '1h', limit: 100 }
  });
  const closes = data.slice(0, -1).map((c: any[]) => +c[4]);  // drop live bar

  // 2) RSI(14)
  const r = RSI.calculate({ values: closes, period: 14 });
  const prev = r.at(-2)!;
  const curr = r.at(-1)!;

  // 3) alert on upward cross
  if (prev < 60 && curr >= 60) {
    await axios.post(
      `https://api.telegram.org/bot${BOT}/sendMessage`,
      { chat_id: CHAT, text: `⚠️  XAU/USD 1-h RSI crossed 60 → ${curr.toFixed(1)}` }
    );
  }
  return { prev, curr };
};

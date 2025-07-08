import axios from 'axios';
import { RSI } from 'technicalindicators';

const KEY  = process.env.T12_KEY!;
const BOT  = process.env.TG_BOT!;
const CHAT = process.env.TG_CHAT!;

export const handler = async () => {
  /* 1) Grab 100 one-hour candles from Twelve Data */
  const { data } = await axios.get(
    'https://api.twelvedata.com/time_series',
    {
      params: {
        symbol:    'XAU/USD',
        interval:  '1h',
        outputsize: 100,
        apikey:    KEY
      }
    }
  );

  if (data.status === 'error') {
    throw new Error(`TwelveData error: ${data.message || JSON.stringify(data)}`);
  }

  // data.values comes newest-first; reverse so oldest->newest
  const closes = data.values.map((v:any) => +v.close).reverse();

  /* 2) Compute RSI-14 */
  const rsiSeries = RSI.calculate({ values: closes, period: 14 });
  const prev = rsiSeries.at(-2)!;
  const curr = rsiSeries.at(-1)!;

  /* 3) Alert on cross ≥ 60 */
  if (prev < 60 && curr >= 60) {
    await axios.post(
      `https://api.telegram.org/bot${BOT}/sendMessage`,
      { chat_id: CHAT, text: `⚠️ XAU/USD 1-h RSI crossed 60 → ${curr.toFixed(1)}` }
    );
  }

  return { prev, curr };
};

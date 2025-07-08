import { defineFunction, schedule } from '@aws-amplify/backend';

export const xauRsi = defineFunction({
  name: 'xau-rsi',
  runtime: 'nodejs18.x',            // or 20.x
  entry: './handler.ts',
  schedule: [                       // run at HH:05 UTC every hour
    schedule.cron({ minute: '5', hour: '*', input: '{}' })
  ],
  environment: {
    TG_BOT:  'YOUR_BOT_TOKEN',      // or leave blank and set in console
    TG_CHAT: 'YOUR_CHAT_ID'
  }
});

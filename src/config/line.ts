import { Client, Config } from '@line/bot-sdk';

const config: Config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
};

export const lineClient = new Client(config);
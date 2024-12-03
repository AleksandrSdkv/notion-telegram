import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from "dotenv";
import { createNewGroup } from "./notion.js";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: Infinity,
});

bot.start((ctx) => ctx.reply("Hello!"));
bot.help((ctx) => ctx.reply("Send me a message and I'll repeat it back to you!"));
bot.on(message("text"), (ctx) => createNewGroup(ctx.message.text));
// bot.on("text", (ctx) => ctx.reply(ctx.message.text));

bot.launch();

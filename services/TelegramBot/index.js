const Telegraf = require("telegraf");
require("dotenv").config();
const textHandlers = require("./handlers/textHandlers");
const middleware = require("./auth.middleware");
const action = require('./action');
// const scheduleDailyMessage = require("./services/scheduleDailyMessage");


const bot = new Telegraf.Telegraf(process.env.TOKEN);
bot.use(Telegraf.session());

// Schedule Daily Message
// scheduleDailyMessage(bot);

bot.start((ctx) => {
    // Khởi tạo biến session cho người dùng
    ctx.reply("Bro :)))");
});

// Command
bot.command("ae", middleware.auth, textHandlers.getAmountExpenseByTime);
bot.command("ai", middleware.auth, textHandlers.getAmountIncomeByTime);
//
// bot.command("recommend", middleware.auth, textHandlers.sendLatestRequest);
//
// bot.command("confession", middleware.auth, textHandlers.addConfession);
//
// bot.command("get_confession", middleware.auth, textHandlers.getConfession);

// Handler;
bot.on(
    "message",
    middleware.auth,
    textHandlers.message
);


bot.action(/amount:(.+)/, action.getAmount);

module.exports = bot;

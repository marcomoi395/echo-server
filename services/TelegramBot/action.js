// const notion = require('../services/notionService');
// const regex = require("../utils/regex");
// const formatDataExpenseAndIncome = require("../utils/formatDataExpenseAndIncome");
// const expenseAndIncomeMessagesLogs = require("../services/expenseAndIncomeMessagesLogs");
// const config = require("../config/process.env");
const regex = require("./utils/regex");
const formSendUser = require("./utils/formSendUser");
const getTimeUntilEndOfDay = require('./utils/getTimeUntilEndOfDay');
const bot = require('./index')
const getAmountHandler = require("./handlers/getAmountHandler");
const {transactionHandler} = require("./handlers/transactionHandler");

module.exports.getAmount = async (ctx) => {
    const match = ctx.callbackQuery.data.match(/amount:(.+)/);
    if (match) {
        const message = match[1].split(',');
        const amount = await getAmountHandler(ctx, message);
        if (amount === null) {
            await ctx.reply(`Lỗi rồi trời ơi, báo lại với Thanh Loi ngay đi 😤😤😤`);
        }
        let sentMessage;
        if (message[0] === 'Expense') {
            if (message[1] === 'today')
                sentMessage = await ctx.reply(`📊 Tổng chi của hôm nay là: ${amount}.`);
            else if (message[1] === 'week')
                sentMessage = await ctx.reply(`📊 Tổng chi của tuần này là: ${amount}.`);
            else
                sentMessage = await ctx.reply(`📊 Tổng chi của tháng này là: ${amount}.`);
        } else {
            if (message[1] === 'today')
                sentMessage = await ctx.reply(`📊 Tổng thu của hôm nay là: ${amount}.`);
            else if (message[1] === 'week')
                sentMessage = await ctx.reply(`📊 Tổng thu của tuần này là: ${amount}.`);
            else
                sentMessage = await ctx.reply(`📊 Tổng thu của tháng này là: ${amount}.`);
        }

        // Xóa tin nhắn thông kê sau 20s
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(sentMessage.message_id);
            } catch (error) {
                console.log(error)
            }
        }, 10000);
    }
};

module.exports.addExpenseAndIncomeLog = async (ctx) => {
    const match = ctx.callbackQuery.data.match(/sendMessage:(.+)/);
    if (match) {
        const message = match[1];
        if (regex.checkRegexExpense(message)) {
            await transactionHandler(message, ctx);
        }
    } else {
        ctx.answerCbQuery('Định dạng callback query không hợp lệ');
    }
};
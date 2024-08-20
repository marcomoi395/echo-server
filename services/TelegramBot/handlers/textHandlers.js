const keyboard = require("../utils/keyboards");
const regex = require("../utils/regex");
require("dotenv").config();
const Markup = require("telegraf/markup");
const callbackHandlers = require("../action");
const formSendUser = require("../utils/formSendUser");
const BudgetTracker = require("../../../models/budgetTracker.model");
const User = require("../../../models/user.model");
const {transactionHandler} = require("./transactionHandler");
const {deleteMessageUtil} = require("../utils/deleteMessage.util");

// Send Message
module.exports.message = async (ctx) => {
    const message = ctx.message.text;
    try {
        if (regex.checkRegexExpense(message)) {
            await transactionHandler(message, ctx);
        } else {
            const sentMessage = await ctx.reply("Đang nói gì vậy mình không hiểu 😅",);
            setTimeout(async () => {
                try {
                    await ctx.deleteMessage(ctx.message.message_id);
                    await ctx.deleteMessage(sentMessage.message_id);
                } catch (error) {
                }
            }, 5000);
        }
        // if (ctx.session.logging) {
        //     // await addConfessionService(ctx, message);
        // } else if (regex.checkRegexExpense(message)) {
        //     await expenseAndIncomeService(ctx, message);
        // } else {
        //     const sentMessage = await ctx.reply(
        //         "Đang nói gì vậy mình không hiểu 😅",
        //     );
        //     setTimeout(async () => {
        //         try {
        //             await ctx.deleteMessage(ctx.message.message_id);
        //             await ctx.deleteMessage(sentMessage.message_id);
        //         } catch (error) {}
        //     }, 5000);
        // }
    } catch (e) {
        ctx.reply("Errorrrr");
    }
};

// Command
module.exports.getAmountExpenseByTime = async (ctx) => {
    try {
        const sentMessage = await ctx.reply(
            "💵 Thống kê chi. Hãy chọn một lựa chọn sau đây:",
            keyboard.timeSelectionExpenseKeyboard,
        );

        await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id, 10000)
    } catch (e) {
        console.log(e)
        ctx.reply("Error");
    }
};

module.exports.getAmountIncomeByTime = async (ctx) => {
    try {
        const sentMessage = await ctx.reply(
            "💵 Thống kê thu. Hãy chọn một lựa chọn sau đây:",
            keyboard.timeSelectionIncomeKeyboard,
        );

        await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id, 10000)
    } catch (e) {
        console.log(e)
        ctx.reply("Error");
    }
};

module.exports.sendLatestRequest = async (ctx) => {
    try {
        const userId = ctx.session.userId;
        const find = {
            userId: userId, deleted: false
        };

        const records = await BudgetTracker.find(find).sort({ createdAt: -1 });

        const uniqueValues = [...new Set(records.map(record => `${record.description} ${record.amount}`))].slice(0, 3);

        let buttons = [];
        uniqueValues.forEach((chat) => {
            buttons.push([Markup.button.callback(chat, `sendMessage:${chat}`)]);
        });

        const timeSelectionIncomeKeyboard = Markup.inlineKeyboard(buttons);

        const sentMessage = await ctx.reply(
            "📋 Dưới đây là một vài ghi chú gần nhất:",
            timeSelectionIncomeKeyboard,
        );

        await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id, 20000)
    } catch (e) {
        ctx.reply(
            "⚠️ Xin lỗi, đã xảy ra lỗi khi tải các ghi chú gần nhất. Vui lòng thử lại sau. 🥹",
        );
    }
};
//
// module.exports.addConfession = async (ctx) => {
//     const sentMessage = await ctx.reply(
//         "Mình luôn sẵn sàng lắng nghe, dù là chuyện vui hay buồn. Mình ở đây nếu bạn cần. Hãy nói điều gì đó nhá 😘",
//     );
//     ctx.session.logging = true;
//     ctx.session.sentMessageId = sentMessage.message_id;
//
//     // Xóa tin nhắn của người dùng
//     await ctx.deleteMessage(ctx.message.message_id);
//
//     // Xóa tin nhắn khi không nhập gì trong 5p
//     setTimeout(async () => {
//         try {
//             ctx.session.logging = false;
//             await ctx.deleteMessage(sentMessage.message_id);
//         } catch (error) {}
//     }, 300000);
// };
//
// module.exports.getConfession = async (ctx) => {
//     const text = await getConfessionService();
//     const sentMessage = await ctx.reply(text, {
//         parse_mode: "HTML",
//     });
//
//     // Xóa tin nhắn của người dùng
//     await ctx.deleteMessage(ctx.message.message_id);
//
//     // Xóa tin nhắn khi không nhập gì trong 5p
//     setTimeout(async () => {
//         try {
//             await ctx.deleteMessage(sentMessage.message_id);
//         } catch (error) {}
//     }, 300000);
// };

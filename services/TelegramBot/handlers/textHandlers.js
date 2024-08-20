const keyboard = require("../utils/keyboards");
const regex = require("../utils/regex");
require("dotenv").config();
const Markup = require("telegraf/markup");
const BudgetTracker = require("../../../models/budgetTracker.model");
const {transactionHandler} = require("./transactionHandler");
const {deleteMessageUtil} = require("../utils/deleteMessage.util");
const addConfessionHandler = require("./addConfessionHandler");
const getConfessionHandler = require("./getConfessionHandler");
const Confession = require("../../../models/confession.model");

// Send Message
module.exports.message = async (ctx) => {
    const message = ctx.message.text;
    try {
        if (ctx.session.logging) {
            await addConfessionHandler(ctx, message);
        } else if (ctx.session.pwd) {
            const userId = ctx.session.userId;
            const {password} = await Confession.findOne({userId: userId}).select("password").exec();

            if (password.toString() === message.toString()) {
                ctx.session.pwd = false;
                const text = await getConfessionHandler(ctx);
                const sentMessage = await ctx.reply(text, {
                    parse_mode: "HTML",
                });
                await deleteMessageUtil(ctx, ctx?.message?.message_id, sentMessage?.message_id, 5000)
            }else{
                const sentMessage = await ctx.reply("Sai mật khẩu rồi!!! 😅",);
                setTimeout(async () => {
                    try {
                        await ctx.deleteMessage(ctx.message.message_id);
                        await ctx.deleteMessage(sentMessage.message_id);
                    } catch (error) {
                    }
                }, 5000);
            }
        } else if (regex.checkRegexExpense(message)) {
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
    } catch (e) {
        ctx.reply("Errorrrr");
    }
};

// Command
module.exports.getAmountExpenseByTime = async (ctx) => {
    try {
        const sentMessage = await ctx.reply("💵 Thống kê chi. Hãy chọn một lựa chọn sau đây:", keyboard.timeSelectionExpenseKeyboard,);

        await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id, 10000)
    } catch (e) {
        console.log(e)
        ctx.reply("Error");
    }
};

module.exports.getAmountIncomeByTime = async (ctx) => {
    try {
        const sentMessage = await ctx.reply("💵 Thống kê thu. Hãy chọn một lựa chọn sau đây:", keyboard.timeSelectionIncomeKeyboard,);

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

        const records = await BudgetTracker.find(find).sort({createdAt: -1});

        const uniqueValues = [...new Set(records.map(record => `${record.description} ${record.amount}`))].slice(0, 3);

        let buttons = [];
        uniqueValues.forEach((chat) => {
            buttons.push([Markup.button.callback(chat, `sendMessage:${chat}`)]);
        });

        const timeSelectionIncomeKeyboard = Markup.inlineKeyboard(buttons);

        const sentMessage = await ctx.reply("📋 Dưới đây là một vài ghi chú gần nhất:", timeSelectionIncomeKeyboard,);

        await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id, 20000)
    } catch (e) {
        ctx.reply("⚠️ Xin lỗi, đã xảy ra lỗi khi tải các ghi chú gần nhất. Vui lòng thử lại sau. 🥹",);
    }
};

module.exports.addConfession = async (ctx) => {
    const sentMessage = await ctx.reply("Mình luôn sẵn sàng lắng nghe, dù là chuyện vui hay buồn. Mình ở đây nếu bạn cần. Hãy nói điều gì đó nhá 😘",);
    ctx.session.logging = true;
    // ctx.session.sentMessageId = sentMessage.message_id;

    // Xóa tin nhắn khi không nhập gì trong 2p
    setTimeout(async () => {
        try {
            ctx.session.logging = false;
        } catch (error) {
            console.log(error)
        }
    }, 120000);

    await deleteMessageUtil(ctx, ctx?.message?.message_id, sentMessage?.message_id, 120000)
};

module.exports.getConfession = async (ctx) => {
    const sentMessage = await ctx.reply("Mật khẩu là gì ấy nhỉ??? 😘",);

    ctx.session.pwd = true;

    // Xóa tin nhắn khi không nhập gì trong 5p
    setTimeout(async () => {
        try {
            ctx.session.pwd = false;
        } catch (error) {
            console.log(error)
        }
    }, 15000);

    await deleteMessageUtil(ctx, ctx?.message?.message_id, sentMessage?.message_id, 15000)

};

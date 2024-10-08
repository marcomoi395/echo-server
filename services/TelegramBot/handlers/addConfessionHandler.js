const Confession = require("../../../models/confession.model");
const responseConfessionMessage = require("../utils/responseConfessionMessage");

const addConfessionHandler = async (ctx, message) => {
    const userId = ctx.session.userId;

    const messageFormat = message.split("\n");

    if (messageFormat.length > 1) {
        const data = {
            title: messageFormat[0],
            content: messageFormat.slice(1).join("\n"),
        };
        await Confession.updateOne(
            {userId: userId},
            {
                $push: {
                    data: data,
                },
            },
            { upsert: true }
        );
    } else {
        await Confession.updateOne(
            {userId: userId},
            {
                $push: {
                    data: {
                        title: messageFormat[0],
                    },
                },
            },
            { upsert: true }
        );
    }

    ctx.session.logging = false;
    const sentMessage = await ctx.reply(responseConfessionMessage());

    // Xóa tin nhắn sau 30s
    setTimeout(async () => {
        try {
            await ctx.deleteMessage(ctx.message.message_id);
            await ctx.deleteMessage(sentMessage.message_id);
            // await ctx.deleteMessage(ctx.session.sentMessageId);
            // ctx.session = {};
        } catch (error) {
            console.log(error)
            ctx.reply("Có lỗi rồi bạn ơi 🥹");
        }
    }, 30000);
}

module.exports = addConfessionHandler;
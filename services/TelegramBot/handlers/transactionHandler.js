const User = require("../../../models/user.model");
const BudgetTracker = require("../../../models/budgetTracker.model");
const formSendUser = require("../utils/formSendUser");
const {deleteMessageUtil} = require("../utils/deleteMessage.util");

const transactionHandler = async (message, ctx) => {
    if (message.startsWith("t")) {
        const messageFormat = message.slice(2).match(/^(.+?)\s(\d+)\s*(.+)?$/);
        /* Example input
            {
                "description": "Com trua",
                "amount": 20000,
                "type": "expense",
                "date": '2024-08-14T17:00:00.000Z',
            }
         */

        // Kiểm tra xem các trường bắt buộc có tồn tại và hợp lệ hay không
        if (!messageFormat[1] || !messageFormat[2]) return;

        const userId = ctx.session.userId;
        const data = {
            description: messageFormat[1],
            amount: Number(messageFormat[2]),
            type: "income",
            date: new Date(),
            userId: String(userId)
        }

        try {
            const newRecord = new BudgetTracker(data);
            await newRecord.save();

            const sentMessage = await ctx.reply(formSendUser.recordedSuccessfully(message), {
                parse_mode: "HTML",
            });

            // console.log(ctx, ctx.message.message_id, sentMessage.message_id)

            // Delete Message
            await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id)
        } catch (error) {
            console.log(error)
            ctx.reply("Lỗi rồi trời ơi, báo lại với Thanh Loi ngay đi 😤😤😤");
        }
    } else {
        const messageFormat = message.match(/^(.+?)\s(\d+)\s*(.+)?$/);

        // Kiểm tra xem các trường bắt buộc có tồn tại và hợp lệ hay không
        if (!messageFormat[1] || !messageFormat[2]) return;

        const userId = ctx.session.userId;
        const data = {
            description: messageFormat[1],
            amount: Number(messageFormat[2]),
            type: "expense",
            date: new Date(),
            userId: String(userId)
        }

        try {
            const newRecord = new BudgetTracker(data);
            await newRecord.save();

            const sentMessage = await ctx.reply(formSendUser.recordedSuccessfully(message), {
                parse_mode: "HTML",
            });

            // Delete Message
            await deleteMessageUtil(ctx, ctx.message.message_id, sentMessage.message_id)
        } catch (error) {
            ctx.reply("Lỗi rồi trời ơi, báo lại với Thanh Loi ngay đi 😤😤😤");
        }
    }
}

module.exports = {transactionHandler}
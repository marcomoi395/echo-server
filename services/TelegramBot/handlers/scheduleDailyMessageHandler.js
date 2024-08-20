const cron = require("node-cron");
const formSendUser = require("../utils/formSendUser");
const morningMessage = require("../utils/morningMessage");
const User = require("../../../models/user.model");

function sendEveryAfternoon(bot, userId) {
    cron.schedule(
        "00 12 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                userId,
                formSendUser.expenseNoteReminderAfternoon,
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        userId,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

function sendEveryEvening(bot, userId) {
    cron.schedule(
        "30 18 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                userId,
                formSendUser.expenseNoteReminderEvening,
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        userId,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

function sendGoodMorningWishes(bot, userId) {
    cron.schedule(
        "30 6 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                userId,
                morningMessage(),
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        userId,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

function requestToSubmitConfession(bot, userId) {
    cron.schedule(
        "00 23 * * *",
        async () => {
            const sentMessage = await bot.telegram.sendMessage(
                userId,
                formSendUser.confessionReminder,
                {
                    parse_mode: "HTML",
                },
            );

            setTimeout(async () => {
                try {
                    await bot.telegram.deleteMessage(
                        userId,
                        sentMessage.message_id,
                    );
                } catch (error) {
                    console.error("Không thể xóa tin nhắn:", error);
                }
            }, 10800000);
        },
        {
            scheduled: true,
            timezone: "Asia/Ho_Chi_Minh",
        },
    );
}

module.exports = async (bot, ctx) => {
    const users = await User.find({ idAccountTelegram: { $exists: true } });

    if(users){
        users.forEach(user => {
            const userId = user.idAccountTelegram;

            sendEveryAfternoon(bot, userId);
            sendEveryEvening(bot, userId);
            sendGoodMorningWishes(bot, userId);
            requestToSubmitConfession(bot, userId);
        });
    }

};


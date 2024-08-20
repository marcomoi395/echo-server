function getTimeUntilEndOfDay() {
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // Lúc 0:00 của ngày hôm sau
    return endOfDay - now;
}

const deleteMessageUtil = async (ctx, userMessageId, sentMessageId, time = getTimeUntilEndOfDay()) => {
    if(userMessageId) {
        // Xóa tin nhắn của người dùng
        await ctx.deleteMessage(userMessageId);
    }

    if(sentMessageId) {
        // Xóa tin nhắn của bot vào cuối ngày
        setTimeout(async () => {
            try {
                await ctx.deleteMessage(sentMessageId);
            } catch (error) {
            }
        }, time);
    }
}

module.exports = {deleteMessageUtil}
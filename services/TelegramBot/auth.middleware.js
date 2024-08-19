const User = require("../../models/user.model");

async function auth(ctx, next) {
    const id = ctx.message.from.id;

    try{
        const user = await User.findOne({idAccountTelegram: String(id)}).select("_id").exec();

        if (user) {
            if (!ctx.session) ctx.session = {};
            ctx.session.userId = user._id;
            return next();
        } else {
            ctx.reply("Bạn không có quyền sử dụng bot này. Hãy liên kết với EchoWeb nha 👻👻");
        }
    }
    catch(err) {
        ctx.reply("Lỗi rồi trời ơi, báo lại với Thanh Loi ngay đi 😤😤😤");
    }

}

module.exports = { auth };

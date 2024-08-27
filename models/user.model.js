const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        thumbnail: String,
        phone: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        idAccountTelegram: String,
        confessionPassword: String,
        refreshToken: {
            type: [String],
            default: [],
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User", userSchema, "user");

module.exports = User;

const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
    {
        userId: String,
        password: String,
        data: [
            {
                date: {
                    type: Date,
                    default: Date.now()
                },
                title: String,
                content: {
                    type: String,
                    required: true
                },
            }
        ]
    },
    {
        timestamps: true,
    },
);

const Confession = mongoose.model("Confession", confessionSchema, "confession");

module.exports = Confession;

const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
    {
        userId: String,
        data: [
            {
                date: {
                    type: Date,
                    default: Date.now()
                },
                title: {
                    type: String,
                    required: true,
                },
                content: String,
            }
        ]
    },
    {
        timestamps: true,
    },
);

const Confession = mongoose.model("Confession", confessionSchema, "confession");

module.exports = Confession;

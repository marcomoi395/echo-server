const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: String,
        status: {
            type: String,
            required: true,
        },
        dueDate: Date,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const Task = mongoose.model("Task", taskSchema, "tasks");

module.exports = Task;


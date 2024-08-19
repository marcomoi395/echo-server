const BudgetTracker = require("../../../models/budgetTracker.model");

const getAmountHandler = async (ctx, message) => {
    // today Expense
    const type = message[0];
    const time = message[1];
    const userId = String(ctx.session?.userId);
    console.log(time, type, userId)
    if(!time || !type || !userId) return null;

    let find = {
        userId: userId, deleted: false, type: type.toLowerCase()
    };

    const now = new Date();
    let startDate, endDate;

    if (time && (time === 'today' || time === 'week' || time === 'month')) {
        if (time === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
            endDate = new Date(now.setHours(23, 59, 59, 999));
        } else if (time === 'week') {
            const day = now.getDay();
            const diff = (day === 0 ? -6 : 1) - day;
            startDate = new Date(now.setDate(now.getDate() + diff));
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
        } else if (time === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Ngày đầu tiên của tháng
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Ngày cuối cùng của tháng
            endDate.setHours(23, 59, 59, 999);
        }

        find.date = {$gte: startDate, $lte: endDate};
    }

    try {
        const result = await BudgetTracker.find(find).exec();

        return result.reduce((sum, item) => sum + item.amount, 0);
    }
    catch (err) {
        console.log(err)
        return null;
    }
}

module.exports = getAmountHandler;
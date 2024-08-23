const BudgetTracker = require('../models/budgetTracker.model');
const {response} = require("express");
require('dotenv').config();

// GET /
const handleGetItems = async (req, res) => {
    const userId = req.userId;
    const {time, page, pageSize, type} = req.query;
    let sort;
    if(req.query?.sort){
        sort = JSON.parse(req.query?.sort);
    }
    else{
        sort = {key: 'date', value: -1};
    }

    let find = {
        userId: userId, deleted: false
    };

    if (type && (type === 'income' || type === 'expense')) {
        find.type = type;
    }

    const now = new Date();
    let startDate, endDate;

    if (time && (time === 'today' || time === 'weekly' || time === 'monthly')) {
        if (time === 'today') {
            startDate = new Date(now.setHours(0, 0, 0, 0));
            endDate = new Date(now.setHours(23, 59, 59, 999));
        } else if (time === 'weekly') {
            const day = now.getDay();
            const diff = (day === 0 ? -6 : 1) - day;
            startDate = new Date(now.setDate(now.getDate() + diff));
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
        } else if (time === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Ngày đầu tiên của tháng
            startDate.setHours(0, 0, 0, 0);

            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Ngày cuối cùng của tháng
            endDate.setHours(23, 59, 59, 999);
        }

        find.date = {$gte: startDate, $lte: endDate};
    }

    try {
        const result = await BudgetTracker
            .find(find)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({
                [sort.key.toLowerCase()]: sort.value
            }).exec();

        // Truy vấn tổng số lượng item
        const {type, ...newFind} = find
        const totalItems = await BudgetTracker.find(newFind).countDocuments();

        // Truy vấn tổng số lượng item
        const totalIncomeItems = await BudgetTracker.find({...find, type: "income"}).countDocuments();

        // Tính toán tổng số trang
        const totalPages = Math.ceil(totalItems / pageSize);

        res.json({
            result, totalItems, totalPages, currentPage: page, totalIncomeItems
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'});
    }
};

// POST /add
const handleAddItem = async (req, res) => {
    const userId = req.userId
    const data = req.body;

    /* Example input
    {
        "description": "Com trua",
        "amount": 20000,
        "type": "expense",
        "date": '2024-08-14T17:00:00.000Z',
    }
    */

    // Kiểm tra xem các trường bắt buộc có tồn tại và hợp lệ hay không
    if (!data.description || !data.amount || !data.type || !data.date) {
        return res.status(400).json({error: 'Request complete information.'});
    }

    data.amount = Number(data.amount)
    data.userId = userId;

    try {
        const newRecord = new BudgetTracker(data);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'An error occurred while saving the record.'});
    }
}

// DELETE budget-tracker/delete
const handleDeleteItem = async (req, res) => {
    const userId = req.userId;
    const {idList} = req.body;

    try {
        const result = await BudgetTracker.deleteMany({ _id: { $in: idList } })

        if (result?.deletedCount === 0) {
            res.status(404).json({error: 'Item not found or already deleted'});
        } else {
            res.status(200).json({message: 'Item deleted successfully'});
        }
    } catch (e) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'});
    }
};


module.exports = {handleGetItems, handleAddItem, handleDeleteItem}
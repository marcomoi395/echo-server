const Confession = require('../models/confession.model');
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
require('dotenv').config();

// POST /
const handleGetItems = async (req, res) => {
    const userId = req.userId;
    const {time} = req.query;
    const {pinCode} = req.body;

    console.log(pinCode)

    const find = {
        userId: userId, ...(time && time.startDate && time.endDate && {
            data: {
                $elemMatch: {
                    date: {$gte: time.startDate, $lte: time.endDate}
                }
            }
        }),
    }

    try {
        const user = await User.findOne({_id: userId}).exec();
        const isVerify = await bcrypt.compare(pinCode, user?.confessionPassword);
        if (!isVerify) {
            return res.status(401).json({error: 'Incorrect password'});
        }

        const result = await Confession.findOne(find).exec();

        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Internal server error'});
    }
};

// POST /createPassword
const handleCreatePasswordConfession = async (req, res) => {
    const userId = req.userId;
    let {password} = req.body;

    try {
        const user = await User.findOne({_id: userId});

        if (user?.confessionPassword) {
            return res.status(401).json({error: 'Password has been created'});
        } else {
            // Hash pass
            password = await bcrypt.hash(password, Number(process.env.BCRYPTSALT));
            const updatePassword = await User.updateOne({_id: userId}, {confessionPassword: password})

            if (updatePassword.modifiedCount) {
                return res.status(200).json({'success': `Password created!`})
            } else {
                return res.status(401).json({error: 'Internal server error'});
            }
        }
    } catch (err) {
        res.status(500).json({error: 'Internal server error'});
    }
}

// POST /add
// const handleAddItem = async (req, res) => {
//     const userId = req.userId
//     const data = req.body;
//
//     /* Example input
//     {
//         "description": "Com trua",
//         "amount": 20000,
//         "type": "expense",
//         "date": '2024-08-14T17:00:00.000Z',
//     }
//     */
//
//     // Kiểm tra xem các trường bắt buộc có tồn tại và hợp lệ hay không
//     if (!data.description || !data.amount || !data.type || !data.date) {
//         return res.status(400).json({error: 'Request complete information.'});
//     }
//
//     data.amount = Number(data.amount)
//     data.userId = userId;
//
//     try {
//         const newRecord = new BudgetTracker(data);
//         await newRecord.save();
//         res.status(201).json(newRecord);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({error: 'An error occurred while saving the record.'});
//     }
// }
//
// // DELETE budget-tracker/delete
// const handleDeleteItem = async (req, res) => {
//     const userId = req.userId;
//     const {idList} = req.body;
//
//     try {
//         const result = await BudgetTracker.deleteMany({ _id: { $in: idList } })
//
//         if (result?.deletedCount === 0) {
//             res.status(404).json({error: 'Item not found or already deleted'});
//         } else {
//             res.status(200).json({message: 'Item deleted successfully'});
//         }
//     } catch (e) {
//         console.log(error)
//         res.status(500).json({error: 'Internal server error'});
//     }
// };


module.exports = {handleGetItems, handleCreatePasswordConfession}
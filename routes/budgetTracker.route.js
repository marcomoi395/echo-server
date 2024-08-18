const express = require('express');
const router = express.Router();
const {handleGetItems, handleAddItem, handleDeleteItem} = require('../controllers/budgetTracker.controller');

router.get('/', handleGetItems)

router.post('/add', handleAddItem)

router.delete('/delete', handleDeleteItem);

module.exports = router;


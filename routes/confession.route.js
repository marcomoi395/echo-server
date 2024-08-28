const express = require('express');
const router = express.Router();
const {handleGetItems, handleCreatePasswordConfession, handleAddItem} = require('../controllers/confession.controller');

router.post('/', handleGetItems)

router.post('/createPassword', handleCreatePasswordConfession)

router.post('/add', handleAddItem)
//
// router.delete('/delete', handleDeleteItem);

module.exports = router;


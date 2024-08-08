const express = require('express');
const router = express.Router();
const {index, detail, add, update, remove, changeStatus} = require('../controllers/task.controller');

router.get('/', index)

router.get('/detail/:id', detail)

router.post('/add', add)

router.patch('/edit/:id', update)

router.patch('/delete/', remove)

router.patch('/change-status', changeStatus)

module.exports = router;
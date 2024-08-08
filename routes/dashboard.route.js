const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const user = res.locals.user;
    res.send(user);
})

module.exports = router;
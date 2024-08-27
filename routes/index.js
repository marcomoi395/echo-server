const taskRouter = require('./task.route')
const dashboardRouter = require('./dashboard.route')
const authRouter = require('./auth.route')
const budgetTrackerRouter = require('./budgetTracker.route')
const confessionRouter = require('./confession.route')
const verifyJWT = require('../middlewares/verifyJWT')

module.exports = (app) => {
    app.use('/auth', authRouter);

    app.use(verifyJWT);

    app.get('/', (req, res) => {
        res.redirect('/dashboard');
    });

    app.use('/dashboard', dashboardRouter);

    app.use('/task', taskRouter);

    app.use('/budget-tracker', budgetTrackerRouter)

    app.use('/confession', confessionRouter)
}
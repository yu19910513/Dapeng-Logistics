const router = require('express').Router();
const userRoutes = require('./user_route');
const boxRoutes = require('./box-route');
const accountRoutes = require('./account-route');
const batchRoutes = require('./batch-route');

router.use('/user', userRoutes);
router.use('/box', boxRoutes);
router.use('/account', accountRoutes);
router.use('/batch', batchRoutes);
module.exports = router;

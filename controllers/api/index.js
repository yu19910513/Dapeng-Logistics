const router = require('express').Router();
const userRoutes = require('./user_route');
const boxRoutes = require('./box-route');
const accountRoutes = require('./account-route');
const batchRoutes = require('./batch-route');
const containerRoutes = require('./container-route.js');
const itemRoutes = require('./item-route');
const recordRoutes = require('./record-route')

router.use('/user', userRoutes);
router.use('/box', boxRoutes);
router.use('/account', accountRoutes);
router.use('/batch', batchRoutes);
router.use('/item', itemRoutes);
router.use('/container', containerRoutes);
router.use('/record', recordRoutes);
module.exports = router;

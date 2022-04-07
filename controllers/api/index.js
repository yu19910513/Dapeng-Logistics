const router = require('express').Router();
const userRoutes = require('./user_route');
const boxRoutes = require('./box-route');
const accountRoutes = require('./account-route');
const batchRoutes = require('./batch-route');
const containerRoutes = require('./container-route.js');
const itemRoutes = require('./item-route')

router.use('/user', userRoutes);
router.use('/box', boxRoutes);
router.use('/account', accountRoutes);
router.use('/batch', batchRoutes);
router.use('/item', itemRoutes)
router.use('/container', containerRoutes)
module.exports = router;

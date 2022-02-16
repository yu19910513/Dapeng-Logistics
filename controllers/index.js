const router = require('express').Router();
const api = require('./api');
const home = require('./home_route');
const dashboard = require('./dashboard_route');


router.use('/', home);
router.use('/api', api);
router.use('/dashboard', dashboard);

module.exports = router;

const router = require('express').Router();
const userRoutes = require('./user_route');


router.use('/user', userRoutes);


module.exports = router;

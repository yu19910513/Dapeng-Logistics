const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

//create new account
router.post('/', withAuth, (req, res) => {
    Account.create({
        user_id: req.session.user_id,
        name: req.body.name,
        prefix: req.body.prefix
    }).then(dbAccounttData => res.json(dbAccounttData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

//create new account
router.post('/', withAuth, (req, res) => {
    Account.create({
        user_id: 3,
        name: req.body.name,
        prefix: req.body.prefix
    }).then(dbAccounttData => res.json(dbAccounttData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/amazon_newAccount', withAuth, (req, res) => {
  Account.create({
      user_id: req.body.user_id,
      name: req.body.name,
      prefix: req.body.prefix
  }).then(dbAccounttData => res.json(dbAccounttData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/destroy/:key', withAuth, (req, res) => {
  Account.destroy({
      where: {
        id: req.params.key
      }
    })
      .then(dbAccountData => {
        if (!dbAccountData) {
          res.status(404).json({ message: 'No Account found with this id' });
          return;
        }
        res.json(dbAccountData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});
module.exports = router;

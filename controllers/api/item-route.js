const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

router.put('/account_merge', withAuth, (req, res) => {
    Item.update({
        account_id: req.body.account_id_2
      },
      {
        where: {
            account_id: req.body.account_id
        }
      })
      .then(dbItemData => {
        if (!dbItemData[0]) {
          res.status(404).json({ message: 'This Item does not exist!' });
          return;
        }
        res.json(dbItemData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;

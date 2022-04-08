const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

router.put('/account_merge', withAuth, (req, res) => {
    Container.update({
        account_id: req.body.account_id_2
      },
      {
        where: {
            account_id: req.body.account_id
        }
      })
      .then(dbContainerData => {
        if (!dbContainerData[0]) {
          res.status(404).json({ message: 'This Container does not exist!' });
          return;
        }
        res.json(dbContainerData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

router.get('/amazon_container/:key', withAuth, async (req, res) => {
  try {
    const singleContainer = await Container.findOne({
      where: {
        container_number: req.params.key
      },
      attributes: [
        'id'
      ]
    });
    const data = singleContainer.get({plain: true});
    res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});
module.exports = router;

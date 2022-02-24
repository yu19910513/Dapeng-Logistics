const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');


router.get('/account', withAuth, async (req, res) => {
  try {
  const accountDB = await Account.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'name',
    ]
  });
  const accounts = accountDB.map(account => account.get({plain: true}));
  res.json(accounts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});



router.post('/', (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin
  })
  .then(userDB => {
    req.session.save(() => {
      req.session.user_id = userDB.id;
      req.session.name = userDB.name;
      req.session.loggedIn = true;
      req.session.admin = userDB.admin;

      res.json(userDB);
    });
  });
});

// LOGIN FUNCTION <==> LOGIN.JS
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(userDB => {
    if (!userDB) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = userDB.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userDB.id;
      req.session.name = userDB.name;
      req.session.loggedIn = true;
      req.session.admin = userDB.admin;

      res.json({ user: userDB, message: 'You are now logged in!' });
    });
  });
});

// LOGOUT FUNCTION <==> LOGOUT.JS
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});
module.exports = router;
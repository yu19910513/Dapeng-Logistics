const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

//get account info and send back to in-browawer js
router.get('/account', withAuth, async (req, res) => {
  try {
  const accountDB = await Account.findAll({
    order: [
      ["name", "ASC"]
    ],
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'name',
      'prefix'
    ]
  });
  const accounts = accountDB.map(account => account.get({plain: true}));
  res.json(accounts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all user info
router.get('/', withAuth, async (req, res) => {
  try {
  const userDB = await User.findAll({
    where: {
      admin: false
    },
    attributes: [
      'id',
      'name'
    ]
  });
  const users = userDB.map(user => user.get({plain: true}));
  res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get account info per selected user id
router.get('/account_per_user', withAuth, async (req, res) => {
  try {
  const accountDB = await Account.findAll({
    attributes: [
      'id',
      'name',
      'prefix'
    ],
    include:
      {
        model: User,
        attributes: [
         'name',
         'id'
        ]
      },
  });
  const accounts = accountDB.map(account => account.get({plain: true}));
  const data = accounts.reduce(function (r, a) {
    r[a.user.id] = r[a.user.id] || [];
    r[a.user.id].push(a);
    return r;
  }, Object.create(null));
  res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get bactch info and send back to in-browawer js
router.get('/batch', withAuth, async (req, res) => {
  try {
  const batchDB = await Batch.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'asn',
      'pending_date',
      'total_box',
      'account_id'
    ]
  });
  const batches = batchDB.map(batch => batch.get({plain: true}));
  res.json(batches);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//create user info
router.post('/', (req, res) => {
  try {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin,
      username: req.body.username
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

// LOGIN FUNCTION <==> LOGIN.JS
router.post('/login', (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(userDB => {
    if (!userDB) {
      res.status(400).json({ message: 'No user with that username!' });
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

// get box info and send back to in-browawer js
router.get('/box', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        status:2
      },
      attributes: [
        's3',
        'notes',
        'id',
        'box_number',
        'description',
        'cost',
        'requested_date',
        'received_date',
        'shipped_date',
        'order',
        'qty_per_box',
        'length',
        'width',
        'height',
        'weight',
        'volume',
        'status',
        'location',
        'sku',
        'file',
        'file_2',
        'fba'
      ],
      include: [
        {
          model: Batch,
          attributes: [
            'asn',
            'pending_date',
            'total_box'
          ]
        },
        {
          model: Account,
          attributes: [
            'name'
          ]
        },
        {
          model: User,
          attributes: [
            'id',
            'name',
            'email'
          ]
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    const data = boxes.reduce(function (r, a) {
      r[a.s3] = r[a.s3] || [];
      r[a.s3].push(a);
      return r;
    }, Object.create(null));
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.get('/allBox', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        user_id: req.session.user_id,
        status: [0,1,2,3]
      },
      attributes: [
        's3',
        'notes',
        'id',
        'box_number',
        'description',
        'cost',
        'requested_date',
        'received_date',
        'shipped_date',
        'order',
        'qty_per_box',
        'length',
        'width',
        'height',
        'weight',
        'volume',
        'status',
        'location',
        'sku',
        'file',
        'file_2',
        'fba'
      ],
      include: [
        {
          model: Batch,
          attributes: [
            'asn',
            'pending_date',
            'total_box'
          ]
        },
        {
          model: Account,
          attributes: [
            'name'
          ]
        },
        {
          model: User,
          attributes: [
            'id',
            'name',
            'email'
          ]
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.json(boxes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//billing box data
router.get('/billing_per_user', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        status:[1,2,3]
      },
      attributes: [
        'id',
        'box_number',
        'description',
        'cost',
        'requested_date',
        'received_date',
        'shipped_date',
        'weight',
        'volume',
        'status',
        'fba',
        'bill_received',
        'bill_shipped',
        'bill_storage'
      ],
      include: [
        {
          model: Account,
          attributes: [
            'id',
            'name'
          ]
        },
        {
          model: User,
          attributes: [
            'id',
            'name'
          ]
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    const data = boxes.reduce(function (r, a) {
      r[a.user.id] = r[a.user.id] || [];
      r[a.user.id].push(a);
      return r;
    }, Object.create(null));
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//additional charge data
router.get('/xc_per_user', withAuth, async (req, res) => {
  try {
    const xcData = await Box.findAll({
      where: {
        status:[4]
      },
      attributes: [
        'id',
        'box_number',
        'description',
        'cost',
        'order',
        'qty_per_box',
        'requested_date',
        'shipped_date',
        'fba',
        'bill_received',
        'bill_shipped',
        'bill_storage'
      ],
      include: [
        {
          model: Account,
          attributes: [
            'id',
            'name'
          ]
        },
        {
          model: User,
          attributes: [
            'id',
            'name'
          ]
        }
      ]
    });
    const extra_charges = xcData.map(charge => charge.get({ plain: true }));
    const data = extra_charges.reduce(function (r, a) {
      r[a.user.id] = r[a.user.id] || [];
      r[a.user.id].push(a);
      return r;
    }, Object.create(null));
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});



module.exports = router;

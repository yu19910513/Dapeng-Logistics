const router = require('express').Router();
const { route } = require('.');
const sequelize = require('../config/connection');
const {User, Account, Batch, Box, Container, Item} = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');
const { uploadFile, getFile} = require('../utils/s3');

router.get('/', withAuth, async (req, res) => {
  try {
    const accountData = await Account.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: [
        'id',
        'name'
      ],
      include: [
        {
          model: Box,
          where: {status: [0,1,2]},
          attributes: [
            'box_number'
          ]
        }
      ],
      order: [
        ["name", "ASC"],
      ],
    });
    const pre_accounts = accountData.map(account => account.get({ plain: true }));
    console.log(accounts);
    var accounts = [];
    for (let i = 0; i < pre_accounts.length; i++) {
      const element = pre_accounts[i].boxes[0];
      if (element) {
        accounts.push(pre_accounts[i]);
      };
    }
    res.render('home', {
      accounts,
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.get('/master', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        user_id: req.session.user_id,
        status: [0, 1, 2, 3]
      },
      attributes: [
        'tracking',
        'batch_id',
        'id',
        'box_number',
        'description',
        'cost',
        'received_date',
        'requested_date',
        'shipped_date',
        'order',
        'status',
        'sku',
        'file',
        'qty_per_box'
      ],
      include: [
        {
          model: Batch,
          attributes: [
            'pending_date',
            'total_box'
          ]
        },
        {
          model: Account,
          attributes: [
            'name'
          ]
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    // boxes = [];
    // for (let i = 0; i < 50; i++) {
    //   boxes.push(boxe[i])
    // };
    res.render('master_home', {
      boxes,
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//client request page
router.get('/request', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        user_id: req.session.user_id,
        status: 1
      },
      attributes: [
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
        'notes'
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
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.render('request', { boxes, loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/request_amazon', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        user_id: req.session.user_id,
        status: 1,
      },
      attributes: [
        'id',
        'user_id',
        'account_id',
        's3',
        'notes',
        'id',
        'container_number',
        'description',
        'cost',
        'requested_date',
        'received_date',
        'shipped_date',
        'type',
        'length',
        'width',
        'height',
        'weight',
        'volume',
        'status',
        'location',
        'file',
        'file_2',
        'fba',
        'bill_received',
        'bill_storage',
        'bill_shipped'
      ],
      include:
        {
          model: Account,
          attributes: [
            'name'
          ]
        }
    });
    const containers = containerData.map(container => container.get({ plain: true }));
    res.render('request_amazon', {containers, loggedIn: true, admin: req.session.admin, name: req.session.name, accountId: req.params.id});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/amazon', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        user_id: req.session.user_id,
        status: [0,1,2,3]
      },
        attributes: [
          'id',
          'user_id',
          'account_id',
          's3',
          'notes',
          'id',
          'container_number',
          'description',
          'cost',
          'requested_date',
          'received_date',
          'shipped_date',
          'type',
          'length',
          'width',
          'height',
          'weight',
          'volume',
          'status',
          'location',
          'file',
          'file_2',
          'fba',
          'bill_received',
          'bill_storage',
          'bill_shipped'
        ],
          include: [
            {
          model: Account,
          attributes: [
            'name'
          ]
            }
          ]
      })
    const containers = containerData.map(container => container.get({ plain: true }));
    res.render('master_home_amazon', {
      containers,
      loggedIn: true,
      accountId: req.params.id,
      admin: req.session.admin,
      name: req.session.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//log in page
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

//client new order page
router.get('/neworder/', withAuth, (req, res) => {
    res.render('neworder', { loggedIn: true })
});

//user signup page
router.get('/signup/', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
    res.render('signup');
});

router.get('/merger', withAuth, (req, res) => {
  try {
    res.render('merger', {loggedIn: true, admin: req.session.admin, name: req.session.name});
  } catch (error) {
    res.status(500).json(error)
  }
})

//admin request-handling page (manual)
router.get('/admin_move', withAuth, async (req, res) => {
    try {
      const boxData = await Box.findAll({
        where: {
          status:2
        },
        attributes: [
          'tracking',
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
      res.render('move', { boxes, loggedIn: true, admin: req.session.admin, name: req.session.name });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

});

router.get('/admin_move_amazon', withAuth, async (req, res) => {
  try {
    const itemData = await Item.findAll({
        attributes: [
          'id',
          'item_number',
          'qty_per_sku',
          'container_id',
          'account_id',
          'user_id',
          'description'
        ],
        include: [
          {
            model: Container,
            where: {
              status:2
            },
            attributes: [
              'id',
              'container_number',
              'description',
              'cost',
              'requested_date',
              'received_date',
              'location',
              'file',
              'file_2',
              'notes',
              's3',
              'fba'
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
            ]
          }
        ]
      });
      const items = itemData.map(item => item.get({ plain: true }));
      const requestsBatch = items.reduce(function (r, a) {
        r[a.description] = r[a.description] || [];
        r[a.description].push(a);
        return r;
      }, Object.create(null));
      const requests = Object.values(requestsBatch);
    res.render('move_amazon', { requests, loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});//////////////////////// to be continued ***************************

//admin receving page
router.get('/admin_receiving', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        status:0
      },
      attributes: [
        'tracking',
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
    res.render('receive', { boxes, loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//barcode generation per batch id
router.get('/batch/:id', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        batch_id: req.params.id,
        user_id: req.session.user_id
      },
      order: [
        ["box_number", "ASC"]
      ],
        attributes: [
      'id',
      'box_number',
      'description',
      'cost',
      'received_date',
      'requested_date',
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
        ],
          include: [
        {
        model: Batch,
        attributes:
        [
          'asn',
          'pending_date',
          'total_box'
          ]},
        {
          model: Account,
          attributes: [
            'name'
          ]
        }
          ]
    })
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.render('shipping_label', {
      boxes,
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name,
      account: boxes[0].account.name,
      date: boxes[0].batch.pending_date
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  })

// admin auto receiving page
router.get('/admin_receiving_main', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        status:0
      },
      attributes: [
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
        'notes',
        's3'
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
    res.render('receiving_main', { boxes, loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//admin request-handling page (in cards)
router.get('/admin_move_main', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        status:2
      },
      attributes: [
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
        'notes',
        's3',
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
    const result = boxes.reduce(function (r, a) {
      r[a.s3] = r[a.s3] || [];
      r[a.s3].push(a);
      return r;
    }, Object.create(null));
    const data = Object.values(result);
    res.render('dynamic_move', { data, loggedIn: true, admin: req.session.admin, name: req.session.name});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//admin request-handling page amazon (in cards)
router.get('/admin_move_main_amazon', withAuth, async (req, res) => {
  try {
    const itemData = await Item.findAll({
      attributes: [
        'id',
        'item_number',
        'qty_per_sku',
        'container_id',
        'account_id',
        'user_id',
        'description'
      ],
      include: [
        {
          model: Container,
          where: {
            status:2
          },
          attributes: [
            'id',
            'container_number',
            'description',
            'cost',
            'requested_date',
            'received_date',
            'location',
            'file',
            'file_2',
            'notes',
            's3',
            'fba'
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
          ]
        }
      ]
    });
    const items = itemData.map(item => item.get({ plain: true }));
    const requestsBatch = items.reduce(function (r, a) {
      r[a.container_id] = r[a.container_id] || [];
      r[a.container_id].push(a);
      return r;
    }, Object.create(null));
    const requests = Object.values(requestsBatch);
    res.render('dynamic_move_amazon', {requests, loggedIn: true, admin: req.session.admin, name: req.session.name});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//render single pre-ship scanning page
router.get('/admin_pre_ship', withAuth, (req, res) => {
  try {
    res.render('pre_ship', {loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/admin_pre_ship_amazon/:id', withAuth, async (req, res) => {
    try {
      const itemData = await Item.findAll({
        where: {
          container_id: req.params.id
        },
        attributes: [
          'id',
          'item_number',
          'qty_per_sku',
          'container_id',
          'account_id',
          'user_id',
          'description'
        ],
        include: [
          {
            model: Container,
            where: {
              status:2
            },
            attributes: [
              'id',
              'container_number',
              'description',
              'cost',
              'requested_date',
              'received_date',
              'location',
              'file',
              'file_2',
              'notes',
              's3',
              'fba'
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
            ]
          }
        ]
      });
      const items = itemData.map(item => item.get({ plain: true }));
      const requestsBatch = items.reduce(function (r, a) {
        r[a.description] = r[a.description] || [];
        r[a.description].push(a);
        return r;
      }, Object.create(null));
      const requests = Object.values(requestsBatch);
      res.render('pre_ship_amazon', {requests, loggedIn: true, admin: req.session.admin, name: req.session.name});
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

  });

//billing page
router.get('/billing', withAuth, async (req, res) => {
  try {
    res.render('billing', {
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

//client pending order page (in cards)
router.get('/client_label', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        status:0,
        user_id: req.session.user_id,
      },
      attributes: [
        'batch_id',
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
        'notes',
        's3'
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
    const result = boxes.reduce(function (r, a) {
      r[a.batch_id] = r[a.batch_id] || [];
      r[a.batch_id].push(a);
      return r;
    }, Object.create(null));
    const data = Object.values(result);
    res.render('client_label', { data, loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//redner box-allocation page
router.get('/box_location', withAuth, async (req, res) => {
  try {
    res.render('box_location', {loggedIn: true, admin: req.session.admin, name: req.session.name });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

//file url (public) --> may need to add withAuth
router.get('/pdf/:key', (req, res) => {
  const key = req.params.key;
  const readStream = getFile(key);
  readStream.pipe(res)
});

//client single barcode page
router.get('/box/:id', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        box_number: req.params.id,
        user_id: req.session.user_id
      },
        attributes: [
      'id',
      'box_number',
      'description',
      'cost',
      'received_date',
      'requested_date',
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
        ],
          include: [
        {
        model: Batch,
        attributes:
        [
          'asn',
          'pending_date',
          'total_box'
          ]},
        {
          model: Account,
          attributes: [
            'name'
          ]
        }
          ]
    })
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.render('shipping_label', {
      boxes,
      loggedIn: true,
      admin: req.session.admin,
      name: req.session.name,
      account: boxes[0].account.name,
      date: boxes[0].batch.pending_date
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/account/:id', withAuth, async (req, res) => {
    try {
      const boxData = await Box.findAll({
        where: {
          account_id: req.params.id,
          user_id: req.session.user_id,
          status: [0,1,2,3]
        },
          attributes: [
        'account_id',
        'batch_id',
        'id',
        'box_number',
        'description',
        'cost',
        'received_date',
        'requested_date',
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
          ],
            include: [
          {
          model: Batch,
          attributes:
          [
            'asn',
            'pending_date',
            'total_box',
            'id'
            ]},
          {
            model: Account,
            attributes: [
              'name'
            ]
          }
            ]
      })
      const boxes = boxData.map(box => box.get({ plain: true }));
      res.render('master_home', {
        boxes,
        loggedIn: true,
        accountId: req.params.id,
        admin: req.session.admin,
        name: req.session.name,
        account: boxes[0].account.name,
        date: boxes[0].batch.pending_date
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/amazon/:id', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        account_id: req.params.id,
        user_id: req.session.user_id,
        status: [0,1,2,3]
      },
        attributes: [
          'id',
          'user_id',
          'account_id',
          's3',
          'notes',
          'id',
          'container_number',
          'description',
          'cost',
          'requested_date',
          'received_date',
          'shipped_date',
          'type',
          'length',
          'width',
          'height',
          'weight',
          'volume',
          'status',
          'location',
          'file',
          'file_2',
          'fba',
          'bill_received',
          'bill_storage',
          'bill_shipped'
        ],
          include: [
            {
          model: Account,
          attributes: [
            'name'
          ]
            }
          ]
      })
    const containers = containerData.map(container => container.get({ plain: true }));
    res.render('master_home_amazon', {
      containers,
      loggedIn: true,
      accountId: req.params.id,
      admin: req.session.admin,
      name: req.session.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/request/:id', withAuth, async (req, res) => {
  try {
    const boxData = await Box.findAll({
      where: {
        user_id: req.session.user_id,
        account_id: req.params.id,
        status: 1,
      },
      attributes: [
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
        'notes'
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
        }
      ]
    });
    const boxes = boxData.map(box => box.get({ plain: true }));
    res.render('request', { boxes, loggedIn: true, admin: req.session.admin, name: req.session.name, accountId: req.params.id});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/request_amazon/:id', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        user_id: req.session.user_id,
        account_id: req.params.id,
        status: 1,
      },
      attributes: [
        'id',
        'user_id',
        'account_id',
        's3',
        'notes',
        'id',
        'container_number',
        'description',
        'cost',
        'requested_date',
        'received_date',
        'shipped_date',
        'type',
        'length',
        'width',
        'height',
        'weight',
        'volume',
        'status',
        'location',
        'file',
        'file_2',
        'fba',
        'bill_received',
        'bill_storage',
        'bill_shipped'
      ],
      include:
        {
          model: Account,
          attributes: [
            'name'
          ]
        }
    });
    const containers = containerData.map(container => container.get({ plain: true }));
    res.render('request_amazon', {containers, loggedIn: true, admin: req.session.admin, name: req.session.name, accountId: req.params.id});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/amazon_receiving', withAuth, async(req, res) => {
  try {
    res.render('amazon_receiving', {loggedIn: true, admin: req.session.admin, name: req.session.name});
  } catch (error) {
    res.status(500).json(error)
  }
});

router.get('/amazon_overview', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        user_id: req.session.user_id,
        status: [1,2]
      },
      order: [
        ['container_number', 'ASC']
      ],
        attributes: [
          'id',
          'user_id',
          'account_id',
          's3',
          'notes',
          'id',
          'container_number',
          'description',
          'cost',
          'requested_date',
          'received_date',
          'shipped_date',
          'type',
          'length',
          'width',
          'height',
          'weight',
          'volume',
          'status',
          'location',
          'file',
          'file_2',
          'fba',
          'bill_received',
          'bill_storage',
          'bill_shipped'
        ],
          include: [
            {
          model: Account,
          attributes: [
            'name'
          ]
            }
          ]
      })
    const containers = containerData.map(container => container.get({ plain: true }));
    res.render('amazon_overview', {
      containers,
      loggedIn: true,
      accountId: req.params.id,
      admin: req.session.admin,
      name: req.session.name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

// router.get('/rawData', withAuth, (req, res) => {
//     res.render('rawData');
// });


  module.exports = router

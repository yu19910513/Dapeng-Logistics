const router = require('express').Router();
const { route } = require('.');
const sequelize = require('../config/connection');
const {User, Account, Batch, Box} = require('../models');
const {withAuth, adminAuth} = require('../utils/auth');

//client page
router.get('/', withAuth, async (req, res) => {
    try {
      const boxData = await Box.findAll({
        where: {
          user_id: req.session.user_id
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
          }
        ]
      });
      const boxes = boxData.map(box => box.get({ plain: true }));
      res.render('home', {
        boxes,
        loggedIn: true,
        admin: req.session.admin,
        name: req.session.name,
        shipped_date: req.body.shipped_date,
        received_date: req.body.received_date,
        requested_date: req.body.requested_date
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

//admin request-handling page
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
              'email',
              'wechat'
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
            'email',
            'wechat'
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
            'email',
            'wechat'
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


//client get shipping barcode page after placing an order
// router.get('/shipping_barcode', withAuth, async (req, res) => {
//   try {
//     const boxData = await Box.findAll({
//       where: {
//         batch_id: req.session.batch_id
//       },
//       attributes: [
//         'id',
//         'box_number',
//         'description',
//         'cost',
//         'received_date',
//         'requested_date',
//         'shipped_date',
//         'order',
//         'qty_per_box',
//         'length',
//         'width',
//         'height',
//         'weight',
//         'volume',
//         'status',
//         'location',
//         'sku',
//         'file',
//         'file_2',
//       ],
//       include: [
//         {
//           model: Batch,
//           attributes: [
//             'asn',
//             'pending_date',
//             'total_box'
//           ]
//         },
//         {
//           model: Account,
//           attributes: [
//             'name'
//           ]
//         }
//       ]
//     });
//     const boxes = boxData.map(box => box.get({ plain: true }));
//     res.render('shipping_label', {
//       boxes,
//       loggedIn: true,
//       admin: req.session.admin,
//       name: req.session.name
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }

// });


  module.exports = router

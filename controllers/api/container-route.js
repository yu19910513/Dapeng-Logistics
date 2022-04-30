const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const { uploadFile, getFile} = require('../../utils/s3');
const fs = require('fs');
const util = require('util');
const { log } = require('console');
const unlinkFile = util.promisify(fs.unlink)

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

router.put('/reqContainer', withAuth, (req, res) => {
  Container.update({
      status: req.body.status,
      shipped_date: req.body.shipped_date
    },
    {
      where: {
          id: req.body.id
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
        'id',
        'user_id',
        'account_id',
        'cost',
        'height',
        'width',
        'length'
      ],
      include: [
        {
          model: Account,
          attributes: [
            'name'
          ]
        },
        {
          model: User,
          attributes: [
            'name'
          ]
        }
      ]
    });
      const data = singleContainer.get({plain: true});
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/allContainerAdmin', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        status: [0,1,2,3,4,5,98]
      },
      attributes: [
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
          model: Item,
          attributes: [
            'id',
            'item_number',
            'qty_per_sku'
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
            'name'
          ]
        }
      ]
    });
    const containers = containerData.map(container => container.get({ plain: true }));
    res.json(containers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});

router.get('/container/:id', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        id: req.params.id
      },
      attributes: [
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
        },
        {
          model: User,
          attributes: [
            'name'
          ]
        }
      ]
    });
    const containers = containerData.map(container => container.get({ plain: true }));
    res.json(containers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.put('/updateCost/:cost&:id', withAuth, (req, res) => {
  Container.update({
      cost: req.params.cost
    },
    {
      where: {
        id: req.params.id
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

router.put('/admin_relocating', withAuth, (req, res) => {
  Container.update({
      location: req.body.location_b
    },
      {
      where: {
          container_number: req.body.container_number
      }
    })
    .then(dbContainerData => {
      if (!dbContainerData[0]) {
        res.status(404).json({ message: 'This container does not exist!' });
        return;
      }
      res.json(dbContainerData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/amazon_request', withAuth, (req, res) => {
  Container.create({
    container_number: req.body.container_number,
    account_id: req.body.account_id,
    user_id: req.session.user_id,
    cost: req.body.cost,
    requested_date: new Date().toLocaleDateString("en-US"),
    status: 2,
    type: 2,
    location: req.body.location,
    s3: req.body.s3,
    fba: req.body.fba,
    notes: req.body.notes
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const info = req.body.s3
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const key = result.Key;
  Container.update({
    file: key
  }, {
   where: {
    s3: info
   }
  })
  .then(dbBoxData => {
  if (!dbBoxData[0]) {
    res.status(404).json({ message: 'This Box does not exist!' });
    return;
  }
  res.send({pdfPath: `/pdf/${key}`})
  })
.catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});

router.put('/post-label', withAuth, (req, res) => {
  Container.update({
      status: req.body.status,
      shipped_date: req.body.shipped_date,
      description: `All tasks completed; shipped.`
    },
    {
      where: {
          tracking: req.body.tracking,
          type: req.body.type
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

//upload the second file to AWS and update file_2 when requested is submitted by client
router.post('/upload_2', upload.single('file'), async (req, res) => {
  const file = req.file;
  const info = req.body.s3
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const key = result.Key;
  Container.update({
    file_2: key
  }, {
   where: {
    s3: info
   }
  })
  .then(dbBoxData => {
  if (!dbBoxData[0]) {
    res.status(404).json({ message: 'This Box does not exist!' });
    return;
  }
  res.send({pdfPath: `/pdf/${key}`})
  })
.catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});

router.delete('/destroyBulk', withAuth, (req, res) => {
  Container.destroy({
    where: {
      id: req.body.id
    }
  }).then(dbContainerData => {
    if (!dbContainerData) {
      res.status(404).json({ message: 'No Container found with this id' });
      return;
    }
    res.json(dbContainerData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/amazon_box', withAuth, (req, res) => {
  Container.create({
    container_number: req.body.container_number,
    account_id: req.body.account_id,
    user_id: req.body.user_id,
    description: req.body.description,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    volume: req.body.volume,
    weight: req.body.weight,
    tracking: req.body.tracking,
    type: req.body.type,
    description: `attention: shipping labels required`,
    received_date: new Date().toLocaleDateString("en-US")
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.put('/amazon_label_submission', withAuth, (req, res) => {
  Container.update({
      status: req.body.status,
      requested_date: req.body.requested_date,
      notes: req.body.notes,
      s3: req.body.s3,
      fba: req.body.fba,
      description: 'Labels submitted. Await labeling'
    },
    {
      where: {
        id: req.body.id
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

router.get('/statusTWO', withAuth, async (req, res) => {
  try {
    const containerData = await Container.findAll({
      where: {
        status: [2]
      },
      attributes: [
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
      ]
    });
    const containers = containerData.map(container => container.get({ plain: true }));
    res.json(containers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }

});
module.exports = router;

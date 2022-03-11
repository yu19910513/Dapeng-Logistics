const router = require('express').Router();
const { route } = require('.');
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const { uploadFile, getFile} = require('../../utils/s3');
const fs = require('fs');
const util = require('util');
const { log } = require('console');
const unlinkFile = util.promisify(fs.unlink)


//create new boxes
router.post('/', withAuth, (req, res) => {
  Box.create({
    box_number: req.body.box_number,
    batch_id: req.body.batch_id,
    account_id: req.body.account_id,
    user_id: req.session.user_id,
    description: req.body.description,
    sku: req.body.sku,
    qty_per_box: req.body.qty_per_box,
    order: req.body.order,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//update status from pending to receiving
router.put('/status_admin_receiving', withAuth, (req, res) => {
  Box.update({
      status: req.body.status,
      received_date: req.body.received_date
    },
      {
      where: {
          box_number: req.body.box_number
      }
    })
    .then(dbBoxData => {
      if (!dbBoxData[0]) {
        res.status(404).json({ message: 'This Box does not exist!' });
        return;
      }
      res.json(dbBoxData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update tracking number to box
router.put('/status_admin_receiving_t', withAuth, (req, res) => {
  Box.update({
      tracking: req.body.tracking
    },
      {
      where: {
          box_number: req.body.box_number
      }
    })
    .then(dbBoxData => {
      if (!dbBoxData[0]) {
        res.status(404).json({ message: 'This Box does not exist!' });
        return;
      }
      res.json(dbBoxData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/admin_relocating', withAuth, (req, res) => {
  Box.update({
      location: req.body.location_b
    },
      {
      where: {
          box_number: req.body.box_number
      }
    })
    .then(dbBoxData => {
      if (!dbBoxData[0]) {
        res.status(404).json({ message: 'This Box does not exist!' });
        return;
      }
      res.json(dbBoxData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update status from requested to shipped
router.put('/status_admin_shipping', withAuth, (req, res) => {
  Box.update({
      status: req.body.status,
      shipped_date: req.body.shipped_date
    },
      {
      where: {
          box_number: req.body.box_number
      }
    })
    .then(dbBoxData => {
      if (!dbBoxData[0]) {
        res.status(404).json({ message: 'This Box does not exist!' });
        return;
      }
      res.json(dbBoxData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update status from received to requested
router.put('/status_client', withAuth, (req, res) => {
  Box.update({
      status: req.body.status,
      requested_date: req.body.requested_date,
      custom_1: req.body.custom_1
    },
      {
      where: {
          box_number: req.body.box_number
      }
    })
    .then(dbBoxData => {
      if (!dbBoxData[0]) {
        res.status(404).json({ message: 'This Box does not exist!' });
        return;
      }
      res.json(dbBoxData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const info = req.body.custom_1
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const key = result.Key;
  Box.update({
      file: key
  }, {
   where: {
    custom_1: info
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



  module.exports = router;

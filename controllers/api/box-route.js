const router = require('express').Router();
const { route } = require('.');
const {User, Account, Batch, Box, Container} = require('../../models');
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
    height: req.body.height,
    volume: req.body.volume
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//insert old data - seeds
router.post('/seeds', withAuth, (req, res) => {
  Box.create({
    box_number: req.body.box_number,
    received_date: req.body.received_date,
    account_id: req.body.account_id,
    batch_id: req.body.batch_id,
    user_id: req.body.user_id,
    description: req.body.description,
    sku: req.body.sku,
    qty_per_box: req.body.qty_per_box,
    order: req.body.order,
    weight: req.body.weight,
    length: req.body.length,
    width: req.body.width,
    height: req.body.height,
    volume: req.body.volume,
    status: req.body.status,
    bill_received: req.body.bill_received,
    bill_storage: req.body.bill_storage
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

//account merge and update box.accout_id
router.put('/account_merge', withAuth, (req, res) => {
  Box.update({
      account_id: req.body.account_id_2
    },
    {
      where: {
          user_id: req.body.user_id,
          account_id: req.body.account_id
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

//update box location
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
      location: req.body.location,
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
      s3: req.body.s3,
      notes: req.body.notes,
      fba: req.body.fba
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

// upload file to AWS and update file when requested is submitted by client
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const info = req.body.s3
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const key = result.Key;
  Box.update({
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

//upload the second file to AWS and update file_2 when requested is submitted by client
router.post('/upload_2', upload.single('file'), async (req, res) => {
  const file = req.file;
  const info = req.body.s3
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  const key = result.Key;
  Box.update({
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

router.put('/bill_received_update', withAuth, (req, res) => {
  Box.update({
      bill_received: req.body.bill
    },
      {
      where: {
          box_number: req.body.arr
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

router.put('/bill_shipped_update', withAuth, (req, res) => {
  Box.update({
      bill_shipped: req.body.bill
    },
      {
      where: {
          box_number: req.body.arr
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

router.put('/bill_storage_update', withAuth, (req, res) => {
  Box.update({
      bill_storage: req.body.bill
    },
      {
      where: {
          box_number: req.body.arr
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

router.put('/xcharge_update', withAuth, (req, res) => {
  Box.update({
      status: 5,
      bill_shipped: req.body.bill
    },
      {
      where: {
          box_number: req.body.arr
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

router.post('/additional_charge', withAuth, (req, res) => {
  Box.create({
    requested_date: new Date().toLocaleDateString("en-US"),
    box_number: req.body.box_number,
    account_id: req.body.account_id,
    user_id: req.body.user_id,
    description: req.body.description,
    fba: req.body.fba,
    qty_per_box: req.body.qty_per_box,
    order: req.body.order,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    cost: req.body.cost,
    status: 4
  }, {returning: true})
      .then(dbBoxData => res.json(dbBoxData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

router.put('/master_update_status', withAuth, (req, res) => {
  Box.update({
      status: req.body.status
    },
    {
    where:{
          id: req.body.box_id
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

router.delete('/destroy', withAuth, (req, res) => {
  Box.destroy({
      where: {
        id: req.body.box_id
      }
    })
      .then(dbBoxData => {
        if (!dbBoxData) {
          res.status(404).json({ message: 'No box found with this id' });
          return;
        }
        res.json(dbBoxData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


//// mannual update date of each status////////////////
router.put('/dateUpdate_received_date', withAuth, (req, res) => {
  Box.update({
      received_date: req.body.date
    },
    {
    where:{
      id: req.body.id
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

router.put('/dateUpdate_pending_date', withAuth, (req, res) => {
  Batch.update({
      pending_date: req.body.date
    },
    {
    where:{
      id: req.body.id
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

router.put('/dateUpdate_requested_date', withAuth, (req, res) => {
  Box.update({
      requested_date: req.body.date
    },
    {
    where:{
      id: req.body.id
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

router.put('/dateUpdate_shipped_date', withAuth, (req, res) => {
  Box.update({
      shipped_date: req.body.date
    },
    {
    where:{
      id: req.body.id
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

router.put('/dateUpdate_bill_received', withAuth, (req, res) => {
  var time = new Date(req.body.date).getTime();
  if(time) {
    time = time + 86400000
  } else {
    time = null
  }
  Box.update({
      bill_received: time
    },
    {
    where:{
      id: req.body.id
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

router.put('/dateUpdate_bill_storage', withAuth, (req, res) => {
  var time = new Date(req.body.date).getTime();
  if(time) {
    time = time + 86400000
  } else {
    time = null
  }
  Box.update({
      bill_storage: time
    },
    {
    where:{
      id: req.body.id
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

router.put('/dateUpdate_bill_shipped', withAuth, (req, res) => {
  var time = new Date(req.body.date).getTime();
  if(time) {
    time = time + 86400000
  } else {
    time = null
  }
  Box.update({
      bill_shipped: time
    },
    {
    where:{
      id: req.body.id
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


  module.exports = router;

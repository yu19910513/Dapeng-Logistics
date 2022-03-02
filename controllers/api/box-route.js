const router = require('express').Router();
const {User, Account, Batch, Box} = require('../../models');
const {withAuth, adminAuth} = require('../../utils/auth');
// const fs = require('fs');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const uploadFile = async (file) => {
//   fs.readFile(file, (err, data) => {
//      if (err) throw err;
//      const params = {
//          Bucket: 'dql', // pass your bucket name
//          Key: file, // file will be saved as testBucket/contacts.csv
//          Body: JSON.stringify(data, null, 2),
//          ACL: 'public-read'
//      };
//      const result = await s3.upload(params, function(s3Err, data) {
//          if (s3Err) throw s3Err
//          console.log(`File uploaded successfully at ${data.Location}`)
//      });
//   });
// };



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

router.put('/status', withAuth, (req, res) => {
  Box.update({
      status: req.body.status,
      received_date: req.body.received_date,
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




  module.exports = router;

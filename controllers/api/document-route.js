const router = require('express').Router();
const {User, Account, Batch, Box, Container, Item, Record, Document} = require('../../models');
const {withAuth} = require('../../utils/auth');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const { uploadFile, getFile} = require('../../utils/s3');
const fs = require('fs');
const util = require('util');
const { log } = require('console');
const unlinkFile = util.promisify(fs.unlink);

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const ref = req.body.ref;
        const id = req.body.user_id;
        const result = await uploadFile(file);
        await unlinkFile(file.path);
        const key = result.Key;
        Document.create({
            file: key,
            date: new Date().valueOf(),
            references: ref,
            user_id:id
        },
        )
        .then(() => {
            res.send({imagePath: `/image/${key}`})
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;

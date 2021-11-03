const express = require('express');
const router = express.Router();


const stuffCtrl = require('../controllers/stuff');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.get('/sauces', auth, stuffCtrl.getAllStuff);
router.post('/sauces', auth, multer, stuffCtrl.createThing);
router.get('/sauces/:id', auth, stuffCtrl.getOneThing);
router.put('/sauces/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/sauces/:id', auth, stuffCtrl.deleteThing);
router.post('/sauces/:id/like', multer, stuffCtrl.modifyLike);



module.exports = router;
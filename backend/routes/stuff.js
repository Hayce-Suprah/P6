const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

const auth = require('../middleware/auth');


router.get('/sauces', auth, stuffCtrl.getAllStuff);
router.post('/sauces', auth, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);



module.exports = router;
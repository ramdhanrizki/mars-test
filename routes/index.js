var express = require('express');
const Account = require('../controllers/Account');
var router = express.Router();

const AccountController = require('../controllers').account;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/account', AccountController.list);
router.get('/account/:id', AccountController.getById);
router.put('/account/:id', AccountController.update);
router.post('/account', AccountController.add);
router.delete('/account/:id', AccountController.delete);
router.get('/account-summary',AccountController.summary);
router.get('/download-excel',AccountController.downloadExcel);

module.exports = router;

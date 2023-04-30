const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankController');
const { requireAuth } = require('../utls/authMiddleware');
// const requireAuth = requireAuth

router
.use("/", requireAuth)

router
.post('/', bankAccountController.createBankAccount);

router
.get('/:id', bankAccountController.getBankAccountById);

router
.put('/:id/deposit', bankAccountController.depositIntoBankAccount);

module.exports = router;

const express = require('express');
const router = express.Router();
const data = require('./data.controller');

router.get('/products', data.getProducts);

router.get('/products/:id', data.getProductById);

router.post('/leads', data.addLead);

router.get('/leads', data.getLeads);

router.get('/leads/:id', data.getLeadById);

router.patch('/leads/:id', data.updateLeadStatus);



module.exports = router;
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', auth, async (req, res) => {
    const result = validate(req.body.name);
    if (result.error) {return res.status(400).send(result.error.details[0].message)}

    let customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    })

    try {
      customer = await customer.save();
      res.send(customer);  
    }
    catch(ex) {
        console.log(ex.errors.message);
    }
    
});

router.put('/:id', auth, async (req, res) => {
    const result = validate(req.body.name);
    if (result.error) {return res.status(400).send(result.error.details[0].message)}

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name }, {new: true});

    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(customer);
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(customer);
})

router.get('/:id', async (req, res) => {
    const customer = Customer.find(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});



module.exports = router;
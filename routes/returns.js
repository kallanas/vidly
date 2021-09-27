const express = require('express');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const router = express.Router();
const Joi = require('joi');
const validate = require('../middleware/validate');




router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send('no rental found');
    if (rental.dateReturned) return res.status(400).send('return already processed');

    rental.return();
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
        $inc: {numberInStock: 1}
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    }); 
    return schema.validate(req);
}

module.exports = router;
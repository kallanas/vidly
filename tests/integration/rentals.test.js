const mongoose = require('mongoose');
const { Rental } = require('../../models/rental');
const request = require('supertest');
const {User} = require('../../models/user');
const { Movie } = require('../../models/movie');
const { Customer } = require('../../models/customer');


let server;

describe('/api/rentals', () => {

    let customerId;
    let movieId;
    let token;
    let movie;
    let customer;

    const exec = () => {
        return request(server)
         .post('/api/rentals')
         .set('x-auth-token', token)
         .send({customerId, movieId});
    }

    beforeEach( async() => { 
        server = require('../../vidly'); 

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 2
        });
        await movie.save();

        customer = new Customer({
            _id: customerId,
            name: 'Jennifer',
            phone: 123456
        })
        await customer.save();
        
    });

    afterEach(async () => {
        await server.close();
        await Customer.remove({}); 
        await Movie.remove({}); 

    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customer is invalid', async () => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movie is invalid', async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movie is not in stock', async () => {
        numberInStock = 0;
        const res = await exec();

        expect(res.status).toBe(400);
    });

    // it('should decrease the numberInStock ', async () => {
    //     const res = await exec();
    //     const movieTest = await Movie.findById(movieId);
    
    //     expect(movieTest.numberInStock).toBe(movie.numberInStock - 1);
    // });
   
});
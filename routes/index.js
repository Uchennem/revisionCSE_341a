const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/homeController.js');
const CRUDController = require('../controllers/crudController');
const bikeController = require('../controllers/bikeController.js')
const { auth, requiresAuth } = require('express-openid-connect');

// home routes
router.get("/", homecontroller.homeRoute);
router.get("/sarah", homecontroller.sarahRoute);
router.get("/cars", requiresAuth(), CRUDController.retrieveAllCars)
router.get("/cars/:id", CRUDController.retrieveOneCar)
router.get("/bikes", requiresAuth(), bikeController.retrieveAllBikes)
router.get("/bikes/:id", bikeController.retrieveOneBike)



// POST route to create a new car/bike
router.post('/cars', CRUDController.createCar);
router.post('/bikes', bikeController.createbike);

// PUT route to update a car/bike
router.put('/cars/:id', CRUDController.updateCar);
router.put('/bikes/:id', bikeController.updatebike);

// DELETE route to delete a car/bike
router.delete('/cars/:id', CRUDController.deleteCar);
router.delete('/bikes/:id', bikeController.deletebike);


module.exports = router
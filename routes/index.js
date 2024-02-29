const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/homeController.js');
const CRUDController = require('../controllers/crudController');
const { auth, requiresAuth } = require('express-openid-connect');

// home routes
router.get("/", homecontroller.homeRoute);
router.get("/sarah", homecontroller.sarahRoute);
router.get("/cars", requiresAuth(), CRUDController.retrieveAllCars)
router.get("/cars/:id", CRUDController.retrieveOneCar)


// POST route to create a new car
router.post('/cars', CRUDController.createCar);

// PUT route to update a car
router.put('/cars/:id', CRUDController.updateCar);

// DELETE route to delete a car
router.delete('/cars/:id', CRUDController.deleteCar);


module.exports = router

const { ObjectId } = require('mongodb');
const { getDb } = require('../mongoDB/mongodb');

// GET all car in Db
async function retrieveAllCar(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carCollection = db.collection('car');
        const car = await carCollection.find({}).toArray();

        res.json(car);

        console.log("Function working");
        console.log(JSON.stringify(car));
    } catch (error) {
        console.error('Error retrieving car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// GET a single car by ID
async function retrieveOneCar(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carsCollection = db.collection('cars');
        const carId = req.params.id;

        // Convert the carId to ObjectId
        const objectIdcarId = new ObjectId(carId);

        // Find a single document by ID
        const car = await carsCollection.findOne({ _id: objectIdcarId });

        if (!car) {
            return res.status(404).json({ error: 'car not found' });
        }

        res.json(car);
    } catch (error) {
        console.error('Error retrieving car by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create a new car
async function createCar(req, res) {
    try {
        // Extract required fields from the request body
        const car = {

            inv_make: req.body.inv_make,
            inv_model: req.body.inv_model,
            inv_year: req.body.inv_year,
            inv_description: req.body.inv_description,
            inv_image: req.body.inv_image,
            inv_thumbnail: req.body.inv_thumbnail,
            inv_price: req.body.inv_price,
            inv_miles: req.body.inv_miles,
            inv_color: req.body.inv_colour,
            classification_id: req.body.classification_id

          };

        
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carCollection = db.collection('car');

        

        // Insert the new car into the database
        const result = await carCollection.insertOne(car);

        // Extract the generated car ID from the result
        const carId = result.insertedId;

        // Return the new car ID in the response
        res.status(201).json({ carId });
    } catch (error) {
        console.error('Error creating car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update a car
async function updateCar(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carCollection = db.collection('car');

        // Extract car ID from the request parameters
        const carId = req.params.id;

        // Extract updated fields from the request body
        const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

        // Check if the car ID is valid
        if (!ObjectId.isValid(carId)) {
            return res.status(400).json({ error: 'Invalid car ID' });
        }


        // Construct update query
        const updateFields = {};
        if (inv_make) updateFields.inv_make = inv_make;
        if (inv_model) updateFields.inv_model = inv_model;
        if (inv_year) updateFields.inv_year = inv_year;
        if (inv_description) updateFields.inv_description = inv_description;
        if (inv_image) updateFields.inv_image = inv_image;
        if (inv_thumbnail) updateFields.inv_thumbnail = inv_thumbnail;
        if (inv_price) updateFields.inv_price = inv_price;
        if (inv_miles) updateFields.inv_miles = inv_miles;
        if (inv_color) updateFields.inv_color = inv_color;
        if (classification_id) updateFields.classification_id = classification_id;


        // Update the car in the database
        await carCollection.updateOne({ _id: (carId) }, { $set: updateFields });

        // Return success status
        res.sendStatus(204);
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete a car
async function deleteCar(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const carCollection = db.collection('car');

        // Extract car ID from the request parameters
        const carId = req.params.id;

        // Check if the car ID is valid
        if (!ObjectId.isValid(carId)) {
            return res.status(400).json({ error: 'Invalid car ID' });
        }

        // Delete the car from the database
        await carCollection.deleteOne({ _id: (carId) });

        // Return success status
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { retrieveAllCar, retrieveOneCar, createCar, updateCar, deleteCar };

const { ObjectId } = require('mongodb');
const { getDb } = require('../mongoDB/mongodb');

// GET all bike in Db
async function retrieveAllBikes(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const bikeCollection = db.collection('bikes');
        const bike = await bikeCollection.find({}).toArray();

        res.json(bike);

        console.log("Function working");
        console.log(JSON.stringify(bike));
    } catch (error) {
        console.error('Error retrieving bike:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// GET a single bike by ID
async function retrieveOneBike(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const bikesCollection = db.collection('bikes');
        const bikeId = req.params.id;

        // Convert the bikeId to ObjectId
        const objectIdbikeId = new ObjectId(bikeId);

        // Find a single document by ID
        const bike = await bikesCollection.findOne({ _id: objectIdbikeId });

        if (!bike) {
            return res.status(404).json({ error: 'bike not found' });
        }

        res.json(bike);
    } catch (error) {
        console.error('Error retrieving bike by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Create a new bike
async function createbike(req, res) {
    try {
        // Extract required fields from the request body
        const { make, model, description } = req.body;

        // Validate the required fields
        const validationErrors = [];
        if (!make) validationErrors.push('make is required');
        if (!model) validationErrors.push('model is required');
        if (!description) validationErrors.push('description is required');
        // Add more validation rules as needed...

        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const bikeCollection = db.collection('bikes');

        // Construct the bike object
        const bike = {
            make,
            model,
            description
        };

        // Insert the new bike into the database
        const result = await bikeCollection.insertOne(bike);

        // Extract the generated bike ID from the result
        const bikeId = result.insertedId;

        // Return the new bike ID in the response
        res.status(201).json({ bikeId });
    } catch (error) {
        console.error('Error creating bike:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update a bike
async function updatebike(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const bikeCollection = db.collection('bikes');

        // Extract bike ID from the request parameters
        const bikeId = req.params.id;

        // Extract updated fields from the request body
        const { make, model, description } = req.body;

        // Check if the bike ID is valid
        if (!ObjectId.isValid(bikeId)) {
            return res.status(400).json({ error: 'Invalid bike ID' });
        }
        
       // List of valid properties for updating a bike
       const validProperties = ['make', 'model', 'description'];

       // Array to hold validation errors
       const validationErrors = [];

       // Check if any updated property is not in the list of valid properties
       for (const property in req.body) {
           if (!validProperties.includes(property)) {
               validationErrors.push(`${property} is not a valid property for updating`);
           }
       }

       // Check if there are any validation errors
       if (validationErrors.length > 0) {
        // Return 400 Bad Request with validation errors
        return res.status(400).json({ errors: validationErrors });
    }


        // Construct update query
        const updateFields = {};
        if (make) updateFields.make = make;
        if (model) updateFields.model = model;
        if (description) updateFields.description = year;


        // Update the bike in the database
        await bikeCollection.updateOne({ _id: new ObjectId(bikeId) }, { $set: updateFields });

        // Return success status
        res.sendStatus(204);
    } catch (error) {
        console.error('Error updating bike:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete a bike
async function deletebike(req, res) {
    try {
        const db = getDb();
        if (!db) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const bikeCollection = db.collection('bikes');

        // Extract bike ID from the request parameters
        const bikeId = req.params.id;

        // Check if the bike ID is valid
        if (!ObjectId.isValid(bikeId)) {
            return res.status(400).json({ error: 'Invalid bike ID' });
        }

        // Delete the bike from the database
        await bikeCollection.deleteOne({ _id: new ObjectId (bikeId) });

        // Return success status
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting bike:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { retrieveAllBikes, retrieveOneBike, createbike, updatebike, deletebike };
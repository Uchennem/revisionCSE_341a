const sarahRoute = (req, res) => {
    res.send("Sarah")
}

const homeRoute = (req, res) => {
    res.send("Welcome to Timmy Toughman's Car Dealership website")
}

module.exports = {sarahRoute, homeRoute};
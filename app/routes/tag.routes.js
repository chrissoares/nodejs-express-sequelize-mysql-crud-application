module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();

    // Create a new Tag
    router.post("/", tutorials.createTag);

    // Retrive all Tags
    router.get("/", tutorials.findAllTag);

    // Retrive a Tag with id
    router.get("/:id", tutorials.findOneTag);

    // Add a Tutorial in a Tag
    router.post("/addtutorial", tutorials.addTutorial);

    app.use('/api/tags', router);

}
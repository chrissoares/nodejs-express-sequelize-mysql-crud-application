module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();

    // Create a new Comment
    router.post("/", tutorials.createComment);

    // // Retrieve all Tutorials
    // router.get("/", tutorials.findAll);

    // Retrieve all approved Comments
    router.get("/published", tutorials.findAllPublished);

    // Retrieve a single Comment with id
    router.get("/:id", tutorials.findCommentById);

    // Update a Comment with id
    // router.put("/:id", tutorials.update);

    // Delete a Comment with id
    // router.delete("/:id", tutorials.delete);

    // Delete all Comments
    // router.delete("/", tutorials.deleteAll);

    app.use('/api/tutorials/comments', router);

}
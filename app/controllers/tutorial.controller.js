const db = require("../models");
const Tutorial = db.tutorials;
const Comment = db.comments;
const Tag = db.tag;
const Op = db.Sequelize.Op;

// Tag Group

// Create and Save a new Tag
exports.createTag = (req, res) => {
    //Validate request
    if(!req.body.name){
        res.status(400).send({
            message: "Tag can not be empty!"
        });
        return;
    };

    // Create a Tag
    const tag = {
        name: req.body.name,
    };
    
    // Save Tag in the database
    Tag.create(tag)
        .then(data => {
            res.send(data);
        })
        .catch( err => {
            req.status(500).send({
                message:
                err.message || "Some error occurred while creating the Tag."
            });
        });
};

// Retrive all Tags from the database.
exports.findAllTag = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%`}} : null;

    Tag.findAll({
        include: [
            {
                model: Tutorial,
                as: "tutorials",
                attributes: ["id", "title", "description", "createdAt"],
                through:{
                    attributes: [],
                }
            },
        ],
        where: condition // Maybe can teste remove it.
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tags."
        });
    });
};

// Find a single Tag with an id
exports.findOneTag = (req, res) => {
    const id = req.params.id;
    
    Tag.findByPk(id, {
        include: [
            {
                model: Tutorial,
                as: "tutorials",
                attributes: ["id", "title", "description", "createdAt"],
                through: {
                    attributes: [],
                }
            },
        ],
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Tag with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tag with id="+id
            });
        });
};

// Add a tutorial in a Tag
exports.addTutorial = (req, res) => {
    const tagId = req.body.tagId;
    const tutorialId = req.body.tutorialId;



    Tag.findByPk(tagId)
        .then((tag) => {
            if (!tag) {
                res.status(404).send({
                    message: "Tag not found."
                });
            };

            Tutorial.findByPk(tutorialId)
                .then((tutorial) => {
                    if (!tutorial) {
                        res.status(404).send({
                            message: "Tutorial not found!"
                        });
                    };

                    tag.addTutorial(tutorial)
                        .then(data => {
                            res.send(data);
                        })
                        .catch(err => {
                            req.status(500).send({
                                message:
                                err.message || "Some error occurred while adding a Tutorial in a Tag."
                            })
                        })
                });
        });
}

// -> End Tag Group

// Create and Save a new Tutorial
exports.create = (req, res) => {
    //Validate request
    if (!req.body.title){
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    };

    // Create a Tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Save Tutorial in the database
    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            req.status(500).send({
                message:
                err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Create and Save a new Comment
exports.createComment = (req, res) => {
    if (!req.body.text){
        res.status(400).send({
            message: "Comment can not be empty!"
        });
        return;
    };

    // Create a Comment
    const comment = {
        name: req.body.name,
        text: req.body.text,
        approved: req.body.approved,
        tutorialId: req.body.tutorialId,
    };

    Comment.create(comment)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            req.status(500).send({
                message:
                err.message || "Some error occurred while creating the comment."
            });
        });
}

// Retrive a single comment with an id
exports.findCommentById = (req, res) => {
    const id = req.params.id;

    Comment.findByPk(id, {include: ["tutorial"]})
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot fund comment with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving comment with id="+id
            });
        });
}

// exports.createTutorial = (Tutorial, res) => {
//     return Tutorial.create({
//         title: tutorial.title,
//         description: tutorial.description,
//         published: tutorial.published ? tutorial.published : false
//     })
//         .then((tutorial) => {

//         })
// }

// Retrive all Tutorials from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%`}} : null;

    Tutorial.findAll({
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: {
                    attributes: [],
                }
            },
            "comments"
        ],
        where: condition
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving tutorials."
        });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findByPk(id, {
        include: [
            {
                model: Tag,
                as: "tags",
                attributes: ["id", "name"],
                through: {
                    attributes: [],
                }
            },
            "comments"
        ]})
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Tutorial with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id="+id
            });
        });
};

// Update a Tutorial by id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Tutorial as not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id=" + id
            });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tutorial.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Cold not delete Tutorial with id="+id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Tutorial.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Tutorials were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.findAll({
        where: {published: true}
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving tutorials."
            });
        });
};
const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    dbConfig.DB, 
    dbConfig.USER, 
    dbConfig.PASSWORD, 
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.tag = require("./tag.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

db.tag.belongsToMany(db.tutorials, {
    through: "tutorial_tag",
    as: "tutorials",
    foreignKey: "tag_id",
});

db.tutorials.hasMany(db.comments, {
    as: "comments"
});

db.tutorials.belongsToMany(db.tag, {
    through: "tutorial_tag",
    as: "tags",
    foreignKet: "tutorial_id",
});

db.comments.belongsTo(db.tutorials, {
    foreignKey: "tutorialId",
    as: "tutorial"
});

module.exports = db;
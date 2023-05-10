module.exports = (sequelize, DataTypes) => {
    const Tutorial = sequelize.define("tutorial", {
        title: {
            // type: Sequelize.STRING,
            type: DataTypes.STRING
        },
        description: {
            // type: Sequelize.STRING,
            type: DataTypes.STRING
        },
        published: {
            // type: Sequelize.BOOLEAN,
            type: DataTypes.BOOLEAN
        }
    });

    return Tutorial;
}
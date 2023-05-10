module.exports = (sequelize, DataType) => {
    const Comment = sequelize.define("comment", {
        name: {
            type: DataType.STRING
        },
        text: {
            type: DataType.STRING
        },
        approved: {
            type: DataType.BOOLEAN
        }
    });

    return Comment;
}
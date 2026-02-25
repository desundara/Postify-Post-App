module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        commentText: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
        username: {
        type: DataTypes.STRING,
        allowNull: false,
        },
    });

    Comments.associate = (models) => {
    Comments.belongsTo(models.Posts, {
        foreignKey: "postId",
        onDelete: "cascade",
    });
};

    return Comments;
};

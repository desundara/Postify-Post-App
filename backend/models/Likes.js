module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define("Likes", {
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Likes.associate = (models) => {
        Likes.belongsTo(models.Posts, {
            foreignKey: "PostId",
            onDelete: "cascade",
        });

        Likes.belongsTo(models.Users, {
            foreignKey: "UserId",
            onDelete: "cascade",
        });
    };

    return Likes;
};
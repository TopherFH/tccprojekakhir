import {
    DataTypes
} from "sequelize";
import db from "../config/DatabasePam.js";
import User from "./UserModel.js";
import Vehicle from "./VehicleModel.js";

const Favorite = db.define("favorites", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehicle,
            key: "id"
        }
    }
}, {
    timestamps: false
});

// Relasi dengan cascade delete
User.hasMany(Favorite, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});
Favorite.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE"
});

Vehicle.hasMany(Favorite, {
    foreignKey: "vehicleId",
    onDelete: "CASCADE"
});
Favorite.belongsTo(Vehicle, {
    foreignKey: "vehicleId",
    onDelete: "CASCADE"
});

export default Favorite;
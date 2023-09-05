const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },

        password: {
            type: String,
            required: false
        },

        role: {
            type: String,
            required: true,
            enum: {
                values: ["admin", "super-admin"],
                message: (props) => `${props.value} is not a valid role`
            }
        },

        createdAt: {
            type: Date,
            required: false
        }
    },
    {
        collection: "users-list"
    }
);

const UserModel = mongoose.model("users-list", userSchema);
module.exports = UserModel;
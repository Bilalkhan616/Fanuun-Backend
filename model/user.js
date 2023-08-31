const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
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
        collection: 'user'
    }
)

const model = mongoose.model("UserSchema", UserSchema)

module.exports = model
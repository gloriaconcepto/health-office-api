const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userRegisterSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        otherName: {
            type: String,
        },
        telephone: {
            type: String,
            required: true,
        },
        kidNo: {
            type: Number,
            required: true,
        },

        kidDetails: [{}],
    },
    {
        timestamps: true,
        writeConcern: {
            w: "majority",
            j: true,
            wtimeout: 1000,
        },
    }
);

module.exports = mongoose.model("RegisterUser", userRegisterSchema);

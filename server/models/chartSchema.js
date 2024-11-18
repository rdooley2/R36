const mongoose = require("mongoose");

const chartSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^#[0-9A-Fa-f]{6}$/i.test(v);
            },
            message: props => `${props.value} is not a valid hex code.`,
        },
    }

}, { collection: 'chartCollection'})

module.exports = mongoose.model('chartCollection', chartSchema);
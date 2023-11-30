let mongoose = require('mongoose');

let productsModel = mongoose.Schema(
    {
        itemName: {
            type: String,
            required: [true, 'Item name is required'],
            validate: {
                validator: function(value) {
                    // validation for input length >0
                    return value.length > 0;
                },
                message: 'Item name is required'
            }
        },
        qty: {
            type: Number,
            validate: {
                validator: function(value) {
                    // validation for input value >0
                    return value > 0;
                },
                message: 'Quantity must greater than 0'
            }
        },
        status: String,
        description: String,
        size: {
            h: Number,
            w: Number,
            uom: String
        },
        location: String,
        price: {
            type: Number,
            required: [true, 'price is required'],
            validate: {
                validator: function(value) {
                    // validation for input value >0
                    return value > 0;
                },
                message: 'Price must greater than 0'
            }
        },
        productCreated: {
            type: Date,
            default: Date.now,
            immutable: true
          },

        sellerID: {
            type: String
        }
    },
    {
        collection: "productlist"
    }
);

productsModel.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model("products", productsModel);
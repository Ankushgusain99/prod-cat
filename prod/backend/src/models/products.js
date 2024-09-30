const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productBrand: {
        type: String,
        required: true
    },
    superCategory: {
        type: String, // Change from embedded schema to String
        required: true,
      },
      category: {
        type: String, // Change from embedded schema to String
        required: true,
      },
      subCategory: {
        type: String, // Change from embedded schema to String
        required: true,
      },
    numberOfUnits: {
        type: Number,
        required: true
    },
    siUnits: {
        type: String,
        required:true
    },
    unitWeight: {
        type: String,
        required: true
    },
    netWeight: {
        type: String,
    },
    grossWeight: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    calories: {
        type: String,
        required: true
    },
    fat: {
        type: String,
        required: true
    },
    saturatedFat: {
        type: String,
        required: true
    },
    carbs: {
        type: String,
        required: true
    },
    fibre: {
        type: String,
        required: true
    },
    sugar: {
        type: String,
        required: true
    },
    protein: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    dietary: [{
        type: String,
        required:true
    }],
    storage: {
        type: String,
        required: true
    },
    productIdPrefix:{
        type:String,
        required:true
    },
    origin: [{
        type: String,
        required: true
    }],
    addedBy: {
        type: String, 
        required:true
    },
    uploadImage: {
        type: [String], 
        required:true
    }
});

module.exports = mongoose.model('products', productSchema);

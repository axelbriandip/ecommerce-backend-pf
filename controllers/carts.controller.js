const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Cart } = require('../models/cart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const addProductToCart = catchAsync(async (req, res, next) => {
    // block code
});

const updateProductInCart = catchAsync(async (req, res, next) => {
    // block code
});

const removeProductInCart = catchAsync(async (req, res, next) => {
    // block code
});

const makePurcharse = catchAsync(async (req, res, next) => {
    // block code
});


module.exports = {
    addProductToCart,
    updateProductInCart,
    removeProductInCart,
    makePurcharse
};
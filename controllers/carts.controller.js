const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const addProductToCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, quantity } = req.body;

    // search if user have some cart active
    const cart = await Cart.findOne({
        where: {
            userId: sessionUser.id,
            status: 'active'
        }
    });

    // search product
    const product = await Product.findOne({ where: { id: productId } });

    // ¿exceed limit of stock?
    if (product.quantity < quantity) {
        return next(new AppError('Product limit exceeded', 400));
    }

    // if have stock
    const remainingQuantity = product.quantity - quantity;
    await product.update({ quantity: remainingQuantity });

    // search product active in cart
    const productInCart = await ProductInCart.findOne({
        where: {
            productId,
            status: 'active'
        }
    });

    // search product removed in cart
    const productInCartRemoved = await ProductInCart.findOne({
        where: {
            productId,
            status: 'removed'
        }
    });

    // cart active exists in cart
    if (productInCart) {
        return next(new AppError('Product is in the cart', 400));
    }
    
    // cart removed exists in cart
    if (productInCartRemoved) {
        await productInCartRemoved.update({ status: 'active' });
    }
    
    // If cart doesn't exist, create
	if (!cart) {
        const newCart = await Cart.create({ userId: sessionUser.id })

        const newProductInCart = await ProductInCart.create({
            cartId: newCart.id,
            productId,
            quantity
        });

        // 201 -> Success and a resource has been created
        return res.status(201).json({
            status: 'success',
            data: { newProductInCart }
        });
    }

    // if it have an cart active..
    const newProductInCart = await ProductInCart.create({
        cartId: cart.id,
        productId,
        quantity
	});

    // 201 -> Success and a resource has been created
	res.status(201).json({
		status: 'success',
		data: { newProductInCart }
	});
});

const updateProductInCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, newQty } = req.body;

    // search if user have some cart active
    const cart = await Cart.findOne({
        where: {
            userId: sessionUser.id,
            status: 'active'
        }
    });

    // if not have cart actives
    if (!cart) {
        return next(new AppError('the user not have cart active', 400));
    }

    // search product
    const product = await Product.findOne({ where: { id: productId } });

    // search product active in cart
    const productInCart = await ProductInCart.findOne({
        where: {
            productId,
            status: 'active'
        }
    });

    if (newQty == 0) {
        await productInCart.update({ status: 'removed' });
    } else {
        await productInCart.update({ status: 'active' });
    }

    // ¿exceed limit of stock?
    if (product.quantity < newQty) {
        return next(new AppError('Product limit exceeded', 400));
    }

    // if have stock
    const remainingQuantity = product.quantity - newQty;
    await product.update({ quantity: remainingQuantity });
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
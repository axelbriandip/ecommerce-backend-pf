const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const createUser = catchAsync(async (req, res, next) => {
	// block code
});

const login = catchAsync(async (req, res, next) => {
	// block code
});

const getMyProducts = catchAsync(async (req, res, next) => {
	// block code
});

const updateProfile = catchAsync(async (req, res, next) => {
	// block code
});

const disabledAccount = catchAsync(async (req, res, next) => {
	// block code
});

const getMyBuys = catchAsync(async (req, res, next) => {
	// block code
});

const detailsAnOrder = catchAsync(async (req, res, next) => {
	// block code
});

module.exports = {
	createUser,
	login,
	getMyProducts,
	updateProfile,
	disabledAccount,
	getMyBuys,
	detailsAnOrder
};
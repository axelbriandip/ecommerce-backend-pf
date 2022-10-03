const express = require('express');

// Controllers
const {
    createCategory,
    createProduct,
    disabledProduct,
    getCategoriesActives,
    getProduct,
    getProductsActives,
    updateCategory,
    updateProduct
} = require('../controllers/products.controller');

// Middlewares
const { productExists } = require('../middlewares/products.middlewares');
const { categoryExists } = require('../middlewares/categories.middlewares');
const {
	protectSession,
	protectUsersAccount,
    protectProductOwners,
    protectCategoryOwners,
	protectAdmin
} = require('../middlewares/auth.middlewares');
const {
	createProductValidators
} = require('../middlewares/validators.middlewares');

const productsRouter = express.Router();

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post('/', createProductValidators, createProduct);
productsRouter.get('/', getProductsActives);
productsRouter.get('/:id', getProduct);
productsRouter.patch('/:id', productExists, protectProductOwners, updateProduct);
productsRouter.delete('/:id', productExists, protectProductOwners, disabledProduct);
productsRouter.get('/categories', getCategoriesActives);
productsRouter.post('/categories', createCategory);
productsRouter.patch('/categories/:id', categoryExists, protectCategoryOwners, updateCategory);

module.exports = { productsRouter };
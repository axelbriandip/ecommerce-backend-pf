const { initializeApp } = require('firebase/app');
const {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
} = require('firebase/storage');

// Model
const { ProductImg } = require('../models/productImg.model');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

// Storage service
const storage = getStorage(firebaseApp);

const uploadProductImgs = async (imgs, productId) => {
	console.log('1');
	// Map async -> Async operations with arrays
	const imgsPromises = imgs.map(async img => {
		console.log('2');
		// Create firebase reference
		const [originalName, ext] = img.originalname.split('.');
		console.log('3');
		
		const filename = `products/${productId}/${originalName}-${Date.now()}.${ext}`;
		const imgRef = ref(storage, filename);
		console.log('4');
		
		// Upload image to Firebase
		const result = await uploadBytes(imgRef, img.buffer);
		console.log('5');
		
		await ProductImg.create({
			productId,
			imgUrl: result.metadata.fullPath,
		});
		console.log('6');
	});

	await Promise.all(imgsPromises);
};

const getProductsImgsUrls = async products => {
	// Loop through products to get to the productImgs
	const productsWithImgsPromises = products.map(async product => {
		// Get imgs URLs
		const productImgsPromises = product.productImgs.map(async productImg => {
			const imgRef = ref(storage, productImg.imgUrl);
			const imgUrl = await getDownloadURL(imgRef);

			productImg.imgUrl = imgUrl;
			return productImg;
		});

		// Resolve imgs urls
		const productImgs = await Promise.all(productImgsPromises);

		// Update old productImgs array with new array
		product.productImgs = productImgs;
		return product;
	});

	return await Promise.all(productsWithImgsPromises);
};

module.exports = { storage, uploadProductImgs, getProductsImgsUrls };
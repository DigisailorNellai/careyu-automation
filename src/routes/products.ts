import express from 'express';

import { createProduct, uploadProduct,getAllProducts,getProductById,getProducts } from '../controller/productController';

const router = express.Router();

router.post('/upload', uploadProduct, createProduct);

//get Products
router.get('/getAllProducts',getAllProducts)

router.get('/getproductbyid/:id',getProductById)

router.get('/getproducts',getProducts)

export default router;






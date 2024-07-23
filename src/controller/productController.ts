import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import XLSX from 'xlsx';
import Product from '../models/productModel';

// Configure Multer storage for images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "excelFile") {
            cb(null, 'uploads/'); // Store Excel files in uploads directory
        } else if (file.fieldname === "imageFile") {
            cb(null, 'images/'); // Store images in images directory
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the file name
    }
});

const upload = multer({ storage: storage });

export const uploadProduct = upload.fields([{ name: 'excelFile', maxCount: 1 }, { name: 'imageFile', maxCount: 1 }]);

export const createProduct = async (req: Request, res: Response) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!files || !files['excelFile'] || !files['imageFile']) {
            return res.status(400).json({ message: 'Excel file and/or image file missing' });
        }

        // Process Excel file
        const excelFile = files['excelFile'][0];
        const workbook = XLSX.readFile(excelFile.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawData: Array<Array<any>> = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Transform data to key-value format
        const headers: string[] = rawData[0];
        const rows = rawData.slice(1);

        const transformedData = rows.map(row => {
            const rowData: { [key: string]: any } = {};
            headers.forEach((header, index) => {
                if (header === "Cutting Size") {
                    rowData["Cutting Size L"] = row[index] || null;
                    rowData["Cutting Size W"] = row[index + 1] || null;
                } else if (header === "Size") {
                    rowData["Size L"] = row[index] || null;
                    rowData["Size W"] = row[index + 1] || null;
                    rowData["Size Pipe"] = row[index + 2] || null;
                } else {
                    rowData[header] = row[index] || null;
                }
            });
            return rowData;
        }).filter(row => Object.keys(row).some(key => row[key] !== null));

        // Process image file
        const imageFile = files['imageFile'][0];
        const imageUrl = imageFile.path;

        const { productName, productCode } = req.body;

        // Check for existing product code
        const existingProduct = await Product.findOne({ productCode });

        if (existingProduct) {
            return res.status(400).json({ message: 'Product code already exists' });
        }

        // Create and save the new product
        const newProduct = new Product({
            productName,
            productCode,
            attachment: transformedData,
            imageUrl
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product successfully created', product: newProduct });

    } catch (error) {
        if (error instanceof Error && error.message.includes('E11000')) {
            return res.status(400).json({ message: 'Product code already exists' });
        }
        res.status(500).json({ message: 'Failed to create product', error: (error as Error).message });
    }
};


//Get Products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find().exec(); // Fetch all products
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch products', error });
    }
};

//get product by Id
export const getProductById = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id; // Get product ID from request parameters
        const product = await Product.findById(productId).exec(); // Fetch product by ID

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Format the response
        const response = {
            productName: product.productName,
            productCode: product.productCode,
            requiredItems: product.attachment, // Assuming 'data' contains the required items
            image: product.imageUrl
        };

        res.status(200).json({ success: true, product: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch product', error });
    }
};

// Controller to get all products with specific fields
export const getProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
      // Fetch all products from the database
      const products = await Product.find({}, 'productName productCode attachment');
  
      // Transform the data to include only the required fields
      const result = products.map(product => {
        // Extract Product Types from requiredItems
        const productTypes = product.attachment[0].map(item => item['Product Type']).filter(type => type != null);
  
        return {
          productName: product.productName,
          productCode: product.productCode,
          requiredItems: productTypes
        };
      });
  
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };




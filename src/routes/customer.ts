import express, { Router } from 'express';
import {
    newCustomer,
    getCustomers,
    getSingleCustomer,
    updateCustomer,
    deleteCustomer,
    filterCustomers,
} from '../controller/customerController';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/authenticate';

const router: Router = express.Router();

// Add a new customer: Requires user authentication and admin role authorization
router.post('/newcustomer', isAuthenticatedUser, authorizeRoles('user'), newCustomer);

// Get all customers: Requires user authentication
router.get('/customers', isAuthenticatedUser, getCustomers);

// Get a single customer by ID
router.get('/customers/:id', getSingleCustomer);

// Update a customer by ID
router.put('/updateCustomer/:id', updateCustomer);

// Delete a customer by ID
router.delete('/deleteCustomer/:id', deleteCustomer);

// Filter customers
router.get('/filterCustomers', filterCustomers);

export default router;

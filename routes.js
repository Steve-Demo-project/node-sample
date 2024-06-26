const express = require('express');
const router = express.Router();

module.exports = (router) => {
    const itemRoutes = require('./items');
    const brandsRoutes = require('./brands');
    const userRoutes = require('./user');
    const authRoutes = require('./auth');
    const categoryRoutes = require('./category');
    const storesProductmappingRoutes = require('./stores-product-mapping');
    const storesBrandmappingRoutes = require('./stores-brand-mapping');
    const storesCategorymappingRoutes = require('./stores-category-mapping');
    const ordersRoutes = require('./orders');
    const shipmentsRoutes = require('./shipments');
    const paymentsRoutes = require('./payments');
    const customersRoutes = require('./customer');
    const uploadRoutes = require('./upload');
    const catalogRoutes = require('./catalog');
    const cartsRoutes = require('./carts');

    router.use('/item', itemRoutes);
    router.use('/brands', brandsRoutes);
    router.use('/user', userRoutes);
    router.use('/auth', authRoutes);
    router.use('/category', categoryRoutes);
    router.use('/map/stores/products', storesProductmappingRoutes);
    router.use('/map/stores/brands', storesBrandmappingRoutes);
    router.use('/map/stores/categories', storesCategorymappingRoutes);
    router.use('/orders', ordersRoutes);
    router.use('/shipments', shipmentsRoutes);
    router.use('/payments', paymentsRoutes);
    router.use('/customer', customersRoutes);
    router.use('/upload', uploadRoutes);
    router.use('/catalog', catalogRoutes);
    router.use('/cart', cartsRoutes);
}
const Item = require('../Models/Item');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id });
        res.status(200).json({
            message: 'Items retrieved successfully',
            items
        });
    } catch (error) {
        console.error('Error fetching items:', error.message);
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { name, description, quantity, unitPrice } = req.body;

        if (!name || !quantity || !unitPrice) {
            return res.status(400).json({ message: 'Name, quantity, and unit price are required' });
        }
        if (quantity <= 0 || unitPrice < 0) {
            return res.status(400).json({ message: 'Quantity must be positive and unit price cannot be negative' });
        }

        const newItem = new Item({
            userId: req.user.id,
            name,
            description: description || '',
            quantity,
            unitPrice,
            status: 'Pending'
        });

        await newItem.save();

        res.status(201).json({
            message: 'Item created successfully',
            item: newItem
        });
    } catch (error) {
        console.error('Error creating item:', error.message);
        res.status(500).json({ message: 'Error creating item', error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { name, description, quantity, unitPrice, status } = req.body;

        const item = await Item.findOne({ _id: req.params.id, userId: req.user.id });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (quantity && quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be positive' });
        }
        if (unitPrice !== undefined && unitPrice < 0) {
            return res.status(400).json({ message: 'Unit price cannot be negative' });
        }

        if (name) item.name = name;
        if (description !== undefined) item.description = description;
        if (quantity) item.quantity = quantity;
        if (unitPrice !== undefined) item.unitPrice = unitPrice;
        if (status) item.status = status;

        await item.save();

        res.status(200).json({
            message: 'Item updated successfully',
            item
        });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ message: 'Error updating item' });
    }
};

exports.markAsFulfilled = async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending items can be marked as fulfilled' });
        }

        item.status = 'Fulfilled';
        await item.save();

        res.status(200).json({
            message: 'Item marked as fulfilled',
            item
        });
    } catch (error) {
        console.error('Error marking item as fulfilled:', error);
        res.status(500).json({ message: 'Error marking item as fulfilled' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, userId: req.user.id });
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending items can be deleted' });
        }

        await Item.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id });
        
        const totalItems = items.length;
        const fulfilledItems = items.filter(item => item.status === 'Fulfilled').length;
        const pendingItems = items.filter(item => item.status === 'Pending').length;

        res.status(200).json({
            message: 'Dashboard stats retrieved',
            stats: {
                totalItems,
                fulfilledItems,
                pendingItems
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

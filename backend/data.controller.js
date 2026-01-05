const db = require('./db');
const crypto = require('crypto');

const getProducts = async (req, res) => {
    try {
        const products = await db.query('SELECT * FROM products');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params; 
    try {
        const product = await db.select('products', [{ field: 'id', operator: '=', value: id }]);
        if (product && product.length > 0) {
            res.status(200).json(product[0]);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

const addLead = async (req, res) => {
    const id = crypto.randomUUID();
    const { name,phone, email, message, source, productInterest, } = req.body;
    const status = 'new';
    const createdAt = new Date().toISOString();
    const missingFields = [];

    if (!name) missingFields.push('name');
    if (!phone) missingFields.push('phone');
    if (!email) missingFields.push('email');
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    try {
        await db.insert('leads', { id, name, phone, email, message, source, productInterest, status, createdAt });
        res.status(201).json({ message: 'Lead added successfully', id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add lead' });
    }  
};

const getLeads = async (req, res) => {
    try {
        const { status, fromDate, toDate } = req.query;
        const validStatuses = ['new', 'contacted', 'converted', 'closed'];
        
        let sqlQuery = 'SELECT * FROM leads';
        const values = [];
        const conditions = [];

        if (status) {
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
            }
            conditions.push('status = ?');
            values.push(status);
        }

        if (fromDate && toDate) {
            const dateStart = `${fromDate}T00:00:00.000Z`;
            const dateEnd = `${toDate}T23:59:59.999Z`;
            conditions.push('leads.createdAt BETWEEN ? AND ?');
            values.push(dateStart, dateEnd);
        } else if (fromDate || toDate) {
            return res.status(400).json({ error: 'Both fromDate and toDate are required for date filtering' });
        }

        if (conditions.length > 0) {
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
        }

        const leads = await db.query(sqlQuery, values);
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
};

const getLeadById = async (req, res) => {
    const { id } = req.params;
    try {
        const lead = await db.select('leads', [{ field: 'id', operator: '=', value: id }]);
        if (lead && lead.length > 0) {
            res.status(200).json(lead[0]);
        } else {
            res.status(404).json({ error: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lead' });
    }
};

const updateLeadStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updated = await db.update('leads', { status }, [{ field: 'id', operator: '=', value: id }]);
        if (updated && updated.changes > 0) {
            res.status(200).json({ message: 'Lead status updated successfully' });
        } else {
            res.status(404).json({ error: 'Lead not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update lead status' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addLead,
    getLeads,
    getLeadById,
    updateLeadStatus,
};
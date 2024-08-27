const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Connect to PostgreSQL
const sequelize = new Sequelize('crm_db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

// Define the Customer model
const Customer = sequelize.define('Customer', {
    first_name: {   
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {   
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created_at: {   
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'customers',
    timestamps: false
});

// Define the Contact model
const Contact = sequelize.define('Contact', {
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id'
        },
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    position: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'contacts',
    timestamps: false
});

// Define the Interaction model
const Interaction = sequelize.define('Interaction', {
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'id'
        },
        allowNull: false
    },
    contact_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Contact,
            key: 'id'
        },
        allowNull: false
    },
    interaction_type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    interaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'interactions',
    timestamps: false
});


// Define the Product model
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    created_at: {   
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'products',
    timestamps: false
});

// Sync the models with the database
sequelize.sync();

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Routes to get data from the database

// Customers
app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Contacts
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Interactions
app.get('/interactions', async (req, res) => {
    try {
        const interactions = await Interaction.findAll();
        res.json(interactions);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

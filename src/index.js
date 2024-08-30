const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname));

// Connect to PostgreSQL
const sequelize = new Sequelize('crm_db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres'
});

const Contact = sequelize.define('Contact', {
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
    contact_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Contact,
            key: 'id'
        },
        allowNull: false
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

sequelize.sync();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.findAll();
        res.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/interactions', async (req, res) => {
    try {
        const interactions = await Interaction.findAll();
        res.json(interactions);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/chart-data/customers-over-time', async (req, res) => {
    try {
        const data = await Customer.findAll({
            attributes: [
                [sequelize.fn('date_trunc', 'month', sequelize.col('created_at')), 'month'],
                [sequelize.fn('count', sequelize.col('id')), 'count']
            ],
            group: ['month'],
            order: [['month', 'ASC']]
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/chart-data/products-sales', async (req, res) => {
    try {
        const data = await Product.findAll({
            attributes: ['name', [sequelize.fn('sum', sequelize.col('price')), 'total_sales']],
            group: ['name'],
            order: [['total_sales', 'DESC']]
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

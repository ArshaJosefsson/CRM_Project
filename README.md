This project demonstrates foundational knowledge in backend technologies like Python and PostgreSQL, as well as front-end web development technologies, including HTML, CSS, and JavaScript. It illustrates the process of building a basic Customer Relationship Management (CRM) system capable of managing customer information, contacts, interactions, and products.

PostgreSQL is employed as the relational database management system (RDBMS) for this project, ensuring efficient data storage and retrieval.

A Python script is provided to facilitate the loading of CSV files into the PostgreSQL database. The script leverages the pandas library for data manipulation and SQLAlchemy for database interaction, enabling seamless bulk data loading into the relevant database tables.

-----------------------------

**Setup Instructions**


**Database Configuration**
Begin by creating a database named crm_db within your local PostgreSQL environment. Tools like Postbird can be used for this purpose.

Modify the database connection string in the index.js file to reflect your local setup. Replace the placeholders with your PostgreSQL username and password:
"const DB_CONNECTION_STRING = 'postgresql://USERNAME:PASSWORD@localhost:5432/crm_db'"

Ensure that the CSV files are correctly located in your system. Update the file paths in the load_data.py script:
"for csv_file, table_name in csv_files.items():
    load_csv_to_postgres(f'C:/path/to/your/csvs/{csv_file}', table_name, DB_CONNECTION_STRING)"
    
Install the necessary Python libraries, including psycopg2, which is required for SQLAlchemy to interface with PostgreSQL. You can install it using pip:
"pip install psycopg2"


**Running the Project**

Run the load_data.py script to populate your PostgreSQL database with the data from the CSV files. This will ensure all relevant data tables (customers, contacts, interactions, and products) are filled.

Launch the Node.js server by navigating to your project directory and executing the following command:
"node index.js"

Once the server is running, open your web browser and go to http://localhost:3000 to access the CRM dashboard.
As you scroll down through the Interactions and Products tables, you will find visual data representations, such as price range distributions for products and interaction type frequencies, created using Chart.js.

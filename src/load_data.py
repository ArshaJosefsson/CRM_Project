import pandas as pd
from sqlalchemy import create_engine
import logging
import sys

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_csv_to_postgres(csv_path, table_name, db_connection_string):
    engine = None  # Initialize the engine variable
    try:
        # Extract data from a CSV file
        logging.info(f"Loading data from {csv_path} into {table_name} table")
        df = pd.read_csv(csv_path)

        # Load data into PostgreSQL
        engine = create_engine(db_connection_string)
        df.to_sql(table_name, engine, if_exists='replace', index=False)
        logging.info(f"Data successfully loaded into the '{table_name}' table")

    except Exception as e:
        logging.error("An error occurred while loading data", exc_info=True)
        sys.exit(1)
    finally:
        if engine is not None:
            engine.dispose()
            logging.info("Database connection closed")

if __name__ == "__main__":
    # Define paths for each CSV file and the corresponding table names
    csv_files = {
        'customers.csv': 'customers',
        'contacts.csv': 'contacts',
        'interactions.csv': 'interactions',
        'products.csv': 'products'
    }

    # Connection string for your local PostgreSQL database
    # !CHANGE CREDENTIALS!
    DB_CONNECTION_STRING = 'postgresql://USERNAME:PASSWORD@localhost:5432/crm_db'

    # Load each CSV into the corresponding table
    # !CHANGE PATH!
    for csv_file, table_name in csv_files.items():
        load_csv_to_postgres(f'C:/path/to/your/csvs/{csv_file}', table_name, DB_CONNECTION_STRING)

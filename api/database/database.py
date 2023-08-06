from sqlmodel import SQLModel, create_engine
from ..configs import get_db_credentaials

creds = get_db_credentaials()

# Form the connection string for PostgreSQL using the creds directly
database_url = f"postgresql://{creds['MEENEW_DB_USER']}:{creds['MEENEW_DB_PASSWORD']}@{creds['MEENEW_DB_HOST']}/meenew-dev"  # assuming your DB name is meenew-dev

engine = create_engine(database_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
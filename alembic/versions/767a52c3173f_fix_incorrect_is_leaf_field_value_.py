"""fix incorrect is_leaf field value assignment

Revision ID: 767a52c3173f
Revises: fc421c13f352
Create Date: 2023-07-29 21:21:14.606737

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '767a52c3173f'
down_revision = 'fc421c13f352'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("UPDATE tags SET is_leaf = 1 WHERE is_leaf = 'true'")
    op.execute("UPDATE tags SET is_leaf = 0 WHERE is_leaf = 'false'")

def downgrade() -> None:
    op.execute("UPDATE tags SET is_leaf = 'true' WHERE is_leaf = 1")
    op.execute("UPDATE tags SET is_leaf = 'false' WHERE is_leaf = 0")

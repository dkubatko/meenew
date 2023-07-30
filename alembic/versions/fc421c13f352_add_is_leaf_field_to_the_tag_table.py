"""add is_leaf field to the Tag table

Revision ID: fc421c13f352
Revises: 9db83e4eca34
Create Date: 2023-07-29 18:55:45.242287

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fc421c13f352'
down_revision = '9db83e4eca34'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tags', sa.Column('is_leaf', sa.Boolean, server_default='false'))

def downgrade():
    op.drop_column('tags', 'is_leaf')
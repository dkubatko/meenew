"""add image_path to menu_item table

Revision ID: fc2784a6df62
Revises: 
Create Date: 2023-07-24 19:46:08.466681

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fc2784a6df62'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('menuitems', sa.Column('image_path', sa.String, nullable=True))


def downgrade() -> None:
    op.drop_column('menuitems', 'image_path')

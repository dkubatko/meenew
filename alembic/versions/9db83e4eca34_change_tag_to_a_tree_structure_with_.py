"""change Tag to a tree structure with self-referential parent_id

Revision ID: 9db83e4eca34
Revises: fc2784a6df62
Create Date: 2023-07-27 19:53:15.560041

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column


# revision identifiers, used by Alembic.
revision = '9db83e4eca34'
down_revision = 'fc2784a6df62'
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table('tags') as batch_op:
        batch_op.add_column(sa.Column('parent_id', sa.Integer, nullable=True))
        batch_op.create_foreign_key('fk_tags_parent_id', 'tags', ['parent_id'], ['id'])


def downgrade() -> None:
    with op.batch_alter_table('tags') as batch_op:
        batch_op.drop_column('parent_id')
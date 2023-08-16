"""Change relationship between Category and Restaurant

Revision ID: ca178b8f6917
Revises: 462497bbd403
Create Date: 2023-08-15 22:13:05.038313

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ca178b8f6917'
down_revision = '462497bbd403'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('categories', 'restaurant_id',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.drop_index('ix_categories_restaurant_id', table_name='categories')
    op.create_index(op.f('ix_categories_restaurant_id'), 'categories', ['restaurant_id'], unique=False)
    # Add the root_tag_id column as nullable
    op.add_column('restaurants', sa.Column('root_tag_id', sa.Integer(), nullable=True))
    
    # Update all the existing rows to set root_tag_id to 0
    op.execute('UPDATE restaurants SET root_tag_id = 1')
    
    # Alter the root_tag_id column to set it as non-nullable
    op.alter_column('restaurants', 'root_tag_id', nullable=False)
    op.create_index(op.f('ix_restaurants_root_tag_id'), 'restaurants', ['root_tag_id'], unique=False)
    op.create_foreign_key('fk_restaurants_root_tag_id', 'restaurants', 'categories', ['root_tag_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('fk_restaurants_root_tag_id', 'restaurants', type_='foreignkey')
    op.drop_index(op.f('ix_restaurants_root_tag_id'), table_name='restaurants')
    op.drop_column('restaurants', 'root_tag_id')
    op.drop_index(op.f('ix_categories_restaurant_id'), table_name='categories')
    op.create_index('ix_categories_restaurant_id', 'categories', ['restaurant_id'], unique=False)
    op.alter_column('categories', 'restaurant_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###
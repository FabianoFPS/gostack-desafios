import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const params = {
  tableFK: 'orders_products',
  columnFK: 'product_id',
  nameFK: 'ProductsOrdersProducts',
  referencedTableName: 'products',
};

export default class AddProductsIdToOrdersProducts1613410090034
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      params.tableFK,
      new TableColumn({
        name: params.columnFK,
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      params.tableFK,
      new TableForeignKey({
        name: params.nameFK,
        columnNames: [params.columnFK],
        referencedColumnNames: ['id'],
        referencedTableName: params.referencedTableName,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(params.tableFK, params.nameFK);
    await queryRunner.dropColumn(params.tableFK, params.columnFK);
  }
}

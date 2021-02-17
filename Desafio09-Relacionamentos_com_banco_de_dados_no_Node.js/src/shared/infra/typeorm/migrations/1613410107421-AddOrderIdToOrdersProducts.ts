import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

const params = {
  tableFK: 'orders_products',
  columnFK: 'order_id',
  nameFK: 'OrderProducts',
  referencedTableName: 'orders',
};

export default class AddOrderIdToOrdersProducts1613410107421
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

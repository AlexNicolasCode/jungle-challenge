import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTaskUsersTable1696953600002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('task_users');
    if (tableExists) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'task_users',
        columns: [
          {
            name: 'task_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'task_users',
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tasks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'task_users',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('task_users');
    if (!tableExists) {
      return;
    }
    await queryRunner.dropTable('task_users');
  }
}

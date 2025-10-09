import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTasksTable1696953600001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('tasks');
    if (tableExists) {
      return;
    }
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'deadline',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'priority',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('tasks');
    if (!tableExists) {
      return;
    }
    await queryRunner.dropTable('tasks');
  }
}

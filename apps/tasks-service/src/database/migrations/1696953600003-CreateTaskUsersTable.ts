import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTaskUsersTable1696953600003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('task_comments');
    if (tableExists) {
      return;
    }
    await queryRunner.createTable(
      new Table({
        name: 'task_comments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'task_id',
            type: 'uuid',
          },
          {
            name: 'author_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
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

    await queryRunner.createForeignKey(
      'task_comments',
      new TableForeignKey({
        columnNames: ['task_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tasks',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'task_comments',
      new TableForeignKey({
        columnNames: ['author_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('task_comments');
    const taskFk = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('task_id') !== -1,
    );
    const authorFk = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('author_id') !== -1,
    );

    if (taskFk) await queryRunner.dropForeignKey('task_comments', taskFk);
    if (authorFk) await queryRunner.dropForeignKey('task_comments', authorFk);

    await queryRunner.dropTable('task_comments');
  }
}

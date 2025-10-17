# Projeto Fullstack - Microserviços

## Arquitetura

### Stacks utilizadas

* **Frontend:** TypeScript, Vite, React, Tanstack Router, Tailwind CSS
* **Backend:** NestJS, JWT, TypeORM, RabbitMQ
* **Banco de dados:** PostgreSQL
* **Monorepo:** TurboRepo

### Estrutura de pastas

```
├── apps
│   ├── api-gateway
│   │   ├── src
│   │   │   ├── database
│   │   │   │   ├── config
│   │   │   │   │   └── database.config.ts
│   │   │   │   ├── entities
│   │   │   │   │   ├── audit.entity.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── migrations
│   │   │   │   │   └── 1697430000000-CreateAudit.ts
│   │   │   │   └── repositories
│   │   │   │       ├── audit.repository.ts
│   │   │   │       └── index.ts
│   │   │   ├── modules
│   │   │   │   ├── auth
│   │   │   │   │   ├── dtos
│   │   │   │   │   │   ├── inputs
│   │   │   │   │   │   │   ├── create-user.input.dto.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── login.input.dto.ts
│   │   │   │   │   │   │   └── refresh-token.input.dto.ts
│   │   │   │   │   │   ├── outputs
│   │   │   │   │   │   │   ├── create-user.output.dto.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── login.output.dto.ts
│   │   │   │   │   │   │   └── refresh-token.output.dto.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── notifications
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── notification.gateway.ts
│   │   │   │   │   └── notification.module.ts
│   │   │   │   ├── tasks
│   │   │   │   │   ├── dtos
│   │   │   │   │   │   ├── inputs
│   │   │   │   │   │   │   ├── create-comment.input.dto.ts
│   │   │   │   │   │   │   ├── create-task.input.dto.ts
│   │   │   │   │   │   │   ├── delete-task-by-id.input.dto.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── load-comments.input.dto.ts
│   │   │   │   │   │   │   ├── load-task-by-id.input.dto.ts
│   │   │   │   │   │   │   ├── load-tasks.input.dto.ts
│   │   │   │   │   │   │   └── update-task-by-id.input.dto.ts
│   │   │   │   │   │   ├── outputs
│   │   │   │   │   │   │   ├── create-comment.output.dto.ts
│   │   │   │   │   │   │   ├── create-task.output.dto.ts
│   │   │   │   │   │   │   ├── delete-task.output.dto.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── load-comments.input.dto.ts
│   │   │   │   │   │   │   ├── load-task-by-id.output.dto.ts
│   │   │   │   │   │   │   ├── load-tasks.output.dto.ts
│   │   │   │   │   │   │   └── update-task-by-id.output.dto.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── task-comment.gateway.ts
│   │   │   │   │   ├── task.controller.ts
│   │   │   │   │   └── task.module.ts
│   │   │   │   ├── users
│   │   │   │   │   ├── dtos
│   │   │   │   │   │   ├── load-users
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── load-users.input.dto.ts
│   │   │   │   │   │   │   └── load-users.output.dto.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── user.controller.ts
│   │   │   │   │   └── user.module.ts
│   │   │   │   └── index.ts
│   │   │   ├── shared
│   │   │   │   ├── decorators
│   │   │   │   │   ├── logged-user
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── logged-user.decorator.ts
│   │   │   │   │   │   └── logged-user.output.dto.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── dtos
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── pagination.input.ts
│   │   │   │   │   └── pagination.output.ts
│   │   │   │   ├── enums
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── task-priority.enum.ts
│   │   │   │   │   └── task-status.enum.ts
│   │   │   │   ├── guards
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── jwt.guard.ts
│   │   │   │   │   └── local-auth.guard.ts
│   │   │   │   ├── interceptors
│   │   │   │   │   ├── audit.interceptor.ts
│   │   │   │   │   ├── http-error.transform.interceptor.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── microservice-response.interceptor.ts
│   │   │   │   ├── middlewares
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── load-logged-user.middleware.ts
│   │   │   │   └── strategies
│   │   │   │       ├── index.ts
│   │   │   │       ├── jwt.strategy.ts
│   │   │   │       └── local.strategy.ts
│   │   │   ├── app.module.ts
│   │   │   ├── healthz.controller.ts
│   │   │   └── main.ts
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── Dockerfile
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.build.json
│   │   ├── tsconfig.json
│   │   └── yarn.lock
│   ├── auth-service
│   │   ├── src
│   │   │   ├── database
│   │   │   │   ├── config
│   │   │   │   │   └── database.config.ts
│   │   │   │   ├── entities
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── password.entity.ts
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── migrations
│   │   │   │   │   ├── 1710000000000-CreateUsers.ts
│   │   │   │   │   └── 1710000000001-CreatePasswords.ts
│   │   │   │   └── repositories
│   │   │   │       ├── index.ts
│   │   │   │       ├── password.repository.ts
│   │   │   │       └── user.repository.ts
│   │   │   ├── modules
│   │   │   │   ├── auth
│   │   │   │   │   ├── dtos
│   │   │   │   │   │   ├── inputs
│   │   │   │   │   │   │   ├── create-user.input.dto.ts
│   │   │   │   │   │   │   ├── get-user-by-token.input.dto.ts.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── login.input.dto.ts
│   │   │   │   │   │   │   ├── refresh-token.input.dto.ts
│   │   │   │   │   │   │   └── validate-user.input.dto.ts
│   │   │   │   │   │   ├── outputs
│   │   │   │   │   │   │   ├── create-user.output.dto.ts
│   │   │   │   │   │   │   ├── get-user-by-token.output.dto.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── login.output.dto.ts
│   │   │   │   │   │   │   ├── refresh-token.output.dto.ts
│   │   │   │   │   │   │   └── validate-user.output.dto.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── services
│   │   │   │   │   │   ├── passwords
│   │   │   │   │   │   │   ├── check-password.service.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── load-password-by-user-id.service.ts
│   │   │   │   │   │   ├── tokens
│   │   │   │   │   │   │   ├── decode-token
│   │   │   │   │   │   │   │   ├── decode-token.input.dto.ts
│   │   │   │   │   │   │   │   ├── decode-token.output.dto.ts
│   │   │   │   │   │   │   │   ├── decode-token.service.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── generate-auth-tokens
│   │   │   │   │   │   │   │   ├── generate-auth-tokens.input.dto.ts
│   │   │   │   │   │   │   │   ├── generate-auth-tokens.output.dto.ts
│   │   │   │   │   │   │   │   ├── generate-auth-tokens.service.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   ├── generate-token
│   │   │   │   │   │   │   │   ├── generate-token.input.dto.ts
│   │   │   │   │   │   │   │   ├── generate-token.output.dto.ts
│   │   │   │   │   │   │   │   ├── generate-token.service.ts
│   │   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── users
│   │   │   │   │   │   │   ├── check-user-exists.service.ts
│   │   │   │   │   │   │   ├── create-user.service.ts
│   │   │   │   │   │   │   ├── hash.service.ts.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── load-user-by-email.service.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── usecases
│   │   │   │   │   │   ├── create-user.usecase.ts
│   │   │   │   │   │   ├── get-user-by-token.usecase.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── login.usercase.ts
│   │   │   │   │   │   ├── refresh-token.usecase.ts
│   │   │   │   │   │   └── validate-user.usecase.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   └── auth.module.ts
│   │   │   │   └── users
│   │   │   │       ├── services
│   │   │   │       │   ├── load-users
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── load-users.input.dto.ts
│   │   │   │       │   │   ├── load-users.output.dto.ts
│   │   │   │       │   │   └── load-users.service.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── usecases
│   │   │   │       │   ├── load-users
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── load-users.input.dto.ts
│   │   │   │       │   │   ├── load-users.output.dto.ts
│   │   │   │       │   │   └── load-users.usecase.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── user.controller.ts
│   │   │   │       └── user.module.ts
│   │   │   ├── shared
│   │   │   │   ├── dtos
│   │   │   │   │   ├── pagination
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── pagination.input.ts
│   │   │   │   │   │   └── pagination.output.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── filters
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── tcp-exception.filter.ts
│   │   │   │   ├── interceptors
│   │   │   │   │   ├── error-transform.interceptor.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── utils
│   │   │   │       ├── calculate-expire-at.util.ts
│   │   │   │       ├── duration-to-ms.util.ts
│   │   │   │       └── index.ts
│   │   │   ├── app.module.ts
│   │   │   ├── healthz.controller.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   └── jest-e2e.json
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── Dockerfile
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.build.json
│   │   ├── tsconfig.json
│   │   └── yarn.lock
│   ├── notification-service
│   │   ├── src
│   │   │   ├── modules
│   │   │   │   └── notifications
│   │   │   │       ├── services
│   │   │   │       │   ├── send-comment
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── send-comment.input.dto.ts
│   │   │   │       │   │   ├── send-comment.output.dto.ts
│   │   │   │       │   │   └── send-comment.service.ts
│   │   │   │       │   ├── send-notification-to-client
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── send-notification-to-client.input.dto.ts
│   │   │   │       │   │   ├── send-notification-to-client.output.dto.ts
│   │   │   │       │   │   └── send-notification-to-client.service.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── usecases
│   │   │   │       │   ├── comment-created
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── notify-comment-created.input.dto.ts
│   │   │   │       │   │   └── notify-comment-created.usecase.ts
│   │   │   │       │   ├── task-created
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── notify-task-created.input.dto.ts
│   │   │   │       │   │   └── notify-task-created.usecase.ts
│   │   │   │       │   ├── task-updated
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── notify-task-update.input.dto.ts
│   │   │   │       │   │   └── notify-task-update.usecase.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── handle-tasks-queue.controller.ts
│   │   │   │       └── notification.module.ts
│   │   │   ├── app.module.ts
│   │   │   ├── healthz.controller.ts
│   │   │   └── main.ts
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── Dockerfile
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.build.json
│   │   ├── tsconfig.json
│   │   └── yarn.lock
│   ├── tasks-service
│   │   ├── src
│   │   │   ├── database
│   │   │   │   ├── config
│   │   │   │   │   ├── database.config.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── entities
│   │   │   │   │   ├── comment.entity.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── task.entity.ts
│   │   │   │   │   └── user.entity.ts
│   │   │   │   ├── migrations
│   │   │   │   │   ├── 1696953600000-CreateUsersTable.ts
│   │   │   │   │   ├── 1696953600001-CreateTasksTable.ts
│   │   │   │   │   ├── 1696953600002-CreateTaskUsersTable.ts
│   │   │   │   │   └── 1696953600003-CreateTaskUsersTable.ts
│   │   │   │   └── repositories
│   │   │   │       ├── comment.repository.ts
│   │   │   │       ├── index.ts
│   │   │   │       └── task.repository.ts
│   │   │   ├── modules
│   │   │   │   ├── comments
│   │   │   │   │   ├── dtos
│   │   │   │   │   │   ├── inputs
│   │   │   │   │   │   │   ├── create-comment.input.dto.ts
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── load-comments.input.dto.ts
│   │   │   │   │   │   └── outputs
│   │   │   │   │   │       ├── create-comment.output.dto.ts
│   │   │   │   │   │       ├── index.ts
│   │   │   │   │   │       └── load-comments.input.dto.ts
│   │   │   │   │   ├── services
│   │   │   │   │   │   ├── create-comment
│   │   │   │   │   │   │   ├── create-comment.input.dto.ts
│   │   │   │   │   │   │   ├── create-comment.output.dto.ts
│   │   │   │   │   │   │   ├── create-comment.service.ts
│   │   │   │   │   │   │   └── index.ts
│   │   │   │   │   │   ├── load-comments
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── load-comments..service.ts
│   │   │   │   │   │   │   ├── load-comments.input.dto.ts
│   │   │   │   │   │   │   └── load-comments.output.dto.ts
│   │   │   │   │   │   ├── notify-comment-created
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   ├── notify-comment-created.input.dto.ts
│   │   │   │   │   │   │   ├── notify-comment-created.output.dto.ts
│   │   │   │   │   │   │   └── notify-comment-created.service.ts
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── usecases
│   │   │   │   │   │   ├── create-comment.usecase.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── load-comments.usecase.ts
│   │   │   │   │   ├── comment.controller.ts
│   │   │   │   │   ├── comment.module.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── tasks
│   │   │   │       ├── services
│   │   │   │       │   ├── create-task
│   │   │   │       │   │   ├── create-task.input.dto.ts
│   │   │   │       │   │   ├── create-task.output.dto.ts
│   │   │   │       │   │   ├── create-task.service.ts
│   │   │   │       │   │   └── index.ts
│   │   │   │       │   ├── delete-task-by-id
│   │   │   │       │   │   ├── delete-task-by-id.input.dto.ts
│   │   │   │       │   │   ├── delete-task-by-id.output.dto.ts
│   │   │   │       │   │   ├── delete-task-by-id.service.ts
│   │   │   │       │   │   └── index.ts
│   │   │   │       │   ├── load-task-by-id
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── load-task-by-id.input.dto.ts
│   │   │   │       │   │   ├── load-task-by-id.output.dto.ts
│   │   │   │       │   │   └── load-task-by-id.service.ts
│   │   │   │       │   ├── load-tasks
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── load-tasks.input.dto.ts
│   │   │   │       │   │   ├── load-tasks.output.dto.ts
│   │   │   │       │   │   └── load-tasks.service.ts
│   │   │   │       │   ├── notify-task-created
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── notify-task-created.input.dto.ts
│   │   │   │       │   │   ├── notify-task-created.output.dto.ts
│   │   │   │       │   │   └── notify-task-created.service.ts
│   │   │   │       │   ├── notify-task-updated
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── notify-task-updated.input.dto.ts
│   │   │   │       │   │   ├── notify-task-updated.output.dto.ts
│   │   │   │       │   │   └── notify-task-updated.service.ts
│   │   │   │       │   ├── update-task-by-id
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── update-task-by-id.input.dto.ts
│   │   │   │       │   │   ├── update-task-by-id.output.dto.ts
│   │   │   │       │   │   └── update-task-by-id.service.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── usecases
│   │   │   │       │   ├── create-task
│   │   │   │       │   │   ├── create-task.input.dto.ts
│   │   │   │       │   │   ├── create-task.output.dto.ts
│   │   │   │       │   │   ├── create-task.usecase.ts
│   │   │   │       │   │   └── index.ts
│   │   │   │       │   ├── delete-task-by-id
│   │   │   │       │   │   ├── delete-task-by-id.input.dto.ts
│   │   │   │       │   │   ├── delete-task-by-id.output.dto.ts
│   │   │   │       │   │   ├── delete-task-by-id.usecase.ts
│   │   │   │       │   │   └── index.ts
│   │   │   │       │   ├── load-task-by-id
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── load-task-by-id.input.dto.ts
│   │   │   │       │   │   ├── load-task-by-id.output.dto.ts
│   │   │   │       │   │   └── load-task-by-id.usecase.ts
│   │   │   │       │   ├── load-tasks
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── load-tasks.input.dto.ts
│   │   │   │       │   │   ├── load-tasks.output.dto.ts
│   │   │   │       │   │   └── load-tasks.usecase.ts
│   │   │   │       │   ├── update-task-by-id
│   │   │   │       │   │   ├── index.ts
│   │   │   │       │   │   ├── update-task-by-id.input.dto.ts
│   │   │   │       │   │   ├── update-task-by-id.output.dto.ts
│   │   │   │       │   │   └── update-task-by-id.usecase.ts
│   │   │   │       │   └── index.ts
│   │   │   │       ├── task.controller.ts
│   │   │   │       └── task.module.ts
│   │   │   ├── shared
│   │   │   │   ├── dtos
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── logged-user.input.ts
│   │   │   │   │   ├── pagination.input.ts
│   │   │   │   │   └── pagination.output.ts
│   │   │   │   ├── enums
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── task-priority.enum.ts
│   │   │   │   │   └── task-status.enum.ts
│   │   │   │   └── filters
│   │   │   │       ├── index.ts
│   │   │   │       └── tcp-exception.filter.ts
│   │   │   ├── app.module.ts
│   │   │   ├── healthz.controller.ts
│   │   │   └── main.ts
│   │   ├── tests
│   │   │   ├── modules
│   │   │   │   └── tasks
│   │   │   │       └── usecases
│   │   │   │           ├── create-task.usecase.test.ts
│   │   │   │           ├── delete-task-by-id.usecase.test.ts
│   │   │   │           └── update-task-by-id.usecase.test.ts
│   │   │   └── shared
│   │   │       └── mocks
│   │   │           ├── index.ts
│   │   │           ├── logged-user.input.mock.ts
│   │   │           └── task.mock.ts
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── babel.config.js
│   │   ├── Dockerfile
│   │   ├── eslint.config.mjs
│   │   ├── jest.config.js
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.build.json
│   │   ├── tsconfig.json
│   │   └── yarn.lock
│   └── web
│       ├── public
│       │   ├── typescript.svg
│       │   └── vite.svg
│       ├── src
│       │   ├── clients
│       │   │   ├── auth
│       │   │   │   └── index.ts
│       │   │   ├── tasks
│       │   │   │   └── index.ts
│       │   │   └── users
│       │   │       └── index.ts
│       │   ├── components
│       │   │   ├── ui
│       │   │   │   ├── alert.tsx
│       │   │   │   ├── button.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── navigation-menu.tsx
│       │   │   │   └── select.tsx
│       │   │   ├── back-to-home.tsx
│       │   │   ├── index.ts
│       │   │   ├── toast-notification.tsx
│       │   │   └── user-list.tsx
│       │   ├── contexts
│       │   │   ├── auth
│       │   │   │   ├── auth.context.ts
│       │   │   │   ├── auth.provider.tsx
│       │   │   │   ├── auth.types.ts
│       │   │   │   └── index.ts
│       │   │   ├── notification
│       │   │   │   ├── index.ts
│       │   │   │   ├── notification.context.ts
│       │   │   │   ├── notification.provider.tsx
│       │   │   │   └── notification.types.ts
│       │   │   ├── tasks
│       │   │   │   ├── index.ts
│       │   │   │   ├── task.context.ts
│       │   │   │   ├── task.provider.tsx
│       │   │   │   └── task.types.ts
│       │   │   ├── users
│       │   │   │   ├── index.ts
│       │   │   │   ├── user.context.ts
│       │   │   │   ├── user.provider.tsx
│       │   │   │   └── user.types.ts
│       │   │   └── index.ts
│       │   ├── hooks
│       │   │   ├── index.ts
│       │   │   ├── use-auth.hook.ts
│       │   │   ├── use-notification.hook.ts
│       │   │   ├── use-tasks.hook.ts
│       │   │   └── use-user.hook.ts
│       │   ├── lib
│       │   │   └── utils.ts
│       │   ├── routes
│       │   │   ├── login
│       │   │   │   ├── -schemas.ts
│       │   │   │   └── index.tsx
│       │   │   ├── register
│       │   │   │   └── index.tsx
│       │   │   ├── tasks
│       │   │   │   ├── $id
│       │   │   │   │   ├── -components
│       │   │   │   │   │   ├── index.ts
│       │   │   │   │   │   ├── task-comment.tsx
│       │   │   │   │   │   ├── task-details.tsx
│       │   │   │   │   │   └── task-edti-mode.tsx
│       │   │   │   │   ├── -schemas.ts
│       │   │   │   │   └── index.tsx
│       │   │   │   └── create.tsx
│       │   │   ├── __root.tsx
│       │   │   └── index.tsx
│       │   ├── shared
│       │   │   ├── enums
│       │   │   │   ├── index.ts
│       │   │   │   ├── task-priority.enum.ts
│       │   │   │   └── task-status.enum.ts
│       │   │   ├── types
│       │   │   │   ├── comment.ts
│       │   │   │   ├── filter-props.ts
│       │   │   │   ├── index.ts
│       │   │   │   ├── task.ts
│       │   │   │   └── user.ts
│       │   │   └── utils
│       │   │       ├── get-access-token.util.ts
│       │   │       ├── get-tokens.util.ts
│       │   │       └── index.ts
│       │   ├── global.css
│       │   ├── main.tsx
│       │   ├── routeTree.gen.ts
│       │   └── vite-env.d.ts
│       ├── .eslintrc.cjs
│       ├── components.json
│       ├── Dockerfile
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── packages
│   ├── eslint-config
│   │   ├── index.js
│   │   └── package.json
│   └── typescript-config
│       ├── base.json
│       ├── package.json
│       ├── react-library.json
│       └── vite.json
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── docker-compose.yml
├── init_db.sh
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
├── turbo.json
└── yarn.lock
```

Cada aplicação possui sua própria estrutura de `src`, `modules`, `database` e testes.

### Bancos de dados

Cada microserviço possui seu próprio banco para garantir independência:

* `api-gateway` → `audit_db`
* `auth-service` → `auth_db`
* `tasks-service` → `tasks_db`

> O `notification-service` não possui banco próprio.

### Documentação da API

* Pode ser acessada via endpoint:

  ```
  GET /api/docs
  ```

## Endpoints Principais

### Autenticação

* `POST /api/auth/register` → Registrar usuário
* `POST /api/auth/login` → Login
* `POST /api/auth/refresh` → Atualizar token

### Tarefas

* `GET /api/tasks?page=&size` → Listar tarefas
* `POST /api/tasks` → Criar tarefa
* `GET /api/tasks/:id` → Obter detalhes da tarefa
* `PUT /api/tasks/:id` → Atualizar tarefa
* `DELETE /api/tasks/:id` → Deletar tarefa (lógico)

### Comentários

* `POST /api/tasks/:id/comments` → Criar comentário
* `GET /api/tasks/:id/comments?page=&size` → Listar comentários

## Design Patterns

* Singleton
* Dependency Injection
* Single Responsibility
* Decorator
* Repository

## Decisões técnicas e trade-offs

* Arquitetura focada em **escalabilidade e manutenção**.
* Separação clara: `Controller → UseCase → Service → Repository → DB`.
* **UseCases** isolam DTOs e regras de negócio, permitindo fácil alteração dos campos.
* **Services** fornecem camada externa, integrando com Repositories.
* Frontend simples e intuitivo usando TanStack Router e Tailwind CSS.
* Foco em UX: filtros simples, criação rápida de tarefas, edição lógica, scroll infinito.

## Problemas conhecidos

* Consumer do RabbitMQ não processa em batch → possível limitação de escalabilidade.
* Auth-service acessa frequentemente o banco → possível overhead com muitos usuários.

### Possíveis melhorias

* Mais testes unitários e de integração
* Processamento em batch no consumer
* Sistema de retentativa no notification-service
* Implementar gRPC para reduzir latência
* Observabilidade mais robusta
* Depender de interfaces em vez de implementações diretas (SOLID DI)
* Evitar overfetching em algumas rotas

## Tempo gasto

* Arquitetura: 2h
* Desenvolvimento: 20h
* Dockerize: 2h

## Rodando o projeto

### Instalação local

```bash
yarn
yarn dev
```

### Usando Docker

```bash
docker-compose up -d
```

Para desligar os containers:

```bash
docker-compose down
```
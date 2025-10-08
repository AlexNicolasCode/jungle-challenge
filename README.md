# Jungle Challenge

## Endpoints
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh

GET    /api/tasks?page=&size=               # lista de tarefas com paginação
POST   /api/tasks                           # cria e publica `task.created`
GET    /api/tasks/:id
PUT    /api/tasks/:id                       # atualiza e publica `task.updated`
DELETE /api/tasks/:id

POST   /api/tasks/:id/comments              # publica `task.comment.created`
GET    /api/tasks/:id/comments?page=&size   # lista de comentários com paginação

## Architecture
.
├── apps/
│   ├── web/                     
│   │   ├── src/                  # React + TanStack Router + shadcn + Tailwind
│   │   ├── Dockerfile   
│   │   ├── .env.example          # variáveis de ambiente do frontend
│   │   ├── package.json              
│   ├── api-gateway/   
│   │   ├── src/                  # HTTP + WebSocket + Swagger
│   │   ├── Dockerfile
│   │   ├── .env.example          # variáveis do API Gateway (Nest.js)
│   │   ├── package.json
│   ├── auth-service/            
│   │   ├── src/                  # Nest.js (microserviço de autenticação)
│   │   ├── migrations/
│   │   ├── Dockerfile
│   │   ├── .env.example          # variáveis do serviço de autenticação
│   │   ├── package.json
│   ├── tasks-service/   
│   │   ├── src/                  # Nest.js (microserviço RabbitMQ)
│   │   ├── migrations/
│   │   ├── Dockerfile        
│   │   ├── .env.example          # variáveis do serviço de tarefas
│   │   ├── package.json
│   └── notifications-service/   
│       ├── src/                  # Nest.js (microserviço RabbitMQ + WebSocket)
│       ├── migrations/
│       ├── Dockerfile
│       ├── .env.example          # variáveis do serviço de notificações
│       ├── package.json                
├── packages/
│   ├── types/                   
│   ├── utils/                   
│   ├── eslint-config/           
│   └── tsconfig/                
├── docker-compose.yml
├── turbo.json
├── package.json
└── README.md
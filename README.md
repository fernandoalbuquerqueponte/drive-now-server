# drive-now

## Visão Geral

Drive Now é um servidor Node.js para um sistema de reservas de carros, construído com Express, Prisma e Stripe. O backend oferece autenticação JWT, upload de imagens via Cloudinary, gerenciamento de usuários, gerenciamento de carros, reservas e processamento de pagamentos.

## Arquitetura

O projeto adota uma arquitetura modular inspirada em Clean Architecture/Hexagonal Architecture. Os principais componentes são:

- `src/routes` - camada de roteamento HTTP.
- `src/controllers` - orquestração de requisições e respostas.
- `src/use-cases` - regras de negócio e casos de uso da aplicação.
- `src/repositories` - acesso a dados e abstrações do banco de dados.
- `src/adapters` - integrações com serviços externos (JWT, Stripe, Cloudinary, bcrypt, UUID).
- `src/middlewares` - autenticação e upload de arquivos.
- `src/schemas` - validações com Zod.
- `src/factories` - construção de dependências e montagem de controladores.
- `src/docs` - especificação OpenAPI/Swagger.

## Módulos do Sistema

### Users

- Cadastro de usuário.
- Login com geração de access token e refresh token.
- Atualização de perfil com upload de imagem.
- Consulta do usuário logado.
- Exclusão de conta.

### Cars

- Criação e atualização de carros com imagem principal e galeria.
- Listagem de carros com suporte a filtros via query string.
- Detalhes do carro por ID.
- Adição de avaliações.
- Listagem de reservas por carro e por usuário.
- Reserva de carro.
- Cancelamento de reserva.

### Payments

- Criação de sessão de checkout Stripe a partir de uma reserva.
- Recebimento e processamento de webhooks Stripe.

## Fluxos do Sistema

1. Autenticação
   - `POST /api/users/login` -> valida credenciais.
   - `POST /api/users/refresh-token` -> renova tokens JWT.
   - `auth` middleware protege rotas com header `Authorization: Bearer <token>`.

2. Gestão de Usuário
   - `POST /api/users` -> cadastro.
   - `GET /api/users` -> obtém dados do usuário autenticado.
   - `PATCH /api/users` -> atualiza usuário e faz upload de imagem.
   - `DELETE /api/users` -> remove conta.

3. Gestão de Carros
   - `POST /api/cars` -> cria carro com upload de `image` e `gallery`.
   - `GET /api/cars` -> lista carros com filtros via query string.
   - `GET /api/cars/:carId/details` -> detalhes do carro.
   - `GET /api/cars/:carId` -> lista avaliações do carro.
   - `POST /api/cars/:carId/reviews` -> cria review.
   - `PATCH /api/cars/:carId` -> atualiza carro e imagens.
   - `DELETE /api/cars/:carId` -> deleta carro.

4. Reservas e Pagamentos
   - `POST /api/cars/reserve/:carId` -> reserva carro.
   - `GET /api/cars/:carId/bookings` -> lista reservas do carro.
   - `GET /api/cars/bookings/user` -> lista reservas do usuário autenticado.
   - `PATCH /api/cars/booking/:bookingId/cancel` -> cancela reserva.
   - `POST /api/payments/checkout` -> inicia checkout Stripe.
   - `POST /api/payments/webhook` -> consome evento Stripe.

## Configuração

### Instalação

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm run dev
```

### Testes

```bash
npm test
```

### Variáveis de Ambiente

O servidor usa as seguintes variáveis de ambiente:

- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`
- `FRONTEND_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Documentação Swagger

A documentação da API está disponível em tempo de execução em `/docs` e a especificação está em `src/docs/swagger.json`.

## Observações

- `uploads/` é servido como conteúdo estático.
- O servidor utiliza `Prisma` para acesso a um banco Postgres.
- `Cloudinary` é usado para armazenar imagens de carro e perfil de usuário.

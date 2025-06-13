# CoolFinder App

Aplicativo para encontrar estabelecimentos próximos com suporte a fotos e geolocalização.

## Estrutura do Projeto

O projeto está dividido em duas partes:

### Frontend (coolfinder-frontend)

- React Native com Expo
- TypeScript
- Geolocalização
- Câmera para fotos
- Interface moderna e responsiva

### Backend (coolfinder-backend)

- Node.js com Express
- MongoDB para armazenamento
- API RESTful
- Suporte a CORS
- Upload de imagens

## Configuração do Ambiente

### Backend

1. Instale as dependências:

```bash
cd coolfinder-backend
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações

3. Inicie o servidor:

```bash
npm start
```

### Frontend

1. Instale as dependências:

```bash
cd coolfinder-frontend
npm install
```

2. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações

3. Inicie o app:

```bash
npx expo start
```

## Funcionalidades

- [x] Listagem de estabelecimentos
- [x] Cadastro de novos estabelecimentos
- [x] Captura de fotos
- [x] Geolocalização
- [x] Cálculo de distância
- [x] Interface responsiva
- [x] Suporte a iOS e Android

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Node.js
- Express
- MongoDB
- Axios
- NGrok (para desenvolvimento)

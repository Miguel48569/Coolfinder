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

## Contribuindo

1. Faça o fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

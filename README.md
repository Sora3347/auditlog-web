# 📋 AuditLog Web

Aplicação web para **registro** e **auditoria** de eventos do sistema, unindo desenvolvimento web com princípios de conformidade e integridade de dados.

## ✨ Funcionalidades
- Registrar eventos (tipo, descrição, usuário)
- Listar e filtrar por tipo, usuário e intervalo de datas
- Cadeia de integridade por hash (SHA-256 encadeado)
- Verificação de integridade dos eventos (auditoria)
- Front-end simples e responsivo; API REST em Node.js/Express
- Armazenamento em **JSON** (sem dependências nativas).

## 🧱 Arquitetura
```
auditlog-web/
├── backend/
│   ├── audit.js        # hash e verificação da cadeia
│   ├── database.js     # persistência em JSON
│   ├── server.js       # API Express + entrega do front-end
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── LICENSE
└── README.md
```

## 🚀 Executar localmente

1) Instale o back-end:
```bash
cd backend
npm install
npm start
```
O servidor sobe em `http://localhost:3000`.

2) Acesse o front-end: abra `frontend/index.html` (ou simplesmente acesse `http://localhost:3000/` que já entrega o front-end).

## 🔌 Endpoints
- `POST /api/events` – cria evento  
  **Body JSON:** `{ "type": "login", "description": "Login realizado", "user": "joao" }`
- `GET /api/events` – lista com filtros (`type`, `user`, `from`, `to`)
- `GET /api/events/verify` – verifica integridade da cadeia (auditoria)

## 🧪 Teste rápido via curl
```bash
curl -X POST http://localhost:3000/api/events   -H "Content-Type: application/json"   -d '{"type":"login","description":"Login bem-sucedido","user":"ana"}'

curl "http://localhost:3000/api/events?type=login"
curl "http://localhost:3000/api/events/verify"
```

## 🧭 Objetivo de aprendizado
- Organização de API
- Boas práticas iniciais de auditoria (hash encadeado)
- Filtragem e paginação simples no front-end
- Padrões REST e persistência simples

## 📘 O que aprendi com este projeto

Desenvolver o **AuditLog Web** foi uma oportunidade para reforçar conceitos técnicos e boas práticas de desenvolvimento e auditoria. Alguns dos principais aprendizados foram:

- **Organização de projeto full stack**: separar claramente as responsabilidades de front-end, back-end e persistência de dados.
- **Criação de APIs REST**: uso do Express para construir endpoints claros e organizados, seguindo padrões de filtragem e retorno de dados.
- **Persistência simples em arquivos JSON**: manipulação de leitura e escrita de dados sem depender de banco de dados relacional.
- **Integridade de dados com hash encadeado**: aplicação prática do conceito de auditoria de sistemas, garantindo que alterações sejam detectáveis.
- **Interação front-end ↔ back-end**: consumo de APIs via JavaScript usando `fetch`, com tratamento de erros e renderização dinâmica.
- **Boas práticas de UX**: formulários claros, feedback de mensagens e organização visual simples e responsiva.
- **Pensamento analítico para auditoria**: compreender que além de desenvolver, é preciso pensar em mecanismos de controle e verificação.
- **Valorização de segurança e ética na tecnologia**: reforço do compromisso com a transparência e confiabilidade das informações.

Esses aprendizados fortalecem não apenas minha base como desenvolvedor web, mas também minha visão para atuar na área de **auditoria de TI**, unindo técnica e integridade.

## 📄 Licença
MIT – veja `LICENSE`.

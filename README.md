# Arseg - Extintores e Equipamentos de Segurança

Aplicativo web para gestão e venda de extintores de incêndio, construído com React, TypeScript e Supabase.

## Tecnologias Utilizadas

- **React 18.3.1** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Component library
- **React Router DOM** - Routing
- **Supabase** - Backend como serviço (autenticação e banco de dados)
- **TanStack Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas

## Configuração do Ambiente

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-aqui
VITE_RESEND_API_KEY=sua-chave-resend-aqui
```

### Configuração do Resend (para lembretes por email)

Para habilitar o envio de lembretes de renovação por email:

1. Crie uma conta no [Resend](https://resend.com)
2. Obtenha sua API key no painel do Resend
3. Adicione a chave no arquivo `.env`:
```
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Nota**: Sem a chave do Resend, os lembretes serão criados mas não enviados por email.

### Execução

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra [http://localhost:8080](http://localhost:8080) no seu navegador.

## Deploy

Para fazer deploy do aplicativo:

1. **Build do projeto**:
```bash
npm run build
```

2. **Deploy em plataforma estática** (Vercel, Netlify, etc.):
   - Faça upload da pasta `dist` gerada pelo build
   - Configure as variáveis de ambiente no painel da plataforma

3. **Alternativa: Docker**:
```bash
# Build da imagem
docker build -t arseg-app .

# Execução do container
docker run -p 8080:8080 --env-file .env arseg-app
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes React reutilizáveis
├── pages/              # Páginas da aplicação
├── contexts/           # Contextos React para estado global
├── hooks/              # Custom hooks
├── lib/                # Utilitários e funções auxiliares
├── integrations/       # Integrações com serviços externos (Supabase)
└── assets/             # Assets estáticos
```

## Banco de Dados

O aplicativo utiliza o Supabase como backend. As tabelas principais são:

- `products` - Produtos (extintores)
- `customers` - Clientes
- `quotes` - Orçamentos
- `suppliers` - Fornecedores
- `user_roles` - Permissões de usuários
- `renewal_reminders` - Lembretes de renovação de extintores

## Sistema de Lembretes de Renovação

O sistema possui um mecanismo automático de lembretes para renovação de extintores:

### Funcionalidades

- **Criação Automática**: Quando um orçamento é aprovado, um lembrete de renovação é criado automaticamente
- **Calendário Inteligente**: 
  - Renovação programada para 1 ano após a aprovação
  - Lembrete enviado 1 mês antes da data de renovação
- **Envio por Email**: Lembretes são enviados automaticamente por email usando Resend
- **Gerenciamento Administrativo**: Interface completa para visualizar e gerenciar todos os lembretes
- **Status Tracking**: Acompanhe o status dos lembretes (Pendente, Enviado, Concluído, Cancelado)
- **Notificações no Dashboard**: Alertas visuais para lembretes pendentes

### Como Usar

1. **Aprovar Orçamento**: No painel administrativo, mude o status de um orçamento para "Aprovado"
2. **Lembrete Automático**: O sistema cria automaticamente um lembrete de renovação
3. **Envio de Email**: Configure o Resend e clique em "Enviar Lembretes Pendentes" para enviar emails
4. **Gerenciar Lembretes**: Acesse "Lembretes de Renovação" no dashboard para visualizar e gerenciar
5. **Atualizar Status**: Marque lembretes como enviados, concluídos ou cancelados

### Configuração de Email

Para enviar lembretes por email:

1. Configure a variável `VITE_RESEND_API_KEY` no arquivo `.env`
2. Certifique-se de que os clientes possuem email cadastrado nos orçamentos
3. Use o botão "Enviar Lembretes Pendentes" na página de lembretes

### Acesso aos Lembretes

- **Dashboard**: Notificações automáticas de lembretes pendentes
- **Menu Admin**: Botão "Lembretes de Renovação" nas ações rápidas
- **URL**: `/admin/renewal-reminders`

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -am 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## Licença

Este projeto está sob licença MIT.

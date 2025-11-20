# Dashboard de Clientes

Dashboard para análise e monitoramento de serviços de clientes, integrado com Supabase.

## Tecnologias

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Supabase** - Banco de dados e backend

## Serviços Suportados

O dashboard está preparado para analisar os seguintes serviços:

- **Platforms**: Swoogo, WordPress, Drupal
- **WordPress Plugins**
- **Zapier** - Dados de automação
- **Email Marketing**: MailJet, Constant Contact
- **Social Media**: Facebook, X (Twitter), Instagram, LinkedIn, Reddit
- **Google Services**: Analytics, Search Results, Ads
- **Hosting Performance**

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Você pode encontrar essas credenciais no painel do Supabase em Settings > API.

### 3. Executar o projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
src/
  ├── components/        # Componentes reutilizáveis
  │   ├── Card.tsx
  │   ├── Header.tsx
  │   ├── Layout.tsx
  │   └── MetricCard.tsx
  ├── lib/              # Configurações
  │   └── supabase.ts   # Cliente Supabase
  ├── services/         # Serviços de integração
  │   ├── platforms/
  │   ├── wp-plugins/
  │   ├── zapier/
  │   ├── email/
  │   ├── social/
  │   ├── google/
  │   └── hosting/
  ├── types/            # Tipos TypeScript
  │   ├── index.ts
  │   └── supabase.ts
  ├── hooks/            # Custom hooks
  └── App.tsx           # Componente principal
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## Próximos Passos

1. Configurar o schema do banco de dados no Supabase
2. Implementar as integrações com cada serviço
3. Criar componentes específicos para cada tipo de análise
4. Adicionar autenticação (quando necessário)

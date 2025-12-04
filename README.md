# Clients Dashboard

Dashboard for analyzing and monitoring client services, integrated with Supabase.

## Technologies

- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Database and backend

## Supported Services

The dashboard is prepared to analyze the following services:

- **Platforms**: Swoogo, WordPress, Drupal
- **WordPress Plugins**
- **Zapier** - Automation data
- **Email Marketing**: MailJet, Constant Contact
- **Social Media**: Facebook, X (Twitter), Instagram, LinkedIn, Reddit
- **Google Services**: Analytics, Search Results, Ads
- **Hosting Performance**

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these credentials in the Supabase dashboard under Settings > API.

### 3. Run the project

```bash
npm run dev
```

The project will be available at `http://localhost:5173`

## Project Structure

```
src/
  ├── components/        # Reusable components
  │   ├── Card.tsx
  │   ├── Header.tsx
  │   ├── Layout.tsx
  │   └── MetricCard.tsx
  ├── lib/              # Configuration
  │   └── supabase.ts   # Supabase client
  ├── services/         # Integration services
  │   ├── platforms/
  │   ├── wp-plugins/
  │   ├── zapier/
  │   ├── email/
  │   ├── social/
  │   ├── google/
  │   └── hosting/
  ├── types/            # TypeScript types
  │   ├── index.ts
  │   └── supabase.ts
  ├── hooks/            # Custom hooks
  └── App.tsx           # Main component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## Next Steps

1. Configure the database schema in Supabase
2. Implement integrations with each service
3. Create specific components for each type of analysis
4. Add authentication (when necessary)

# Documentation Hosting Platform

A complete, production-ready fullstack documentation hosting web application built with React, TypeScript, and Supabase.

## Features

### Core Features
- **User Authentication & Roles**: Supabase Auth with email/password login, admin and public roles
- **Documentation Management**: Upload, edit, and delete Markdown documents with rich formatting
- **Category & Tag System**: Organize documentation with categories and tags
- **Search & Navigation**: Full-text search with sidebar navigation
- **Document Viewer**: Clean Markdown rendering with syntax highlighting and table of contents
- **SEO Optimization**: SEO-friendly URLs, meta tags, and structured data
- **Settings & Customization**: Admin-configurable app settings
- **Responsive Design**: Mobile-friendly with light/dark mode support

### Technical Features
- **Supabase Integration**: PostgreSQL database with Row Level Security (RLS)
- **File Storage**: Supabase Storage for document assets
- **Real-time Updates**: Live data synchronization
- **Performance Optimized**: Lazy loading, code splitting, and caching
- **Deployment Ready**: Configured for Vercel, Netlify, and other platforms

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd documentation-platform
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Supabase**:
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file from `.env.example`
   - Add your Supabase credentials

4. **Run database migrations**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration script from `supabase/migrations/create_documentation_schema.sql`

5. **Start the development server**:
```bash
npm run dev
```

6. **Create an admin user**:
   - Register a new account
   - In your Supabase dashboard, go to Authentication > Users
   - Edit the user and change the `role` from 'public' to 'admin' in the `profiles` table

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── docs/           # Documentation-specific components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Database Schema

The application uses a PostgreSQL database with the following main tables:

- `profiles`: User profiles with roles
- `categories`: Documentation categories
- `tags`: Tags for organizing content
- `documents`: Main documentation content
- `document_tags`: Many-to-many relationship for documents and tags
- `app_settings`: Configurable application settings

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Netlify
1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

### Other Platforms
The application is a standard Vite React app and can be deployed to any platform that supports Node.js applications.

## Admin Features

### Document Management
- Create, edit, and delete documents
- Markdown editor with preview
- Draft and published states
- SEO metadata configuration

### Category & Tag Management
- Create and organize categories
- Manage tags for content organization
- Color-coded organization system

### App Settings
- Customize site name and description
- Upload logo and favicon
- Configure theme colors
- Manage footer content

## User Features

### Public Users
- Browse published documentation
- Search across all content
- View documents with rich formatting
- Responsive mobile experience

### Registered Users
- Same as public users
- Access to draft content (if permitted)
- Personalized experience

## Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure file upload handling
- SQL injection prevention
- XSS protection

## Performance

- Lazy loading for optimal performance
- Image optimization
- Code splitting
- Caching strategies
- Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
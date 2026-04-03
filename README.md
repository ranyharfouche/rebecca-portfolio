# Rebecca Abi Younes Portfolio

A modern portfolio website built with Next.js, featuring a dynamic "Showcase of Creations" section with an admin dashboard for content management.

## Features

- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Auto-scrolling Showcase**: Projects automatically scroll in the showcase section
- **Admin Dashboard**: Secure admin area for managing projects
- **Dynamic Content**: Projects are managed through a backend API
- **Modern UI**: Purple gradient theme with glass morphism effects

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoint
│   │   └── projects/      # Projects CRUD API
│   ├── admin/             # Admin dashboard page
│   └── page.tsx           # Main portfolio page
├── components/
│   ├── Hero.tsx           # Hero section
│   ├── About.tsx          # About section
│   ├── Showcase.tsx       # Projects showcase
│   ├── OtherPassions.tsx  # Other passions section
│   └── Footer.tsx         # Footer section
└── data/
    └── projects.json      # Projects data storage
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **URL**: `/admin`
- **Username**: `becca`
- **Password**: `beccs`

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy automatically

### Environment Variables

No environment variables are required for this basic setup. The project uses a JSON file for data storage.

## API Endpoints

### Authentication
- `POST /api/auth` - Login with username and password

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects` - Update existing project
- `DELETE /api/projects?id={id}` - Delete project

## Project Fields

Each project contains:
- `id`: Unique identifier
- `title`: Project title
- `category`: Project category
- `description`: Project description
- `platforms`: Array of platforms/technologies used
- `image`: Image URL

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **JSON File Storage**: Simple data persistence

## Customization

To customize the theme or content:

1. Modify colors in `src/app/globals.css`
2. Update component content in `src/components/`
3. Add new sections as needed

## Future Enhancements

- Database integration (PostgreSQL/MySQL)
- Image upload functionality
- Project categories and filtering
- Contact form integration
- Blog section

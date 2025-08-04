# Ballet Academy Full-Stack Application

A full-stack web application for exploring classical ballets, ballet steps, and equipment with relational database connections.

## Prerequisites

- **Node.js** (version 18 or higher)
- **PostgreSQL** (version 12 or higher)
- **npm** (comes with Node.js)

## Quick Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd capstone
```

### 2. Backend Setup

```bash
cd fsu-backend
npm run setup
```

Edit the `.env` file with your database connection:

```env
DATABASE_URL=postgres://your_username@localhost:5432/fsu
PORT=3002
```

Create the database and load schema:

```bash
npm run db:create
npm run db:reset
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../fsu-frontend
npm run setup
```

Create a `.env` file (optional - for custom API URL):

```env
VITE_API_URL=http://localhost:3002
```

Start the frontend:

```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5175
- Backend API: http://localhost:3002

## Environment Variables

### Backend (.env)

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3002)

### Frontend (.env)

- `VITE_API_URL`: Backend API URL (default: http://localhost:3002)

## Database Schema

The application uses three main tables with relationships:

- **Ballets**: Classical ballet information
- **Steps**: Ballet technique movements
- **Equipment**: Ballet gear and accessories
- **Ballet_Steps**: Many-to-many relationship between ballets and steps
- **Step_Equipment**: Many-to-many relationship between steps and equipment

## API Endpoints

- `GET /api/ballets` - All ballets
- `GET /api/steps` - All steps
- `GET /api/equipment` - All equipment
- `GET /api/ballets-with-steps` - Ballets with their associated steps
- `GET /api/steps-with-equipment` - Steps with their required equipment

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running
2. Check your database URL in `.env`
3. Verify the database exists: `createdb fsu`

### Port Conflicts

- Backend: Change `PORT` in `.env` or `server.js`
- Frontend: Vite will automatically find an available port

### CORS Issues

- Backend CORS is configured for `http://localhost:5175`
- Update `app.js` if using different frontend URL

## Development

- Backend: `npm run dev` (with auto-restart)
- Frontend: `npm run dev` (with hot reload)
- Database reset: `npm run db:reset`

## Production Deployment

1. Set environment variables for production
2. Build frontend: `npm run build`
3. Use a process manager like PM2 for the backend
4. Configure reverse proxy (nginx) if needed

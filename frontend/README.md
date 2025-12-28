# Billing System Frontend

React application built with Material UI, Redux Toolkit, and React Router.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material UI (MUI)** - Component library
- **Redux Toolkit** - State management with Thunk middleware
- **React Router** - Routing
- **Axios** - HTTP client

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/     # Reusable components
│   │   ├── layout/     # Layout components (Header, Sidebar, Footer)
│   │   └── common/     # Common components (LoadingSpinner, ErrorBoundary)
│   ├── pages/          # Page components
│   ├── store/          # Redux store configuration
│   │   ├── slices/     # Redux slices
│   │   └── thunks/     # Async thunks
│   ├── services/       # API services
│   ├── theme/          # Material UI theme configuration
│   ├── utils/          # Utility functions and constants
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your API base URL:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview

Preview the production build:
```bash
npm run preview
```

## Features

- ✅ Material UI theme configuration
- ✅ Redux store with Thunk middleware
- ✅ React Router setup
- ✅ API service with Axios
- ✅ Responsive layout with sidebar navigation
- ✅ Error boundary for error handling
- ✅ Loading spinner component
- ✅ Environment variable configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:8080/api`)

## Next Steps

1. Add authentication flow
2. Implement API integrations
3. Create feature-specific pages and components
4. Add form validation
5. Implement error handling and notifications
6. Add unit tests

## License

Private project

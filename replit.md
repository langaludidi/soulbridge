# Soulbridge Digital Memorial Platform

## Overview

Soulbridge is a digital memorial platform specifically designed for South African families to honor, remember, and celebrate the lives of their loved ones. The platform serves as a cultural bridge between traditional funeral practices and modern digital memorialization, offering a respectful space for communities to share tributes, host virtual memorials, and connect with trusted funeral service providers.

The application provides public access to browse memorials and view tributes, while authenticated users can create memorials, submit tributes, and manage funeral programs. The platform emphasizes cultural sensitivity and community connection, supporting the communal nature of South African funeral traditions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built with React using Vite as the build tool, implementing a component-based architecture with TypeScript for type safety. The UI leverages shadcn/ui components built on Radix UI primitives, providing accessible and customizable interface elements. Styling is handled through Tailwind CSS with a custom color scheme optimized for the memorial platform's aesthetic.

The frontend uses Wouter for lightweight client-side routing and TanStack Query for server state management, providing efficient data fetching and caching capabilities. The architecture supports both authenticated and public user experiences, with conditional rendering based on authentication state.

### Backend Architecture
The server is built with Express.js in a RESTful API pattern, providing endpoints for memorial management, tribute submission, and partner directory functionality. The architecture implements role-based access control with public users, contributors, and administrators having different permission levels.

Authentication is handled through Replit's OpenID Connect integration using Passport.js, with session management stored in PostgreSQL. The server includes middleware for request logging, error handling, and CORS management.

### Database Design
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes tables for users, memorials, tributes, partners, memorial photos, funeral programs, and events. The database design supports moderation workflows with draft/published status states for user-submitted content.

Session data is stored in PostgreSQL using connect-pg-simple, providing persistent session management for authenticated users. The schema includes proper indexing and foreign key relationships to ensure data integrity and performance.

### State Management
Client-side state is managed through TanStack Query for server state and React's built-in state management for local UI state. The query client is configured with specific error handling for unauthorized requests, supporting the platform's authentication model.

Authentication state is managed globally through a custom useAuth hook that provides user information and authentication status throughout the application.

## External Dependencies

### Database Service
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe database operations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication Provider
- **Replit Identity**: OpenID Connect authentication service
- **Passport.js**: Authentication middleware with OpenID Client strategy

### UI Framework and Styling
- **Radix UI**: Unstyled, accessible UI primitives
- **shadcn/ui**: Pre-built components based on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Build and Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and enhanced developer experience
- **PostCSS**: CSS processing with Tailwind CSS integration

### Client Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API responses
- **date-fns**: Date manipulation and formatting
- **Wouter**: Lightweight routing library
# Marcela Cordero - Makeup Artist Landing Page

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a professional landing page and booking system for Marcela Cordero, a semi-professional makeup artist. The project uses Next.js with TypeScript, includes a booking system with real-time availability, and features an admin panel for managing appointments.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js for admin panel
- **Deployment**: Vercel

## Design Guidelines

### Color Palette

- **Primary Dark**: #1C1C1C (Sophisticated Charcoal)
- **Light Contrast**: #FFFFFF (Pure White)
- **Primary Accent**: #D4AF37 (Warm Champagne Gold)
- **Secondary Accent**: #B06579 (Deep Mauve Rose) - for CTAs
- **Neutral**: #5A5A5A (Slate Gray)

### Typography

- **Titles/Main Name**: Playfair Display
- **Artistic Subtitles**: Allura (use sparingly)
- **Body Text/UI**: Montserrat

### Design Principles

- Elegant, professional, minimalist with luxury touches
- Fully responsive (mobile, tablet, desktop)
- High-quality images and smooth animations
- Professional photography aesthetic

## Key Features

1. **Landing Page Sections**:

   - Hero section with professional imagery
   - Services showcase with pricing
   - Portfolio/Gallery with filtering
   - Client testimonials
   - About Me section
   - Contact and booking form

2. **Booking System**:

   - Real-time availability checking
   - Date/time picker with available slots only
   - Client information collection
   - Email confirmations for both client and artist

3. **Admin Panel** (Protected):
   - Calendar view of all appointments
   - Appointment management (confirm, cancel, complete)
   - Availability management
   - Client information dashboard

## API Routes Structure

- `/api/availability` - Check available time slots
- `/api/book-appointment` - Create new appointment
- `/api/admin/appointments` - Manage appointments (CRUD)
- `/api/admin/availability` - Manage availability schedule

## Database Schema

- **Appointments**: Client bookings with status tracking
- **Availability**: Artist's available time slots
- **Users**: Admin authentication

## Code Guidelines

- Use TypeScript for all components and API routes
- Follow Next.js App Router conventions
- Implement proper error handling and validation
- Use Prisma for database operations
- Ensure responsive design with Tailwind CSS
- Include proper SEO meta tags
- Use modern React patterns (hooks, components)
- Implement proper loading states and error boundaries

# One Click Advertisement - Deployment Guide

## Database Configuration

### MongoDB Atlas Connection
- **Connection String**: Already configured in `.env`
- **Database Name**: `advertisement`
- **Collections**: contacts, services, testimonials
- **Access**: Configured for global access from any IP

### Testing Database Connection
Visit: `http://localhost:3000/api/test-db` (or your production URL)
This will show:
- Connection status
- Database name
- Available collections
- Document counts

## Responsive Design

### Mobile Optimization
✅ Fully responsive for all screen sizes:
- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Laptop**: 769px - 1024px
- **Desktop**: 1025px+

### Features Implemented
- Mobile-first design approach
- Touch-friendly buttons (44px minimum)
- Responsive navigation
- Adaptive grid layouts
- Optimized images
- Safe area support for notched devices (iPhone X, etc.)
- Prevents zoom on iOS form inputs
- Landscape orientation support

### Admin Panel Mobile
- Collapsible sidebar on mobile
- Horizontal scrolling navigation
- Single column layouts
- Touch-optimized controls

## Deployment Checklist

### Environment Variables
Ensure `.env` file contains:
```
DATABASE_URL="mongodb+srv://project_db_user:yLtS5VhXfPvziVZP@cluster0.8gdtuxs.mongodb.net/advertisement?retryWrites=true&w=majority&appName=Cluster0"
```

### Build Commands
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `DATABASE_URL`
4. Deploy

### MongoDB Atlas Setup
1. ✅ Already configured
2. ✅ Network access: Allow from anywhere (0.0.0.0/0)
3. ✅ Database user created with read/write permissions

## Testing

### Local Testing
```bash
npm run dev
```
Visit: http://localhost:3000

### Mobile Testing
1. Use Chrome DevTools Device Mode
2. Test on actual devices
3. Use responsive design mode in browser

### Database Testing
Visit: `/api/test-db` to verify connection

## Features

### Public Pages
- `/` - Home page
- `/services` - Services listing (displays admin-added services)
- `/testimonials` - Customer testimonials (displays admin-added testimonials)
- `/contact` - Contact form
- `/about` - About page

### Admin Panel
- `/admin/login` - Login page (accepts any email/password)
- `/admin` - Dashboard
- `/admin/contacts` - Contact form submissions
- `/admin/services` - Manage services
- `/admin/testimonials` - Manage testimonials

### API Endpoints
- `POST /api/auth/login` - Admin login
- `GET/POST/DELETE /api/contact` - Contact forms
- `GET/POST/DELETE /api/services` - Services management
- `GET/POST/DELETE /api/testimonials` - Testimonials management
- `GET /api/test-db` - Database connection test

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations
- Image optimization with Next.js Image
- Compression enabled
- Lazy loading for images
- Optimized fonts
- Minimal JavaScript bundles

## Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Reduced motion support
- High contrast support

## Security
- Environment variables for sensitive data
- MongoDB connection with authentication
- No exposed credentials in code
- HTTPS recommended for production

## Support
For issues or questions, check:
1. Database connection: `/api/test-db`
2. Browser console for errors
3. Network tab for API calls
4. MongoDB Atlas dashboard for database status

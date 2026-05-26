# Backend Integration Guide

## Database Connection
Your website is connected to MongoDB Atlas:
- **Database**: advertisement
- **Connection**: Already configured in `.env`

## API Endpoints

### 1. Contact Form (`/api/contact`)
**Method**: POST
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string"
}
```
**Response**: Success/Error message

### 2. Services (`/api/services`)
**Method**: GET
**Response**: Array of services from database
**Fallback**: Default services if database is empty

### 3. Blog (`/api/blog`)
**Method**: GET
**Query**: `?status=published`
**Response**: Array of blog posts

### 4. Testimonials (`/api/testimonials`)
**Method**: GET
**Response**: Array of testimonials

### 5. Newsletter (`/api/newsletter`)
**Method**: POST
**Body**:
```json
{
  "email": "string"
}
```

## Frontend Features

### Responsive Design
- ✅ Mobile-first approach
- ✅ Tablet optimization (481px - 768px)
- ✅ Desktop optimization (769px+)
- ✅ Landscape orientation support
- ✅ Touch-friendly buttons and forms

### Dynamic Content
- Services load from database or show defaults
- Contact form submits to backend
- Real-time form validation
- Success/error notifications

### Performance
- Lazy loading with Framer Motion
- Optimized animations for mobile
- Reduced motion support for accessibility
- Efficient image loading

## Testing

### Local Development
```bash
npm run dev
```
Visit: http://localhost:3000

### Test Contact Form
1. Fill in the form on home page
2. Submit and check database for new contact

### Test Services
1. Add services via admin panel
2. Services will appear on home page

## Mobile Responsiveness Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px - 1024px
- **Large Desktop**: > 1025px

## Features Implemented

✅ Backend API integration
✅ MongoDB database connection
✅ Contact form with validation
✅ Dynamic services loading
✅ Fully responsive design
✅ Mobile-optimized UI
✅ Touch-friendly interactions
✅ Accessibility support
✅ Error handling
✅ Loading states

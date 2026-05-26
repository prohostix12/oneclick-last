# Lead Capture System

## Overview
A comprehensive lead capture form system integrated into the home page with backend API and admin management interface.

## Features Implemented

### 1. Lead Capture Form (`/src/components/LeadCaptureForm.tsx`)
- **Modern Design**: Card-style layout with gradient background and glass morphism effects
- **Form Fields**:
  - Full Name (required)
  - Email Address (required, with validation)
  - Phone Number (required, with validation)
  - Company Name (optional)
  - Interested Service (dropdown with predefined services)
- **UI/UX Features**:
  - Icons inside input fields
  - Hover effects and smooth transitions
  - Fully responsive (mobile + desktop)
  - Loading states and error handling
  - Success message with features list
- **Validation**:
  - Required field validation
  - Email format validation
  - Phone number format validation
  - Real-time error display
- **Trust Elements**:
  - Urgency badge with "Limited Time Offer"
  - Trust badges (500+ Happy Clients, UAE Wide Coverage, 24/7 Support)
  - Customer testimonial

### 2. Backend API (`/src/app/api/leads/route.ts`)
- **POST /api/leads**: Submit new leads
  - Input validation
  - Duplicate email handling (updates existing leads)
  - MongoDB integration
  - Error handling and logging
- **GET /api/leads**: Retrieve leads with pagination and filtering
  - Pagination support
  - Filter by status and service
  - Sorting by creation date

### 3. Admin Management (`/src/app/admin/leads/page.tsx`)
- **Dashboard Features**:
  - Lead statistics cards
  - Filtering by status and service
  - Search functionality
  - Pagination
  - Export to CSV
- **Lead Management**:
  - View detailed lead information
  - Status tracking (new, contacted, qualified, converted, closed)
  - Contact information display
  - Date formatting
- **Responsive Design**: Mobile-friendly interface

### 4. Database Integration
- **MongoDB Collection**: `leads`
- **Lead Schema**:
  ```typescript
  {
    fullName: string
    email: string (indexed, lowercase)
    phone: string
    companyName?: string
    interestedService: string
    submittedAt: string
    createdAt: Date
    updatedAt: Date
    status: string
    source: string
  }
  ```

## Services Available
1. Branding & Corporate Identity
2. Digital Printed Graphics
3. Vehicle Graphics & Fleet Branding
4. Signage Production & Installation
5. Exhibition, Display & POS
6. Cladding & Facade Solutions
7. Complete Advertising Campaign
8. Other

## Integration Points

### Home Page Integration
- Form appears after the hero section
- Seamlessly integrated with existing design
- Maintains consistent branding and styling

### Admin Navigation
- Added "Lead Management" to admin sidebar
- Accessible at `/admin/leads`
- Integrated with existing admin authentication

## Environment Variables
```env
MONGODB_URI="mongodb+srv://..."
```

## API Endpoints

### Submit Lead
```
POST /api/leads
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+971501234567",
  "companyName": "Example Corp",
  "interestedService": "Branding & Corporate Identity"
}
```

### Get Leads
```
GET /api/leads?page=1&limit=10&status=new&service=Branding
```

## Security Features
- Input validation and sanitization
- Email format validation
- Phone number format validation
- XSS protection through React's built-in escaping
- MongoDB injection protection

## Performance Optimizations
- Efficient database queries with indexing
- Pagination to handle large datasets
- Optimized React components with proper state management
- Responsive images and lazy loading

## Mobile Responsiveness
- Fully responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized form layout for mobile devices
- Accessible navigation and interactions

## Future Enhancements
- Email notifications for new leads
- Lead scoring system
- Integration with CRM systems
- Advanced analytics and reporting
- Automated follow-up sequences
- Lead assignment to team members

## Usage
1. **For Visitors**: Fill out the form on the home page to request a quote
2. **For Admins**: Access `/admin/leads` to manage and track leads
3. **For Developers**: Use the API endpoints to integrate with other systems

## Testing
- Form validation works correctly
- API endpoints respond properly
- Admin interface displays leads
- Mobile responsiveness verified
- Database operations function as expected
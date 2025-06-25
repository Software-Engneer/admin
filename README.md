# Admin Dashboard

A modern React-based admin dashboard for managing portfolio content.

## Features

- **Authentication System**: Secure login with demo credentials
- **Overview Dashboard**: Statistics and key metrics
- **Project Management**: Add, edit, and delete projects
- **Creative Works Management**: Manage creative portfolio items
- **Settings Panel**: Admin profile and system settings
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the admin directory:
   ```bash
   cd admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Demo Credentials

For testing purposes, use these demo credentials:

- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── AuthContext.js          # Authentication context
│   │   ├── Dashboard.js            # Main dashboard component
│   │   ├── Dashboard.module.css    # Dashboard styles
│   │   ├── LoginPage.js            # Login page component
│   │   └── LoginPage.module.css    # Login page styles
│   ├── App.js                      # Main app component
│   └── App.css                     # App styles
└── package.json
```

## Features Overview

### Dashboard Sections

1. **Overview**: Displays key statistics and metrics
2. **Projects**: Manage portfolio projects with CRUD operations
3. **Creative Works**: Manage creative portfolio items
4. **Settings**: Admin profile and system configuration

### Authentication

- Simple authentication system with demo credentials
- Session management
- Protected routes

### Responsive Design

- Mobile-first approach
- Responsive navigation
- Adaptive layouts for different screen sizes

## Customization

### Adding New Sections

1. Create a new render function in `Dashboard.js`
2. Add the section to the navigation
3. Update the `renderContent` function
4. Add corresponding CSS styles

### Styling

The dashboard uses CSS Modules for styling. Each component has its own `.module.css` file for scoped styling.

### API Integration

To integrate with a real backend API:

1. Update the `AuthContext.js` to make API calls
2. Replace mock data in dashboard sections with API calls
3. Add proper error handling and loading states

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (one-way operation)

## Technologies Used

- React 19
- CSS Modules
- Context API for state management
- Modern JavaScript (ES6+)

## Future Enhancements

- Real API integration
- File upload functionality
- Advanced analytics
- User management
- Role-based access control
- Dark mode theme
- Real-time notifications

# Collaro Customer Dashboard - Software Engineering Intern Assignment

![Dashboard Screenshot](https://screenshot.png) <!-- Replace with actual screenshot URL -->

##  Table of Contents
- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Structure](#-structure)
- [API](#-api)
- [Design](#-design)
- [Implementation](#-implementation)
- [State](#-state)
- [Errors](#-errors)
- [Performance](#-performance)
- [Roadmap](#-roadmap)
- [License](#-license)

##  Features
### Customer Data Table
✔ Expandable rows with order history  
✔ Server-side pagination (10 items/page)  
✔ Sort by: Name, Email, Revenue, Orders  
✔ Real-time search by name/email  

### Inline Editing
✔ Toggle customer status (active/churned/prospect)  
✔ Modify clothing measurements (chest/waist/hips)  

### Responsive UI
✔ Mobile-friendly layout  
✔ Consistent MUI components  
✔ Loading skeletons  

### Mock API
✔ Self-contained fake data  
✔ Dynamic generation with faker.js  

##  Technologies
**Frontend**:  
• Next.js 13  
• React 18  
• Material-UI 5  
• date-fns  

**Backend**:  
• Next.js API routes  

**Tooling**:  
• npm  
• Faker.js  
• ESLint  

##  Installation
1. Clone repo:
```bash
git clone https://github.com/yourusername/collaro-dashboard.git
cd collaro-dashboard


##  Install packages

npm install

## Start dev server

npm run dev

Access at: http://localhost:3000

## Structure

.
├── components/
│   ├── CustomerTable.js
│   ├── CustomerRow.js
│   └── OrderItem.js
├── pages/
│   ├── api/
│   │   ├── customers/
│   │   │   └── [id]/orders.js
│   │   └── customers.js
│   └── index.js
├── lib/
│   └── mockData.js
└── public/

## API

GET /api/customers

{
  page: 1,       // Current page
  limit: 10,     // Items per page
  sortBy: 'name', // Field to sort
  order: 'asc',   // Sort direction
  search: ''      // Filter term
}

Response:

{
  "data": [{
    "id": "cus_1",
    "name": "John Doe",
    "email": "john@doe.com",
    "status": "active",
    "orderCount": 3,
    "revenue": 499.99
  }],
  "total": 100
}

GET /api/customers/:id/orders
Response:

{
  "data": [{
    "id": "ord_1",
    "date": "2023-07-15",
    "items": [{
      "product": "Shirt",
      "measurements": {
        "chest": 42,
        "waist": 34
      }
    }]
  }]
}

Design
Components:

Filterable data table

Expandable customer cards

Inline edit forms

States:

Loading shimmer

Empty state

Error alerts

Theming:

Custom MUI palette

Responsive breakpoints

Consistent spacing
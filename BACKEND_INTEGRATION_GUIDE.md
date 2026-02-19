## 🚜 Green Field Hub - Backend Integration Guide

### 📋 Overview
This guide explains the complete backend integration for tractor registration with email confirmations and rental management.

---

## ✨ New Features Implemented

### 1. **Tractor Registration with Email Confirmation**
- Users can register tractors with email, horsepower, and fuel type
- Automatic confirmation email sent to owner upon registration
- Fields validated on both frontend and backend

### 2. **Rental Confirmation with Dual Email System**
- When a tractor is rented, confirmation emails sent to both renter and owner
- Owner receives renter details (name, email, phone)
- Renter receives owner contact information and booking details

### 3. **Enhanced Tractor Model**
- New fields: `email`, `horsepower`, `fuelType`
- Email is unique and required
- All data persisted in MongoDB

---

## 🔧 Backend API Endpoints

### **POST /api/tractors/register**
Register a new tractor with email confirmation

**Request Body:**
```json
{
  "ownerName": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "+91 98765 43210",
  "location": "Punjab, Ludhiana",
  "model": "Mahindra 575 DI",
  "tractorNumber": "PB-10-AB-1234",
  "horsepower": 47,
  "fuelType": "Diesel",
  "rentPerHour": 500,
  "rentPerDay": 3500,
  "isAvailable": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Tractor registered successfully! Confirmation email sent.",
  "data": {
    "_id": "...",
    "ownerName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    ...
  }
}
```

**Error Handling:**
- Duplicate email: `400 - Email already registered`
- Duplicate tractor number: `400 - Tractor number already exists`
- Missing fields: `400 - [Field] is required`

---

### **GET /api/tractors**
Get all registered tractors

**Response:**
```json
[
  {
    "_id": "...",
    "ownerName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "model": "Mahindra 575 DI",
    "horsepower": 47,
    "fuelType": "Diesel",
    ...
  }
]
```

---

### **GET /api/tractors/:id**
Get a single tractor by ID

**Response:**
```json
{
  "_id": "...",
  "ownerName": "Rajesh Kumar",
  "email": "rajesh@example.com",
  ...
}
```

---

### **POST /api/tractors/confirm-rental**
Confirm rental and send emails to both parties

**Request Body:**
```json
{
  "tractorId": "507f1f77bcf86cd799439011",
  "renterEmail": "farmer@example.com",
  "renterName": "Suresh Patel",
  "startDate": "2025-02-15",
  "rentalType": "daily",
  "duration": 3,
  "totalCost": 10500
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Rental confirmed! Confirmation emails sent to both parties."
}
```

---

## 📧 Email Templates

### **Registration Confirmation Email**
Sent to owner when tractor is registered

**Subject:** Tractor Registration Successful! 🎉

**Contains:**
- Owner name greeting
- Registered tractor details (Model, Number, HP, Fuel Type)
- Instructions to manage rental
- Support contact information

### **Rental Confirmation Email (Renter)**
Sent to renter when rental is confirmed

**Subject:** Rental Confirmed! 🎉

**Contains:**
- Tractor details
- Booking information (dates, duration, cost)
- Owner contact details (name, phone, email)
- Instructions for pickup

### **Rental Confirmation Email (Owner)**
Sent to owner when someone books their tractor

**Subject:** New Rental Request! 📬

**Contains:**
- Renter information (name, email)
- Booking details (dates, duration, expected revenue)
- Call to action for coordination

---

## 🛠️ Frontend Integration

### **TractorRegistration Component Changes**
- Added email input field with validation
- Added horsepower number input field
- Added fuel type dropdown (Diesel, Petrol, Bio-Diesel)
- Updated form submission to POST to backend
- Email sent automatically on successful registration

### **Form Validation Rules**
```typescript
- ownerName: Required, non-empty
- email: Required, valid email format
- phone: Required, 10+ digits
- location: Required, non-empty
- model: Required, non-empty
- tractorNumber: Required, non-empty
- horsepower: Required, > 0
- fuelType: Required, one of (Diesel, Petrol, Bio-Diesel)
- rentPerHour: Required, > 0
- rentPerDay: Required, > 0
```

### **RentTractor Component Changes**
- Updated rental confirmation to call backend
- Sends renter and tractor information
- Handles API responses and errors
- Shows success/error toast notifications

### **TractorCard Component Updates**
- Displays horsepower and fuel type from tractor data
- Supports both mock data and database data

---

## 🚀 Setup Instructions

### **Prerequisites**
```bash
Node.js v14+
MongoDB (Atlas or local)
npm or yarn
```

### **Backend Setup**

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tractorDB
PORT=5000
NODE_ENV=development
```

3. **Start the server:**
```bash
npm start
```

Server will run on `http://localhost:5000`

### **Frontend Setup**

1. **Install dependencies:**
```bash
npm install
```

2. **Update API endpoints (if needed):**
- Check `TractorRegistration.tsx` for registration endpoint
- Check `RentTractor.tsx` for confirmation endpoint
- Update `http://localhost:5000` if using different port

3. **Start the dev server:**
```bash
npm run dev
```

---

## 📝 Database Schema

### **Tractor Collection**
```javascript
{
  _id: ObjectId,
  ownerName: String (required),
  email: String (required, unique),
  phone: String (required),
  location: String (required),
  model: String (required),
  tractorNumber: String (required, unique),
  horsepower: Number (required),
  fuelType: String (enum: ['Diesel', 'Petrol', 'Bio-Diesel']),
  rentPerHour: Number (required),
  rentPerDay: Number (required),
  isAvailable: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Considerations

### **Current Implementation (Mock)**
- Emails logged to console for development
- No actual SMTP configured

### **Production Implementation**
To send actual emails, integrate Nodemailer:

```javascript
// Example: Install nodemailer
npm install nodemailer

// Example configuration
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: recipientEmail,
  subject: 'Subject',
  html: htmlContent
});
```

### **Additional Security Measures**
- Email validation on both frontend and backend
- Duplicate email/tractor number checks
- Rate limiting (recommended)
- Input sanitization (recommended)
- CORS configuration (already implemented)

---

## 🧪 Testing

### **Test Registration**
1. Open `/register` page
2. Fill all fields including email, HP, and fuel type
3. Submit form
4. Check backend console for email logs
5. Verify success toast notification

### **Test Rental Confirmation**
1. Select a tractor and click "Rent Now"
2. Fill rental details
3. Click "Confirm Rental"
4. Check backend console for both owner and renter emails
5. Verify success toast notification

---

## 📂 File Structure
```
backend/
├── models/
│   └── Tractor.js (updated)
├── routes/
│   └── tractorRoutes.js (updated)
├── utils/
│   └── emailService.js (new)
├── server.js
└── package.json

src/
├── pages/
│   ├── TractorRegistration.tsx (updated)
│   └── RentTractor.tsx (updated)
├── components/
│   └── tractors/
│       └── TractorCard.tsx (updated)
└── data/
    └── mockData.ts
```

---

## 🐛 Troubleshooting

### **"Email already registered" error**
- The email is already in use
- Try with a different email address
- Check MongoDB for existing records

### **"Tractor number already exists" error**
- The tractor registration number is duplicate
- Use a unique registration number

### **API not responding**
- Ensure backend is running on port 5000
- Check network in browser DevTools
- Verify MongoDB connection string

### **Emails not sending (Production)**
- Configure real SMTP credentials
- Update `emailService.js` with Nodemailer
- Test SMTP credentials separately

---

## 🎯 Next Steps

1. **Implement Nodemailer Integration** for production emails
2. **Add User Authentication** to link tractors to registered users
3. **Create Rental Booking Model** to persist rental records
4. **Add Payment Integration** for rental payments
5. **Implement Notifications Dashboard** for owners
6. **Add Email Templates Database** for customizable emails

---

## 📞 Support
For issues or questions about the integration, refer to:
- Backend logs in terminal
- Browser DevTools console
- MongoDB Atlas dashboard for data verification

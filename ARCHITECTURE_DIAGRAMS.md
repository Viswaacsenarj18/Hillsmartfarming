# 🏗️ System Architecture & Data Flow Diagrams

## 📊 Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GREEN FIELD HUB SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

                          FRONTEND (React)
    ┌─────────────────────────────────────────────────────────┐
    │                                                           │
    │  Pages:                Components:           Data:        │
    │  - Dashboard         - TractorCard         - mockData    │
    │  - TractorListing    - TractorForm         - useState    │
    │  - Registration      - NavBar              - useEffect   │
    │  - RentTractor       - Layout              - hooks       │
    │                                                           │
    └────────────────┬────────────────────────────────────────┘
                     │
              HTTP/REST API
                     │
    ┌────────────────▼────────────────────────────────────────┐
    │              BACKEND (Node.js/Express)                   │
    │                                                           │
    │  Routes:                                                  │
    │  - POST /api/tractors/register                           │
    │  - GET /api/tractors                                     │
    │  - GET /api/tractors/:id                                │
    │  - POST /api/tractors/confirm-rental                    │
    │                                                           │
    │  Services:                                                │
    │  - emailService.js                                       │
    │  - Validation middleware                                 │
    │                                                           │
    └────────────────┬────────────────────────────────────────┘
                     │
           Mongoose ODM + Driver
                     │
    ┌────────────────▼────────────────────────────────────────┐
    │              DATABASE (MongoDB Atlas)                     │
    │                                                           │
    │  Collections:                                             │
    │  - tractors                                              │
    │    ├── ownerName                                         │
    │    ├── email (unique)                                   │
    │    ├── horsepower                                        │
    │    ├── fuelType                                          │
    │    └── ...other fields                                  │
    │                                                           │
    └─────────────────────────────────────────────────────────┘
```

---

## 🔄 Registration Flow Diagram

```
USER REGISTERS TRACTOR
        │
        ▼
┌───────────────────────────────┐
│ TractorRegistration Component │
│  - Collect: name, email,      │
│    phone, location, model,    │
│    number, HP, fuel type,     │
│    hourly rate, daily rate    │
└───────────────────┬───────────┘
                    │
                    ▼ (onClick)
        ┌───────────────────────┐
        │ Validate Form Fields  │
        └───────────┬───────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
    Valid              Errors Found
     │                     │
     │              Show error toast
     │              Highlight fields
     │                     │
     └──────────┬──────────┘
                ▼
         ┌──────────────────────────────┐
         │ POST /api/tractors/register  │
         │ {ownerName, email, phone,    │
         │  location, model, number,    │
         │  horsepower, fuelType, ...}  │
         └────────────┬─────────────────┘
                      │
         ┌────────────▼────────────┐
         │ Backend Processing:     │
         │ 1. Validate input       │
         │ 2. Check unique email   │
         │ 3. Check unique number  │
         │ 4. Save to MongoDB      │
         │ 5. Send email           │
         └────────────┬────────────┘
                      │
         ┌────────────▼─────────────────┐
         │ sendRegistrationEmail()      │
         │                              │
         │ Generate HTML template       │
         │ Log to console (mock)        │
         │ Return success               │
         └────────────┬─────────────────┘
                      │
         ┌────────────▼────────────┐
         │ Response to Frontend:   │
         │ { success: true,        │
         │   message: "...",       │
         │   data: {...} }         │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │ Show Success Toast      │
         │ "Tractor registered!" │
         └────────────┬────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │ Redirect to /tractors │
         │ Show in listing       │
         └──────────────────────┘

BACKEND CONSOLE OUTPUT:
📧 Registration Email sent to: owner@example.com
Subject: Tractor Registration Successful
```

---

## 🚗 Rental Confirmation Flow Diagram

```
USER RENTS TRACTOR
        │
        ▼
┌─────────────────────────────────┐
│ RentTractor Component           │
│ - Select tractor                │
│ - Choose rental type & duration │
│ - Pick start date               │
│ - See total cost                │
└──────────────────┬──────────────┘
                   │
                   ▼ (Confirm Rental)
        ┌──────────────────────────┐
        │ Validate Input           │
        │ - Start date selected?   │
        └──────────────┬───────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
        Valid              Errors Found
         │                     │
         │              Show error toast
         │                     │
         └──────────┬──────────┘
                    ▼
    ┌───────────────────────────────────────┐
    │ POST /api/tractors/confirm-rental     │
    │ {tractorId, renterEmail,              │
    │  renterName, startDate, rentalType,   │
    │  duration, totalCost}                 │
    └────────────┬────────────────────────┘
                 │
    ┌────────────▼────────────────────┐
    │ Backend Processing:             │
    │ 1. Find tractor by ID           │
    │ 2. Validate tractor exists      │
    │ 3. Send dual emails             │
    │ 4. Return success response      │
    └────────────┬────────────────────┘
                 │
    ┌────────────▼────────────────────────────────────┐
    │ sendRentalConfirmationEmail()                    │
    │                                                  │
    │ Email 1 (Renter):                               │
    │ - Tractor details                               │
    │ - Booking dates & duration                      │
    │ - Owner contact info                            │
    │ - Total cost                                    │
    │                                                  │
    │ Email 2 (Owner):                                │
    │ - Renter details                                │
    │ - Booking dates & duration                      │
    │ - Expected revenue                              │
    └────────────┬────────────────────────────────────┘
                 │
    ┌────────────▼────────────────────────┐
    │ Response to Frontend:                │
    │ { success: true,                     │
    │   message: "Emails sent..." }        │
    └────────────┬────────────────────────┘
                 │
    ┌────────────▼──────────────────┐
    │ Show Success Toast             │
    │ "Confirmation emails sent!"    │
    └────────────┬──────────────────┘
                 │
                 ▼
    ┌──────────────────────┐
    │ Redirect to /tractors │
    └──────────────────────┘

BACKEND CONSOLE OUTPUT (Two Emails):
📧 Renter Email sent to: farmer@example.com
📧 Owner Email sent to: owner@example.com
Rental Confirmation Details sent to both parties
```

---

## 📱 Component Communication Diagram

```
┌─────────────────────────────────────────────────────┐
│               APP.TSX (Routes)                       │
└──────────────────┬──────────────────────────────────┘
                   │
         ┌─────────┼─────────┬──────────────┐
         │         │         │              │
         ▼         ▼         ▼              ▼
    Dashboard  Listing  Register      RentTractor
        │         │         │              │
        │         │    [FORM HERE]         │
        │         │         │              │
        │    ┌────┴────┐    │              │
        │    │          │    │              │
        │    ▼          ▼    │              │
        │  TractorCard  Filter/Search       │
        │              │              
        │              ▼
        │         [API CALLS]
        │              │
        │              ▼
        │         Backend API
        │              │
        │    ┌─────────┼─────────┐
        │    │         │         │
        │    ▼         ▼         ▼
        │ Register  GetAll  Confirm
        │   │        │       │
        │   └────────┼───────┘
        │            │
        │            ▼
        │         MongoDB
        │            │
        │            ▼
        │       Response
        │            │
        └────────────┼────────────┐
                     │            │
                     ▼            ▼
                  Toast       Update UI
              Notification
```

---

## 🗂️ Database Schema Relationship

```
TRACTORS COLLECTION
├── _id (ObjectId)
├── ownerName (String)
├── email (String, unique) ← REQUIRED NEW FIELD
├── phone (String)
├── location (String)
├── model (String)
├── tractorNumber (String, unique)
├── horsepower (Number) ← REQUIRED NEW FIELD
├── fuelType (String) ← REQUIRED NEW FIELD
│   └── Enum: ["Diesel", "Petrol", "Bio-Diesel"]
├── rentPerHour (Number)
├── rentPerDay (Number)
├── isAvailable (Boolean)
├── createdAt (Date)
└── updatedAt (Date)

Future Collections (Optional):
├── USERS
│   ├── _id
│   ├── email (unique)
│   ├── password (hashed)
│   ├── name
│   └── role
│
├── RENTALS
│   ├── _id
│   ├── tractorId (ref)
│   ├── renterId (ref)
│   ├── startDate
│   ├── endDate
│   ├── rentalType
│   ├── totalCost
│   └── status
│
└── PAYMENTS
    ├── _id
    ├── rentalId (ref)
    ├── amount
    ├── status
    └── timestamp
```

---

## 🔌 API Request/Response Examples

### **Register Tractor**
```
REQUEST:
POST /api/tractors/register
Headers: Content-Type: application/json

{
  "ownerName": "Rajesh Kumar",
  "email": "rajesh@example.com",      ← NEW
  "phone": "+91 98765 43210",
  "location": "Punjab, Ludhiana",
  "model": "Mahindra 575 DI",
  "tractorNumber": "PB-10-AB-1234",
  "horsepower": 47,                    ← NEW
  "fuelType": "Diesel",                ← NEW
  "rentPerHour": 500,
  "rentPerDay": 3500,
  "isAvailable": true
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Tractor registered successfully! Confirmation email sent.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "ownerName": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "horsepower": 47,
    "fuelType": "Diesel",
    ...other fields...
  }
}

RESPONSE (400 Bad Request):
{
  "success": false,
  "message": "Email already registered"
}
```

### **Confirm Rental**
```
REQUEST:
POST /api/tractors/confirm-rental
Headers: Content-Type: application/json

{
  "tractorId": "507f1f77bcf86cd799439011",
  "renterEmail": "farmer@example.com",
  "renterName": "Suresh Patel",
  "startDate": "2025-02-15",
  "rentalType": "daily",
  "duration": 3,
  "totalCost": 10500
}

RESPONSE (200 OK):
{
  "success": true,
  "message": "Rental confirmed! Confirmation emails sent to both parties."
}

RESPONSE (404 Not Found):
{
  "success": false,
  "message": "Tractor not found"
}
```

---

## 📧 Email Template Structure

```
REGISTRATION EMAIL
├── Header: "Tractor Registration Successful! 🎉"
├── Greeting: "Hello {ownerName},"
├── Body Message
├── Details Table:
│   ├── Model: {model}
│   ├── Tractor Number: {tractorNumber}
│   ├── Horsepower: {horsepower} HP
│   └── Fuel Type: {fuelType}
├── Next Steps
├── Footer: Support contact info
└── Unsubscribe link

RENTAL CONFIRMATION EMAIL (Renter)
├── Header: "Rental Confirmed! 🎉"
├── Booking Details Table:
│   ├── Tractor Model: {model}
│   ├── Tractor Number: {tractorNumber}
│   ├── Start Date: {startDate}
│   ├── Duration: {duration} days
│   └── Total Cost: ₹{totalCost}
├── Owner Contact Box:
│   ├── Name: {ownerName}
│   ├── Phone: {ownerPhone}
│   └── Email: {ownerEmail}
└── Action: Contact owner for pickup

RENTAL CONFIRMATION EMAIL (Owner)
├── Header: "New Rental Request! 📬"
├── Renter Details Table:
│   ├── Renter Name: {renterName}
│   ├── Renter Email: {renterEmail}
│   ├── Tractor Model: {model}
│   ├── Start Date: {startDate}
│   ├── Duration: {duration} days
│   └── Expected Revenue: ₹{totalCost}
└── Action: Contact renter for coordination
```

---

## 🔐 Validation Flow

```
INPUT FROM USER
        │
        ▼
┌──────────────────────────────────┐
│   FRONTEND VALIDATION            │
│   (TractorRegistration.tsx)      │
│                                  │
│   ✓ Email format valid          │
│   ✓ Phone 10+ digits            │
│   ✓ Horsepower > 0              │
│   ✓ All required fields filled  │
└─────────────┬────────────────────┘
              │
   ┌──────────┴──────────┐
   │                     │
   ▼                     ▼
VALID               INVALID
 │                     │
 │              ┌──────────────┐
 │              │ Show Errors  │
 │              │ Highlight    │
 │              │ Toast Msg    │
 │              └──────────────┘
 │
 ▼
SEND TO BACKEND
 │
 ▼
┌──────────────────────────────────┐
│   BACKEND VALIDATION             │
│   (tractorRoutes.js)             │
│                                  │
│   ✓ Email not duplicate         │
│   ✓ Tractor# not duplicate      │
│   ✓ Required fields present     │
│   ✓ Data types correct          │
└─────────────┬────────────────────┘
              │
   ┌──────────┴──────────┐
   │                     │
   ▼                     ▼
VALID               INVALID
 │                     │
 │            ┌────────────────┐
 │            │ 400 Error      │
 │            │ Response       │
 │            └────────────────┘
 │
 ▼
SAVE TO DATABASE
 │
 ▼
SEND CONFIRMATION EMAIL
```

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────┐
│           CLIENT (Browser)               │
│       (React + Vite SPA)                 │
└──────────────┬──────────────────────────┘
               │
         HTTP/HTTPS
               │
┌──────────────▼──────────────────────────┐
│    CDN / Web Server (Nginx/Apache)       │
└──────────────┬──────────────────────────┘
               │
         HTTP API
               │
┌──────────────▼──────────────────────────┐
│   API Server (Node.js/Express)           │
│   (Could be: Heroku, Railway, Render)    │
└──────────────┬──────────────────────────┘
               │
         TCP/MongoDB Protocol
               │
┌──────────────▼──────────────────────────┐
│   MongoDB Atlas (Cloud Database)         │
│   (Managed MongoDB Service)              │
└──────────────────────────────────────────┘

Email Service (Future):
┌──────────────────────────────────────────┐
│   SMTP Server (Gmail/SendGrid/AWS SES)   │
│   Sending emails to users                │
└──────────────────────────────────────────┘
```

---

**Last Updated:** January 19, 2025
**Diagrams:** Architecture, Data Flow, Database Schema, Validation Flow

# ✈️ Booking Microservice - TravelEase

This is the **Booking microservice** for the [TravelEase](https://github.com/TravelEase-Xebia/TravelEase) platform.  
It allows users to **browse available flights, book their preferred flight**, and then redirects them to a separate **Payment microservice** for completing the transaction.

---

## 📦 Features

- Choose **departure location**, **destination**, and **date**.
- Save booking details to a **MongoDB Atlas database**.
- Fetch and display all existing bookings.
- Redirect to **Payment Microservice** after successful booking (integration-ready).

---

## 📝 Environment Variables

Create a `.env` file in the root of the service directory:
```
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>
```
---

## 📡 API Endpoints

| Method | Endpoint        | Description                  |
|:--------|:----------------|:------------------------------|
| `GET`   | `/api/searchflight` | Fetch all bookings             |
| `POST`  | `/api/payment` | Add a new booking (JSON body)  |

**Sample JSON body for booking:**
```json
{
  "departure": "Delhi",
  "destination": "Mumbai",
  "date": "2025-06-30"
}
```
## 🚀 Running the Service
1️⃣ Install dependencies
```
npm install
```
2️⃣ Start service locally
```
node server.js
```
The service will be running at:
```
http://localhost:port_number/
```
## 🐳 Run with Docker Compose
If you're using Docker Compose for orchestrating multiple services:
```
docker compose up -d
```

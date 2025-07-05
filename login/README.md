# Authentication Microservice - TravelEase

This is the Authentication microservice for the TravelEase platform.  
It handles user registration, login, and authentication, enabling secure access to the TravelEase ecosystem and its various microservices.

---

## Features

- User registration and login with secure password handling.
- JWT-based authentication for session management.
- Middleware for protecting API endpoints.
- Integration-ready for other TravelEase microservices.

---

## Environment Variables

Create a `.env` file in the root of the service directory:

```
PORT=5050
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>
JWT_SECRET=<YOUR_SECRET_KEY>s
```

---

## API Endpoints

| Method | Endpoint      | Description                      |
|:-------|:-------------|:----------------------------------|
| POST   | /api/register | Register a new user (JSON body)   |
| POST   | /api/login    | Login and receive JWT token       |
| GET    | /api/me       | Get authenticated user info       |

**Sample JSON body for registration/login:**

```json
{
  "username": "admin",
  "password": "admin"
}
```

---

## Running the Service

**Install dependencies**
```
npm install
```

**Start service locally**
```
node server.js
```

The service will be running at:  
http://localhost:5050/

---

## Run with Docker Compose

If you're using Docker Compose for orchestrating multiple services:
```
docker compose up -d
```

---

## GitHub

[GitHub - TravelEase-Xebia/TravelEase](https://github.com/TravelEase-Xebia/TravelEase)  
Contribute to TravelEase-Xebia/TravelEase development by creating an account on GitHub.

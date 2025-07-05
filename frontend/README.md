TravelEase Frontend ✈️
 
Welcome to the frontend of TravelEase – a modern, cloud-native travel booking platform focused on seamless user experience and performance. Built using React + Vite, 
this frontend offers fast loading, responsive design, and integration with backend microservices for flight booking, payments, and user authentication.

 🚀 Features 
 
User Authentication
Sign Up and Login functionality 
Secure session handling 
Search Flights 
Search based on source, destination, and date
Book Flights
Fill in passenger details and confirm bookings
 
 
⚙️ Tech Stack 

| Category       | Tech Used                 |
|----------------|---------------------------|
| Frontend       | React.js (with Vite)      |
| Styling        | Tailwind CSS              |
| Routing        | React Router DOM          |
| State Handling | React Context (or Hooks)  |
| Deployment     | Docker, AWS EKS           |


📁 Folder Structure
```
frontend/
├── public/ Static files
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Pages like Home, Login, Signup, Booking, Payment
│ ├── services/ # API services using Axios
│ ├── App.jsx # Root app with routes
│ ├── main.jsx # Vite entry point
│ └── styles/ # Global CSS (if any)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
```


Getting Started

1. Prerequisites
Make sure you have:
```
  Node.js >= 16.x
  npm >= 8.x
```

2. Installation

Clone the repo and install dependencies:
```
git clone https://github.com/TravelEase-Xebia/TravelEase.git
cd TravelEase/frontend
npm install
```

3. Running the App
   
Start the development server:
```
npm run dev
App will run at http://localhost:5173
```


🐳 Docker Support
To run the frontend using Docker:
```
docker build -t travelfare-frontend .
docker run -p 5173:5173 travelfare-frontend
```

test456789
testing 

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';
const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BOOKING_API_URL}/api/searchflights?departure=${encodeURIComponent(departure)}&destination=${encodeURIComponent(destination)}`
      );
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  const handleBook = (flight) => {
    const params = new URLSearchParams({
      departure: flight.departure,
      destination: flight.destination,
      date: date,
      flight: flight.flight
    });
    navigate(`/payment?${params.toString()}`);
  };

  return (
    <div className="flight-search-container">
      <h1>Find & Book a Flight</h1>

      {/* Flight Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          placeholder="Departure"
          required
        />
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Search Flights</button>
      </form>

      {/* Available Flights */}
      <h2>Available Flights</h2>
      <ul>
        {flights.length === 0 ? (
          <li>No flights found for this route.</li>
        ) : (
          flights.map((flight, index) => (
            <li key={index}>
              {flight.flight} — {flight.departure} ➝ {flight.destination} on {date}{" "}
              <button onClick={() => handleBook(flight)}>Book</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FlightSearch;

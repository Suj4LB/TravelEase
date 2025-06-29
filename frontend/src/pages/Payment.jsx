import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const departure = searchParams.get("departure");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");
  const flight = searchParams.get("flight");

  const flightPrice = 4500;

  const [tickets, setTickets] = useState(1);
  const [total, setTotal] = useState(flightPrice);

  useEffect(() => {
    setTotal(tickets * flightPrice);
  }, [tickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_PAYMENT_API_URL}/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          departure,
          destination,
          date,
          flight,
          tickets,
          total
        })
      });

      if (!res.ok) throw new Error("Booking failed");

      alert("Payment successful! Booking confirmed.");
      navigate("/flightsearch");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while processing payment.");
    }
  };

  return (
    <div className="payment-container">
      <h1>Complete Your Booking</h1>

      <div id="flightDetails">
        <p><strong>Flight:</strong> {flight}</p>
        <p><strong>Route:</strong> {departure} ➝ {destination}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Price per Ticket:</strong> ₹{flightPrice}</p>
      </div>

      <form id="paymentForm" onSubmit={handleSubmit}>
        <label>
          Number of Tickets:
          <input
            type="number"
            min="1"
            value={tickets}
            onChange={(e) => setTickets(parseInt(e.target.value))}
            required
          />
        </label>

        <p>Total Amount: ₹{total}</p>

        <button type="submit">Pay & Confirm</button>
      </form>
    </div>
  );
};

export default Payment;

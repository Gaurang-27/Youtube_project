import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const SubsBar = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get("/subs/subscribedto-list"); // Adjust endpoint as needed
        console.log(response)
        setSubscriptions(response.data.statusCode);
      } catch (err) {
        setError("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <nav className="subscription-bar p-4 bg-gray-600 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Subscribed Channels</h3>
      <ul>
        {subscriptions.map((channel) => (
          <li key={channel.user_id}>
            <NavLink 
              to={`/channel/${channel.user_id}`} 
              className={({ isActive }) => 
                isActive ? "text-blue-500 font-bold" : "text-gray-700"
              }
            >
              {channel.fullName}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SubsBar;

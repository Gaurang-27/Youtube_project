import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const SubscribeButton = ({ channel_id }) => {
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector((state)=> state.user.user || null)
    //console.log(user.user_id)

    useEffect(() => {
        // Check if the user is already subscribed
        const fetchSubscriptionStatus = async () => {
            try {
                const response = await axios.get(`/subs/checksubscribed/${channel_id}`);
                console.log(response.data.statusCode.subscribed)
                setSubscribed(response.data.statusCode.subscribed); // Assuming backend sends { subscribed: true/false }
            } catch (err) {
                console.error("Error checking subscription:", err);
            }
        };

        if(user!=null){
            fetchSubscriptionStatus();
        }
    }, [subscribed]);

    const handleSubscribe = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await axios.post(`/subs/subscribe/${channel_id}`);
            setSubscribed(result.data.statusCode.subscribed);
        } catch (err) {
            setError("Subscription failed. Try again.");
            console.error("Subscription error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleSubscribe} 
            disabled={loading || user==null ||channel_id===user.user_id}
            style={{
                padding: "10px 20px",
                backgroundColor: subscribed ? "gray" : "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading || user==null ||channel_id===user.user_id? "not-allowed" : "pointer",
                fontSize: "16px"
            }}
        >
            {loading ? "Processing..." : subscribed ? "Unsubscribe" : "Subscribe"}
        </button>
    );
};

export default SubscribeButton;

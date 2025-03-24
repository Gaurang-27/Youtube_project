import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

const SubscriberCard = () => {

    const user = useSelector((state) => state.user.user)
    const [subs, setSubs] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL_BACKEND}/subs/subscriber-list/${user.user_id}`);
                // Replace with actual API route
                setSubs(response.data.statusCode);
            } catch (err) {
                setError("Failed to load subscribers");
                console.error("Error fetching subscribers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, [user]);

    const handeclick = function(){
        console.log(subs)
        navigate(`/account-dashboard/subscriber-list`, {state : subs.subscribers})
    }

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-64 text-center border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700">Subscribers</h2>
            
            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p className="text-4xl font-bold text-blue-600 mt-2">{subs.subscribers.length}</p>
            )}

            <p className="text-gray-500">Total Subscribers</p>

            <button onClick={handeclick}>See subscribers</button>
        </div>
    );
};

export default SubscriberCard;

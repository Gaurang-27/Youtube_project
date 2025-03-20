import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubscribersPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const subscribers = location.state || []; // Retrieve subscribers list
    console.log(subscribers)

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Subscribers</h1>

            {subscribers.length === 0 ? (
                <p className="text-gray-600">No subscribers available.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md">
                    {subscribers.map((sub, index) => (
                        <div key={sub.user_id} className="flex items-center gap-4 border-b py-3">
                            <img
                                src={sub.avatar || "https://via.placeholder.com/50"}
                                alt={sub.fullName}
                                className="w-12 h-12 rounded-full border"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">{sub.fullName}</h3>
                                <p className="text-gray-500">@{sub.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                onClick={() => navigate(-1)}
            >
                Go Back
            </button>
        </div>
    );
};

export default SubscribersPage;

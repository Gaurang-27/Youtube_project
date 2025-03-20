import { useSelector } from "react-redux";

const UserPanelCard = () => {
    const user = useSelector((state) => state.user.user); // Get user data from Redux
    console.log(user)

    if (!user) return <p>User not logged in.</p>;

    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            width: "300px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center"
        }}>
            <img 
                src={user.avatar} 
                alt="User Avatar" 
                style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px"
                }} 
            />
            <h2>{user.username}</h2>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default UserPanelCard;

import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Logout from "../Usercontrols/Logout";
import { useSelector } from "react-redux";


function UserVideos(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [video, setvideo] =useState({});
    const navigate = useNavigate()

    const user = useSelector((state)=>state.user.user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/videos/userid/${user.user_id}`);
                //console.log(response.data)
                setData(response.data);
                setvideo(response.data.statusCode)
                //console.log(response.data.statusCode)
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const handleClick = function(element){
        navigate(`/${element.video_id}`, {state : element})
    }

    if(error) return <p>{error}</p>

    return(
        <div>
            <h2>Video Gallery</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {video.length > 0 ? (
                    video.map((element, index) => (
                            <img onClick={() =>{handleClick(element)}} 
                            src={element.thumbnail_url} 
                            alt={`Thumbnail ${index + 1}`} 
                            width="320" 
                            height="200" 
                            style={{ borderRadius: "10px", objectFit: "cover" }}
                        />
                    ))
                ) : (
                    <p>No videos available</p>
                )}
            </div>
        </div>
    )
}

export default UserVideos
import axios from "axios";
import { useState, useEffect } from "react";
import { NavLink} from "react-router-dom";
import Logout from "../Usercontrols/Logout";

function Getvideo(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [video, setvideo] =useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/videos");
                console.log(response.data)
                setData(response.data);
                setvideo(response.data.statusCode)
                console.log(response.data.statusCode)
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);


    // const [videoUrls, setVideoUrls] = useState([]); // Store extracted URLs

    // useEffect(() => {
    //     if (Array.isArray(video)) {
    //         const urls = video.map((element) => element.video_url); // Extract URLs
    //         setVideoUrls(urls); // Update state with URLs
    //     }
    // }, [video]); // Runs whenever `video` changes

    // useEffect(() => {
    //     console.log(videoUrls); // Check extracted URLs
    // }, [videoUrls]); // Log new URLs when updated
    if(error) return <p>{error}</p>

    return(
        <div>
            <Logout/>
            <h2>Video Gallery</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {video.length > 0 ? (
                    video.map((element, index) => (
                        <NavLink to={`/${element.video_id}`}>
                            <img  
                            src={element.thumbnail_url} 
                            alt={`Thumbnail ${index + 1}`} 
                            width="320" 
                            height="200" 
                            style={{ borderRadius: "10px", objectFit: "cover" }}
                        />
                        </NavLink>
                    ))
                ) : (
                    <p>No videos available</p>
                )}
            </div>
        </div>
    )
}

export default Getvideo
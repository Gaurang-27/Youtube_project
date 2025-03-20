import SubscriberCard from "./SubscriberCard";
import SubscribersPage from "./SubscribersPage";
import UserPanelCard from "./UserPanelCard";
import { Outlet } from "react-router-dom";
import UserVideos from "./UserVideos";
import UploadVideo from "./UploadVideo";

function Dashboard() {
    return (
        <>
            <h1>Welcome to Dashboard</h1>
            <UserPanelCard />
            <Outlet/>
            <UserVideos/>
            <UploadVideo/>
            </>
    );
}

export default Dashboard;

import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/navbar";
import { CursorFollower } from "../components/common/cursor-follower";

export function MainLayout() {
    return (
        <div className="main-layout min-h-screen bg-background text-foreground transition-colors duration-300">
            <CursorFollower />
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>


        </div>
    );
}

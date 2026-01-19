import { Outlet } from 'react-router';
import NavBar from './NavBar';


export default function Layout() {


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-800 font-sans">
            <NavBar />
            <main className="w-full flex justify-center">
                <Outlet />
            </main>
        </div>
    );
}
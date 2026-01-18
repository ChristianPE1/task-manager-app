import { Outlet } from 'react-router';
import NavBar from './NavBar';


export default function Layout() {


    return (
        <div className="min-h-screen flex flex-col items-center bg-slate-900">
            <NavBar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
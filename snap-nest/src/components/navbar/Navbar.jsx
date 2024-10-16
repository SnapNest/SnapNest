import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/authcontext/AuthContext';
import { logoutUser } from '../../firebase/auth';
import { auth } from '../../firebase/firebase-config';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser, userLoggedIn } = useAuth();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    const handleLogout = async () => {
        try {
            await logoutUser(auth);
            setCurrentUser(null);
            navigate('/');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <>
            <div className="navbar flex items-center bg-[#3d4e29] w-full border-b border-[#283618]">
                <div className="logo text-2xl ml-5">
                    SnapNest
                </div>
                <div className="flex-grow"></div>
                {userLoggedIn && (
                    <div className="dropdownbtn mr-5">
                        <div className="dropdown">
                            <div 
                                tabIndex={0} 
                                role="button" 
                                className="btn m-1 px-6 py-3 text-lg"
                                onClick={toggleDropdown}
                            >
                                User
                            </div>
                            {isDropdownOpen && (
                                <ul 
                                    tabIndex={0} 
                                    className="text-lg dropdown-content menu rounded-box border border-[#283618] bg-[#ece6ba] z-[1] w-full p-2 shadow"
                                >
                                    <button className="menu-item">Profile</button>
                                    <button onClick={handleLogout} className="menu-item">Logout</button>
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
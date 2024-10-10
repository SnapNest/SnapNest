import { useState } from 'react';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div className="navbar flex items-center bg-[#283618d8] fixed top-0 left-0 w-full border-b border-[#283618]">
                <div className="logo text-2xl ml-5">
                    SnapNest
                </div>
                <div className="flex-grow"></div>
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
                                <button className="menu-item">Logout</button>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
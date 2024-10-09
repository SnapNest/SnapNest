export default function Navbar() {
    return (
        <>
            <div className="navbar flex items-center bg-[#283618d8] fixed top-0 left-0 w-full border-b border-[#283618]">
                <div className="logo text-2xl ml-5">
                    SnapNest
                </div>
                <div className="flex-grow"></div>
                <div className="dropdownbtn mr-5">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn m-1 px-6 py-3 text-lg">User</div>
                        <ul tabIndex={0} className="text-lg dropdown-content menu rounded-box border border-[#283618] bg-[#ece6ba] z-[1] w-full p-2 shadow">
                            <li className="menu-item">Profile</li>
                            <li className="menu-item">Logout</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
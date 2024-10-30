import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/authcontext/AuthContext';
import { logoutUser } from '../../firebase/auth';
import { auth, database } from '../../firebase/firebase-config';
import { ref, get, query, orderByChild, startAt, endAt } from 'firebase/database';

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
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

    const fetchUsername = async () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = ref(database, `users/${user.uid}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUsername(userData.username || 'Anonymous');
                    setPhotoURL(userData.photoURL || '');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const postsRef = ref(database, 'posts');
            try {
                const snapshot = await get(postsRef);
                if (snapshot.exists()) {
                    const postsData = snapshot.val();
                    const postsArray = Object.keys(postsData).map(key => ({
                        id: key,
                        ...postsData[key]
                    }));

                    const filteredPosts = postsArray.filter(post =>
                        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        post.user.username.toLowerCase().includes(searchQuery.toLowerCase())
                    );

                    setSearchResults(filteredPosts);
                    navigate('/search', { state: { searchResults: filteredPosts } });
                } else {
                    setSearchResults([]);
                    navigate('/search', { state: { searchResults: [] } });
                }
            } catch (error) {
                console.error('Error searching posts:', error);
            }
        }
    };

    useEffect(() => {
        if (userLoggedIn) {
            fetchUsername();
        }
    }, [userLoggedIn]);

    return (
        <>
            <div className="navbar flex items-center bg-[#3d4e29] w-full border-b border-[#283618]">
                <div 
                    className="logo text-2xl ml-5 cursor-pointer hover:bg-[#576843] p-2 rounded"
                    onClick={() => navigate('/main')}
                >
                    SnapNest
                </div>
                <div className="flex-grow flex justify-center">
                    <form onSubmit={handleSearch} className="w-full max-w-md">
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Search by username or post title"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                {userLoggedIn && (
                    <div className="dropdownbtn mr-5">
                        <div className="dropdown">
                            <div 
                                id='dropdown'
                                tabIndex={0} 
                                role="button" 
                                className="btn m-1 px-6 py-3 text-lg flex items-center"
                                onClick={toggleDropdown}
                            >
                                <img src={photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                                {username || 'User'}
                            </div>
                            {isDropdownOpen && (
                                <ul 
                                    tabIndex={0} 
                                    className="text-lg dropdown-content menu rounded-box border border-[#283618] bg-[#ece6ba] z-[1] w-full p-2 shadow"
                                >
                                    <button onClick={() => navigate('/profile')} className="menu-item">Profile</button>
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
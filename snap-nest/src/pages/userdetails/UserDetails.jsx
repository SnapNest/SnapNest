import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import SimplePost from '../../components/simplepost/SimplePost';

const UserDetails = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [visiblePosts, setVisiblePosts] = useState(3);

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = ref(database, `users/${userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    setUserData(snapshot.val());
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchUserPosts = async () => {
            const postsRef = query(ref(database, 'posts'), orderByChild('user/userId'), equalTo(userId));
            try {
                const snapshot = await get(postsRef);
                if (snapshot.exists()) {
                    const postsData = snapshot.val();
                    const postsArray = Object.keys(postsData).map(key => ({
                        id: key,
                        ...postsData[key]
                    }));
                    setUserPosts(postsArray);
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserData();
        fetchUserPosts();
    }, [userId]);

    const handleLoadMore = () => {
        setVisiblePosts(visiblePosts + 3);
    };

    if (!userData) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center flex-grow bg-base-200">
            <div className="flex flex-row w-full max-w-6xl mt-4 space-x-4">
                <div className="card p-12 bg-base-100 shadow-xl h-80 w-full">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">User Details</h2>
                        <div className="flex items-center mt-4">
                            <div className="avatar mr-4">
                                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={userData.photoURL || 'https://via.placeholder.com/150'} alt="Profile" />
                                </div>
                            </div>
                            <div className="text-lg">
                                <p><strong>Name:</strong> {userData.username || 'Anonymous'}</p>
                                <p><strong>Email:</strong> {userData.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card p-12 bg-base-100 shadow-xl w-full">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">User's Posts</h2>
                        {userPosts.length > 0 ? (
                            <>
                                {userPosts.slice(0, visiblePosts).map(post => (
                                    <SimplePost
                                        key={post.id}
                                        title={post.title || 'Untitled'}
                                        name={post.user?.username || 'Anonymous'}
                                        description={post.content}
                                        userId={post.user?.userId}
                                        image={post.photoURL}
                                    />
                                ))}
                                {visiblePosts < userPosts.length && (
                                    <button className="btn btn-primary mt-4" onClick={handleLoadMore}>
                                        Load More
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-center mt-4">This user has not posted anything yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
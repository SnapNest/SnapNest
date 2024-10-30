import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import Post from '../../components/post/Post'; // Import the Post component

const UserDetails = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

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

    if (!userData) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center flex-grow bg-base-200">
            <div className="card mt-2 p-12 bg-base-100 shadow-xl">
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
            <div className="card mt-4 p-12 bg-base-100 shadow-xl w-full max-w-2xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold">User's Posts</h2>
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <Post
                                key={post.id}
                                title={post.title}
                                name={userData.username || 'Anonymous'}
                                image={post.photoURL}
                                description={post.content}
                                postId={post.id}
                                userId={userId}
                            />
                        ))
                    ) : (
                        <p className="text-center mt-4">This user has not posted anything yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
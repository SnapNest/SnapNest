import { useEffect, useState } from 'react';
import { ref, get, update } from 'firebase/database';
import { auth, database, storage } from '../../firebase/firebase-config';
import { useAuth } from '../../state/authcontext/AuthContext';
import SimplePost from '../../components/simplepost/SimplePost';

const MyProfile = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPhoto, setNewPhoto] = useState(null);
    const [visiblePosts, setVisiblePosts] = useState(3);

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = ref(database, `users/${currentUser.uid}`);
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
            const postsRef = ref(database, 'posts');
            try {
                const snapshot = await get(postsRef);
                if (snapshot.exists()) {
                    const postsData = snapshot.val();
                    const userPostsArray = Object.keys(postsData).map(key => ({
                        id: key,
                        ...postsData[key]
                    })).filter(post => post.user.userId === currentUser.uid);
                    setUserPosts(userPostsArray);
                }
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserData();
        fetchUserPosts();
    }, [currentUser]);

    const handleEditDetails = () => {
        setIsEditing(true);
    };

    const handleSaveDetails = async () => {
        const userRef = ref(database, `users/${currentUser.uid}`);
        let updatedPhotoURL = userData.photoURL;

        if (newPhoto) {
            const photoRef = storage.ref(storage, `users/${currentUser.uid}/${newPhoto.name}`);
            const uploadTask = uploadBytesResumable(photoRef, newPhoto);

            try {
                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        (error) => {
                            console.error('Error uploading file:', error);
                            reject(error);
                        },
                        async () => {
                            updatedPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            } catch (error) {
                console.error('Failed to upload photo:', error);
                return;
            }
        }

        try {
            await update(userRef, {
                username: newUsername || userData.username,
                photoURL: updatedPhotoURL
            });
            setUserData({
                ...userData,
                username: newUsername || userData.username,
                photoURL: updatedPhotoURL
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handleLoadMore = () => {
        setVisiblePosts(visiblePosts + 3);
    };

    if (!userData) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center flex-grow bg-base-200">
            <div className="flex flex-row w-full max-w-6xl mt-4 space-x-4">
                <div className="card p-12 bg-base-100 shadow-xl h-96 w-full">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">My Profile</h2>
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
                        {isEditing ? (
                            <div className="mt-4">
                                <div className="form-control">
                                    <label className="label" htmlFor="new-username">
                                        <span className="label-text">New Username</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="new-username"
                                        className="input input-bordered"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                    />
                                </div>
                                <div className="form-control mt-4">
                                    <label className="label" htmlFor="new-photo">
                                        <span className="label-text">New Profile Picture</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="new-photo"
                                        className="input input-bordered"
                                        accept="image/*"
                                        onChange={(e) => setNewPhoto(e.target.files[0])}
                                    />
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button className="btn btn-secondary mr-2" onClick={handleSaveDetails}>
                                        Save
                                    </button>
                                    <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-end mt-4">
                                <button className="btn btn-primary" onClick={handleEditDetails}>
                                    Edit Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="card p-12 bg-base-100 shadow-xl w-full">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">My Posts</h2>
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
                            <p className="text-center mt-4">You have not posted anything yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
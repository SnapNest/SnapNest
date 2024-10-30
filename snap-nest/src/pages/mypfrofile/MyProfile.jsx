import { useEffect, useState } from 'react';
import { useAuth } from '../../state/authcontext/AuthContext';
import { ref, get, update } from 'firebase/database';
import { database, storage } from '../../firebase/firebase-config';
import { getDownloadURL, uploadBytesResumable, ref as storageRef } from 'firebase/storage';
import defaultUser from '../../photos/defaultUser.jpg'; // Import the default user image

const MyProfile = () => {
    const { currentUser } = useAuth();
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState(defaultUser); // Default to the default user image
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPhoto, setNewPhoto] = useState(null);

    useEffect(() => {
        if (currentUser) {
            const fetchUserData = async () => {
                const userRef = ref(database, `users/${currentUser.uid}`);
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setUsername(userData.username || 'Anonymous');
                        setPhotoURL(userData.photoURL || defaultUser); // Use the user's photoURL or default image
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUserData();
        }
    }, [currentUser]);

    const handleEditDetails = () => {
        setIsEditing(true);
        setNewUsername(username);
    };

    const handleSaveDetails = async () => {
        const userRef = ref(database, `users/${currentUser.uid}`);
        let updatedPhotoURL = photoURL;

        if (newPhoto) {
            const photoRef = storageRef(storage, `profilePictures/${currentUser.uid}`);
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
                username: newUsername,
                photoURL: updatedPhotoURL
            });
            setUsername(newUsername);
            setPhotoURL(updatedPhotoURL);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    if (!currentUser) {
        return <div className="text-center mt-10">You must be logged in to view this page.</div>;
    }

    return (
        <div className="flex flex-col items-center flex-grow bg-base-200">
            <div className="card mt-2 p-12 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold">My Profile</h2>
                    <div className="flex items-center mt-4">
                        <div className="avatar mr-4">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={photoURL} alt="Profile" />
                            </div>
                        </div>
                        <div className="text-lg">
                            <p><strong>Name:</strong> {username}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
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
        </div>
    );
};

export default MyProfile;
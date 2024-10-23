import { useEffect, useState } from 'react';
import { useAuth } from '../../state/authcontext/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase-config';

const MyProfile = () => {
    const { currentUser } = useAuth();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (currentUser) {
            const fetchUsername = async () => {
                const userRef = ref(database, `users/${currentUser.uid}`);
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const userData = snapshot.val();
                        setUsername(userData.username || 'Anonymous');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };

            fetchUsername();
        }
    }, [currentUser]);

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
                                <img src={currentUser.photoURL || 'https://via.placeholder.com/150'} alt="Profile" />
                            </div>
                        </div>
                        <div className="text-lg">
                            <p><strong>Name:</strong> {username}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
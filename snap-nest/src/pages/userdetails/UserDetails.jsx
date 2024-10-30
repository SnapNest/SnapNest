import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase-config';

const UserDetails = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);

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

        fetchUserData();
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
        </div>
    );
};

export default UserDetails;
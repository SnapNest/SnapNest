import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import defaultUser from '../../photos/defaultUser.jpg';

const SimplePost = ({ title, name, description, userId }) => {
    const [photoURL, setPhotoURL] = useState(defaultUser);

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = ref(database, `users/${userId}`);
            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setPhotoURL(userData.photoURL || defaultUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    return (
        <div className="card w-full h-auto bg-base-100 shadow-xl mb-4 border-2 border-[#9c8f45]">
            <div className="card-body">
                <div className="flex items-center">
                    <img src={photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                    <div>
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="text-sm text-gray-500">by {name}</p>
                    </div>
                </div>
                <p className="mt-2">{description}</p>
            </div>
        </div>
    );
};

SimplePost.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
};

export default SimplePost;
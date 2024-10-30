import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../state/authcontext/AuthContext';
import { ref, update, get } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import defaultUser from '../../photos/defaultUser.jpg';

const Comment = ({ commentId, postId, text, userId, timestamp, likes, likedBy }) => {
    const { currentUser } = useAuth();
    const [commentLikes, setCommentLikes] = useState(likes);
    const [likedByUser, setLikedByUser] = useState(likedBy?.includes(currentUser.uid) || false);
    const [username, setUsername] = useState('Anonymous');
    const [photoURL, setPhotoURL] = useState(defaultUser);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                setUsername(userData.username || 'Anonymous');
                setPhotoURL(userData.photoURL || defaultUser);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleLike = async () => {
        const commentRef = ref(database, `posts/${postId}/comments/${commentId}`);
        const snapshot = await get(commentRef);
        const commentData = snapshot.val();
        const likedBy = commentData.likedBy || [];

        if (likedByUser) {
            setCommentLikes(commentLikes - 1);
            setLikedByUser(false);
            const updatedLikedBy = likedBy.filter(uid => uid !== currentUser.uid);
            await update(commentRef, {
                likes: commentLikes - 1,
                likedBy: updatedLikedBy
            });
        } else {
            setCommentLikes(commentLikes + 1);
            setLikedByUser(true);
            likedBy.push(currentUser.uid);
            await update(commentRef, {
                likes: commentLikes + 1,
                likedBy: likedBy
            });
        }
    };

    const handleAuthorClick = () => {
        navigate(`/userdetails/${userId}`);
    };

    return (
        <div className="card w-full bg-base-100 shadow-md mb-2 p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <img src={photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                    <button className="font-bold text-blue-500" onClick={handleAuthorClick}>
                        {username}
                    </button>
                </div>
                <button className={`btn ${likedByUser ? 'btn-secondary' : 'btn-primary'} btn-sm`} onClick={handleLike}>
                    {likedByUser ? 'Unlike' : 'Like'} ({commentLikes})
                </button>
            </div>
            <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(timestamp))} ago</p>
            <p className="mt-2">{text}</p>
        </div>
    );
};

Comment.propTypes = {
    commentId: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    likes: PropTypes.number.isRequired,
    likedBy: PropTypes.array.isRequired,
};

export default Comment;
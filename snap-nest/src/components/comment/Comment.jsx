import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../state/authcontext/AuthContext';
import { ref, update, get } from 'firebase/database';
import { database } from '../../firebase/firebase-config';

const Comment = ({ commentId, postId, text, userId, timestamp }) => {
    const { currentUser } = useAuth();
    const [likes, setLikes] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [username, setUsername] = useState('Anonymous');

    useState(() => {
        const fetchCommentData = async () => {
            const commentRef = ref(database, `posts/${postId}/comments/${commentId}`);
            const snapshot = await get(commentRef);
            if (snapshot.exists()) {
                const commentData = snapshot.val();
                setLikes(commentData.likes || 0);
                setLikedByUser(commentData.likedBy?.includes(currentUser.uid) || false);
            }

            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                setUsername(userData.username || 'Anonymous');
            }
        };

        fetchCommentData();
    }, [commentId, postId, userId, currentUser]);

    const handleLike = async () => {
        const commentRef = ref(database, `posts/${postId}/comments/${commentId}`);
        if (likedByUser) {
            setLikes(likes - 1);
            setLikedByUser(false);
            await update(commentRef, {
                likes: likes - 1,
                likedBy: (await get(commentRef)).val().likedBy.filter(uid => uid !== currentUser.uid)
            });
        } else {
            setLikes(likes + 1);
            setLikedByUser(true);
            await update(commentRef, {
                likes: likes + 1,
                likedBy: [...(await get(commentRef)).val().likedBy, currentUser.uid]
            });
        }
    };

    return (
        <div className="card w-full bg-base-100 shadow-md mb-2 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold">{username}</p>
                    <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(timestamp))} ago</p>
                </div>
                <button className={`btn ${likedByUser ? 'btn-secondary' : 'btn-primary'} btn-sm`} onClick={handleLike}>
                    {likedByUser ? 'Unlike' : 'Like'} ({likes})
                </button>
            </div>
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
};

export default Comment;
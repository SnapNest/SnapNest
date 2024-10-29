import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../state/authcontext/AuthContext';
import { addLikeToDatabase, removeLikeFromDatabase } from '../../services/postService';
import { ref, get, update } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import Comment from '../comment/Comment';

const Post = ({ name, image, description, postId }) => {
    const { currentUser } = useAuth();
    const [likes, setLikes] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchPostData = async () => {
            const postRef = ref(database, `posts/${postId}`);
            const snapshot = await get(postRef);
            if (snapshot.exists()) {
                const postData = snapshot.val();
                setLikes(postData.likes || 0);
                setComments(postData.comments || []);
                setLikedByUser(postData.likedBy?.includes(currentUser.uid) || false);
            }
        };

        fetchPostData();
    }, [postId, currentUser]);

    const handleLike = async () => {
        const postRef = ref(database, `posts/${postId}`);
        const snapshot = await get(postRef);
        const postData = snapshot.val();
        const likedBy = postData.likedBy || [];

        if (likedByUser) {
            setLikes(likes - 1);
            setLikedByUser(false);
            const updatedLikedBy = likedBy.filter(uid => uid !== currentUser.uid);
            await update(postRef, {
                likes: likes - 1,
                likedBy: updatedLikedBy
            });
        } else {
            setLikes(likes + 1);
            setLikedByUser(true);
            likedBy.push(currentUser.uid);
            await update(postRef, {
                likes: likes + 1,
                likedBy: likedBy
            });
        }
    };

    const handleAddComment = async () => {
        if (comment.trim()) {
            const newComment = {
                text: comment,
                userId: currentUser.uid,
                timestamp: Date.now(),
                likes: 0,
                likedBy: []
            };
            const newComments = [...comments, newComment];
            setComments(newComments);
            setComment('');
            const postRef = ref(database, `posts/${postId}`);
            await update(postRef, {
                comments: newComments
            });
        }
    };

    return (
        <div className="card w-full h-auto bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                {image && (
                    <figure>
                        <img src={image} alt="Post" className="w-full h-auto" />
                    </figure>
                )}
                <p>{description}</p>
                <div className="flex items-center mt-4">
                    <button className={`btn ${likedByUser ? 'btn-secondary' : 'btn-primary'} mr-4`} onClick={handleLike}>
                        {likedByUser ? 'Unlike' : 'Like'} ({likes})
                    </button>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Comments</h3>
                    <div className="form-control mt-2">
                        <textarea
                            className="textarea textarea-bordered"
                            placeholder="Add a comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                        <button className="btn btn-secondary mt-2" onClick={handleAddComment}>
                            Add Comment
                        </button>
                    </div>
                    <div className="mt-4">
                        {comments.map((cmt, index) => (
                            <Comment
                                key={index}
                                commentId={index.toString()}
                                postId={postId}
                                text={cmt.text}
                                userId={cmt.userId}
                                timestamp={cmt.timestamp}
                                likes={cmt.likes}
                                likedBy={cmt.likedBy}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

Post.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
};

export default Post;
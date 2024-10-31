import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../state/authcontext/AuthContext';
import { ref, get, update } from 'firebase/database';
import { database, storage } from '../../firebase/firebase-config';
import { useNavigate } from 'react-router-dom';
import Comment from '../comment/Comment';
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import defaultUser from '../../photos/defaultUser.jpg';
import './Post.css';

const Post = ({ title, name, image, description, postId, userId, className }) => {
    const { currentUser } = useAuth();
    const [likes, setLikes] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [visibleComments, setVisibleComments] = useState(2);
    const [photoURL, setPhotoURL] = useState(defaultUser);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newDescription, setNewDescription] = useState(description);
    const [newImage, setNewImage] = useState(null);
    const navigate = useNavigate();

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

        const fetchUserData = async () => {
            const userRef = ref(database, `users/${userId}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                setPhotoURL(userData.photoURL || defaultUser);
            }
        };

        fetchPostData();
        fetchUserData();
    }, [postId, userId, currentUser]);

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

    const handleShowMoreComments = () => {
        setVisibleComments(visibleComments + 3);
    };

    const handleAuthorClick = () => {
        navigate(`/userdetails/${userId}`);
    };

    const handleEditPost = () => {
        setIsEditing(true);
    };

    const handleSavePost = async () => {
        const postRef = ref(database, `posts/${postId}`);
        let updatedPhotoURL = image;

        if (newImage) {
            const photoRef = storage.ref(storage, `posts/${userId}/${newImage.name}`);
            const uploadTask = uploadBytesResumable(photoRef, newImage);

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
            await update(postRef, {
                title: newTitle,
                content: newDescription,
                photoURL: updatedPhotoURL
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <div className={`card w-full h-auto bg-base-100 shadow-xl mb-4 ${className}`}>
            <div className="card-body">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={photoURL} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                        <button className="text-blue-500" onClick={handleAuthorClick}>
                            {name}
                        </button>
                    </div>
                    {currentUser && currentUser.uid === userId && (
                        <button className="btn btn-sm btn-primary" onClick={handleEditPost}>
                            Edit Post
                        </button>
                    )}
                </div>
                {isEditing ? (
                    <div className="mt-4">
                        <div className="form-control">
                            <label className="label" htmlFor="new-title">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                id="new-title"
                                className="input input-bordered"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="form-control mt-4">
                            <label className="label" htmlFor="new-description">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                id="new-description"
                                className="textarea textarea-bordered h-24"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="form-control mt-4">
                            <label className="label" htmlFor="new-image">
                                <span className="label-text">Attach Photo</span>
                            </label>
                            <input
                                type="file"
                                id="new-image"
                                className="input input-bordered"
                                accept="image/*"
                                onChange={(e) => setNewImage(e.target.files[0])}
                            />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button className="btn btn-secondary mr-2" onClick={handleSavePost}>
                                Save
                            </button>
                            <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mt-2">{title}</h2>
                        {image && (
                            <figure>
                                <img src={image} alt="Post" className="w-full h-auto" />
                            </figure>
                        )}
                        <p>{description}</p>
                    </>
                )}
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
                        {comments.slice(0, visibleComments).map((cmt, index) => (
                            <Comment
                                key={index}
                                commentId={index.toString()}
                                postId={postId}
                                text={cmt.text}
                                userId={cmt.userId}
                                timestamp={cmt.timestamp}
                                likes={cmt.likes}
                                likedBy={cmt.likedBy || []}
                            />
                        ))}
                        {visibleComments < comments.length && (
                            <button className="btn btn-link mt-2" onClick={handleShowMoreComments}>
                                More Comments
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Post.propTypes = {
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string.isRequired,
    postId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Post;
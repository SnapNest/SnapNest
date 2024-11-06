import { useState } from 'react';
import { ref as dbRef, push, get } from 'firebase/database';
import { ref as storageRef, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { auth, database, storage } from '../../firebase/firebase-config';

const CreatePost = () => {
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!postTitle.trim() || !postContent.trim()) {
            setError("Post title and content can't be empty.");
            setLoading(false);
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setError('You must be logged in to create a post.');
            setLoading(false);
            return;
        }

        const userRef = dbRef(database, `users/${user.uid}`);
        let username = 'Anonymous';
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                username = userData.username || 'Anonymous';
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        let photoURL = '';
        if (photo) {
            const photoRef = storageRef(storage, `posts/${user.uid}/${photo.name}`);
            const uploadTask = uploadBytesResumable(photoRef, photo);

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
                            photoURL = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            } catch (error) {
                setError('Failed to upload photo. Try again later.');
                setLoading(false);
                return;
            }
        }

        const postRef = dbRef(database, 'posts');

        const newPost = {
            title: postTitle,
            content: postContent,
            createdAt: Date.now(),
            user: {
                username: username,
                userId: user.uid
            },
            photoURL: photoURL,
            likes: 0,
            likedBy: [],
            comments: [],
            commentedBy: []
        };

        try {
            await push(postRef, newPost);
            setPostTitle('');
            setPostContent('');
            setPhoto(null);
            setModalVisible(false);
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create post. Try again later.');
        }

        setLoading(false);
    };

    return (
        <>
            <button
                className="bg-[#ece6ba] mt-1 mb-1 text-black px-4 py-2 rounded-lg ml-1 text-2xl"
                onClick={() => setModalVisible(true)}
            >
                Create Post
            </button>

            {isModalVisible && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setModalVisible(false)}
                    />

                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-[#ece6ba] p-8 rounded-lg shadow-lg w-96 relative">
                            <button
                                className="absolute top-2 right-2 mr-2 text-[#283618] text-3xl"
                                onClick={() => setModalVisible(false)}
                            >
                                x
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-[#283618]">Create a Post</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <form onSubmit={handleCreatePost}>
                                <div className="form-control">
                                    <label className="label" htmlFor="post-title">
                                        <span className="label-text">Post Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="post-title"
                                        className="input input-bordered"
                                        placeholder="Enter the title"
                                        value={postTitle}
                                        onChange={(e) => setPostTitle(e.target.value)}
                                    />
                                </div>
                                <div className="form-control mt-4">
                                    <label className="label" htmlFor="post-content">
                                        <span className="label-text">Post Content</span>
                                    </label>
                                    <textarea
                                        id="post-content"
                                        className="textarea textarea-bordered h-24"
                                        placeholder="What's on your mind?"
                                        value={postContent}
                                        onChange={(e) => setPostContent(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="form-control mt-4">
                                    <label className="label" htmlFor="post-photo">
                                        <span className="label-text">Attach Photo</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="post-photo"
                                        className="input input-bordered"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="btn bg-[#283618] text-white mt-4"
                                        disabled={loading}
                                    >
                                        {loading ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default CreatePost;
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import CreatePost from '../../components/createpost/CreatePost';
import Post from '../../components/post/Post';

const Main = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const postsRef = ref(database, 'posts');
        onValue(postsRef, (snapshot) => {
            const data = snapshot.val();
            const postsArray = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })) : [];
            setPosts(postsArray);
        });
    }, []);

    return (
        <div className="bg-[#ada35a71] flex-grow min-h-screen">
            <div className="post-container flex flex-col items-center p-4 min-h-screen">
                <CreatePost />
                <div className="flex justify-center w-full bg-[#bd803a]">
                    <div className="max-w-xl mt-4 w-full">
                        {posts.map(post => (
                            <Post
                                key={post.id}
                                name={post.user.username}
                                image={post.photoURL}
                                description={post.content}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
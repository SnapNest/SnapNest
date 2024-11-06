import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import CreatePost from '../../components/createpost/CreatePost';
import Post from '../../components/post/Post';

const Main = () => {
    const [posts, setPosts] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('Newest');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [visiblePosts, setVisiblePosts] = useState(3);

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

    const handleSortChange = (criteria) => {
        setSortCriteria(criteria);
        let sortedPosts = [...posts];
        if (criteria === 'Newest') {
            sortedPosts.sort((a, b) => b.createdAt - a.createdAt);
        } else if (criteria === 'Oldest') {
            sortedPosts.sort((a, b) => a.createdAt - b.createdAt);
        } else if (criteria === 'Most Liked') {
            sortedPosts.sort((a, b) => b.likes - a.likes);
        }
        setPosts(sortedPosts);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLoadMore = () => {
        setVisiblePosts(visiblePosts + 3);
    };

    return (
        <div className="bg-[#ada35a71] flex-grow min-h-screen">
            <div className="post-container flex flex-col items-center p-4 min-h-screen">
                <div className="flex justify-center w-2/4 rounded-lg bg-[#DDA15E]">
                    <div className="max-w-xl mt-4 w-full">
                        <div className="flex justify-between w-full max-w-xl">
                            <CreatePost />
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn m-1" onClick={toggleDropdown}>Sort By</label>
                                {isDropdownOpen && (
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                                        <li><button onClick={() => handleSortChange('Newest')}>Newest</button></li>
                                        <li><button onClick={() => handleSortChange('Oldest')}>Oldest</button></li>
                                        <li><button onClick={() => handleSortChange('Most Liked')}>Most Liked</button></li>
                                    </ul>
                                )}
                            </div>
                        </div>
                        {posts.slice(0, visiblePosts).map(post => (
                            <Post
                                key={post.id}
                                title={post.title || 'Untitled'}
                                name={post.user?.username || 'Anonymous'}
                                image={post.photoURL}
                                description={post.content}
                                postId={post.id}
                                userId={post.user?.userId}
                            />
                        ))}
                        <div className="flex justify-center">
                        {visiblePosts < posts.length && (
                            <button className="btn btn-primary border-[#00000071] text-xl w-44 h-16 mt-2 mb-2" onClick={handleLoadMore}>
                                Load More
                            </button>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
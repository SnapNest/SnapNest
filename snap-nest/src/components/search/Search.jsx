import { useLocation } from 'react-router-dom';
import Post from '../../components/post/Post';

const SearchResults = () => {
    const location = useLocation();
    const { searchResults } = location.state || { searchResults: [] };

    return (
        <div className="flex flex-col items-center flex-grow bg-base-200">
            <div className="card mt-4 p-12 bg-base-100 shadow-xl w-full max-w-2xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold">Search Results:</h2>
                    {searchResults.length > 0 ? (
                        searchResults.map(post => (
                            <Post
                                key={post.id}
                                title={post.title || 'Untitled'}
                                name={post.user?.username || 'Anonymous'}
                                image={post.photoURL}
                                description={post.content}
                                postId={post.id}
                                userId={post.user?.userId}
                            />
                        ))
                    ) : (
                        <p className="text-center mt-4">No posts found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
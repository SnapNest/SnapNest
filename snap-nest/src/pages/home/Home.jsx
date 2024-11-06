import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/firebase-config';
import Login from "../../components/login/Login";
import Register from "../../components/register/Register";
import SimplePost from '../../components/simplepost/SimplePost';

export default function Home() {
  const [randomPosts, setRandomPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = ref(database, 'posts');
      try {
        const snapshot = await get(postsRef);
        if (snapshot.exists()) {
          const postsData = snapshot.val();
          const postsArray = Object.keys(postsData).map(key => ({
            id: key,
            ...postsData[key]
          }));

          const shuffledPosts = postsArray.sort(() => 0.5 - Math.random());
          const selectedPosts = shuffledPosts.slice(0, 3);
          setRandomPosts(selectedPosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="ml-20 flex flex-row items-center h-80">
          <div className="text-4xl mr-3">
            SnapNest
          </div>
          <div className="w-0.5 h-full bg-[#283618] mx-4"></div>
          <div>
            <div className="flex-1 text-4xl ml-3">
              Get started
              <div className="flex flex-row mt-5">
                <Register />
                <Login />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-0.5 h-full bg-[#283618] ml-72 mt-6 mb-6 mx-4"></div>
      <div className="w-full mt-6 mb-24 rounded-md mr-12 bg-[#ece6ba] p-4">
        <h1 className="text-2xl ml-80 mt-14 font-bold mb-4">Some of our recent posts:</h1>
        {randomPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-44 gap-4">
            {randomPosts.map(post => (
              <SimplePost
                key={post.id}
                title={post.title || 'Untitled'}
                name={post.user?.username || 'Anonymous'}
                description={post.content}
                userId={post.user?.userId}
                image={post.photoURL}
              />
            ))}
          </div>
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </>
  );
}
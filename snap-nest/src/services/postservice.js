import { ref, get, update } from 'firebase/database';
import { database } from '../firebase/firebase-config';

export const getLikesFromDatabase = async (postId) => {
    const postRef = ref(database, `posts/${postId}`);
    const snapshot = await get(postRef);
    if (snapshot.exists()) {
        const postData = snapshot.val();
        return {
            totalLikes: postData.likes || 0,
            likedBy: postData.likedBy || []
        };
    }
    return {
        totalLikes: 0,
        likedBy: []
    };
};

export const addLikeToDatabase = async (postId, userId) => {
    const postRef = ref(database, `posts/${postId}`);
    const snapshot = await get(postRef);
    if (snapshot.exists()) {
        const postData = snapshot.val();
        const likedBy = postData.likedBy || [];
        likedBy.push(userId);
        await update(postRef, {
            likes: (postData.likes || 0) + 1,
            likedBy: likedBy
        });
    }
};

export const removeLikeFromDatabase = async (postId, userId) => {
    const postRef = ref(database, `posts/${postId}`);
    const snapshot = await get(postRef);
    if (snapshot.exists()) {
        const postData = snapshot.val();
        const likedBy = postData.likedBy || [];
        const updatedLikedBy = likedBy.filter(uid => uid !== userId);
        await update(postRef, {
            likes: (postData.likes || 0) - 1,
            likedBy: updatedLikedBy
        });
    }
};
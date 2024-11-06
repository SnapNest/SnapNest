import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../firebase/firebase-config';
import { set, ref } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email,
                uid: user.uid
            });

            toast.success("User registered successfully!");
            navigate("/main");
        } catch (error) {
            setError(error.message);
            toast.error("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <button className="bg-[#283618] text-white px-4 py-2 rounded-lg ml-1 text-2xl"
                onClick={() => setModalVisible(true)}>
                Register
            </button>

            {isModalVisible && (
                <>
                    <div className="fixed inset-0 flex items-center justify-center bg-black z-40 bg-opacity-50">
                        <div className="bg-[#ece6ba] p-8 rounded-lg shadow-lg w-96 relative">
                            <button
                                className="absolute top-2 right-2 text-[#283618] text-3xl mr-2 font-bold"
                                onClick={() => setModalVisible(false)}
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-4 text-[#283618]">Register</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <form onSubmit={handleRegister}>
                                <div className="mb-4">
                                    <label className="block text-[#283618] mb-2" htmlFor="username">Username</label>
                                    <input
                                        className="input input-bordered w-full"
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[#283618] mb-2" htmlFor="email">Email</label>
                                    <input
                                        className="input input-bordered w-full"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[#283618] mb-2" htmlFor="password">Password</label>
                                    <input
                                        className="input input-bordered w-full"
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="btn text-white btn-primary bg-[#283618]"
                                        disabled={loading}
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

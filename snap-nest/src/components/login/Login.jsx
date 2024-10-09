import { useState } from 'react';

export default function Login() {
    
    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="bg-[#283618] text-white px-4 py-2 rounded-lg ml-1 text-2xl"
                onClick={() => setModalVisible(true)}>
                Log In
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
                            <h2 className="text-2xl font-bold mb-4 text-[#283618]">Login</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="block text-[#283618] mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-[#283618] mb-2" htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="input input-bordered w-full"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="btn bg-[#283618] text-white">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
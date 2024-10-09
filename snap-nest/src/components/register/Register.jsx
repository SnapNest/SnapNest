import { useState } from 'react';

export default function Register() {

    const [isModalVisible, setModalVisible] = useState(false);

    return (
        <>
        <button className="bg-[#283618] text-white px-4 py-2 rounded-lg ml-1 text-2xl"
        onClick={() => setModalVisible(true)}>
            Register
        </button>
        
        {isModalVisible && (
            <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-[#ece6ba] p-8 rounded-lg shadow-lg w-96 relative">
                    <button 
                        className="absolute top-2 right-2 text-[#283618] text-3xl mr-2 font-bold"
                        onClick={() => setModalVisible(false)}
                    >
                        &times;
                    </button>
                    <h2 className="text-2xl font-bold mb-4 text-[#283618]">Register</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-[#283618] mb-2" htmlFor="username">Username</label>
                            <input className="input input-bordered w-full" type="text" id="username" name="username" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#283618] mb-2" htmlFor="email">Email</label>
                            <input className="input input-bordered w-full" type="email" id="email" name="email" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-[#283618] mb-2" htmlFor="password">Password</label>
                            <input className="input input-bordered w-full" type="password" id="password" name="password" />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="btn text-white btn-primary bg-[#283618]">Register</button>
                        </div>
                    </form>
                </div>
            </div>
            </>
        )}
        </>
    )
}
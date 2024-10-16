import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'
import Navbar from './components/navbar/Navbar'
import Main from './pages/main/Main'
import Sidenav from './components/sidenav/Sidenav';
import { AuthProvider } from './state/authcontext/AuthContext';

function App() {

  return (
    <>
    <AuthProvider>
      <BrowserRouter>
        <div className='flex flex-col w-full h-screen'>
        <Navbar/>
          <div className="content flex flex-row w-full h-screen">
            <Sidenav />
            <div className="flex flex-grow h-full">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/main' element={<Main />} />
            </Routes>
          </div>
          </div>
          </div>
      </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App

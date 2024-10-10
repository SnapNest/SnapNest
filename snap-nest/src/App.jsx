import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'
import Navbar from './components/navbar/Navbar'
import Main from './pages/main/Main'
import Sidenav from './components/sidenav/Sidenav';

function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar/>
        <div className="content mt-36 flex flex-row w-full h-screen">
          <Sidenav/>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/main' element={<Main />} />
          </Routes>
        </div>
    </BrowserRouter>
    </>
  )
}

export default App

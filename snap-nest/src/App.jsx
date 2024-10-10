import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'
import Navbar from './components/navbar/Navbar'
import Main from './pages/main/Main'

function App() {

  return (
    <>
    <BrowserRouter>
      <Navbar/>
        <div className="content mt-36 flex flex-row w-full h-screen">
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

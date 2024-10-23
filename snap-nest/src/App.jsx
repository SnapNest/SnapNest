import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import Main from './pages/main/Main';
import Sidenav from './components/sidenav/Sidenav';
import { AuthProvider, useAuth } from './state/authcontext/AuthContext';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import MyProfile from './pages/mypfrofile/MyProfile';

function AppContent() {
  const { userLoggedIn } = useAuth();

  return (
    <div className='flex flex-col w-full h-screen'>
      <Navbar />
      <div className="content flex flex-row w-full h-screen">
        {userLoggedIn && <Sidenav />}
        <div className="flex flex-grow h-full">
          <Routes>
            <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/main' element={<ProtectedRoute><Main /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import Main from './pages/main/Main';
import { AuthProvider, useAuth } from './state/authcontext/AuthContext';
import ProtectedRoute from './components/protectedroute/ProtectedRoute';
import MyProfile from './pages/mypfrofile/MyProfile';
import UserDetails from './pages/userdetails/UserDetails';
import Search from './components/search/Search';

function AppContent() {
  const { userLoggedIn } = useAuth();

  return (
    <div className='flex flex-col w-full min-h-screen'>
      <Navbar />
      <div className="content flex flex-row w-full flex-grow">
        <div className="flex flex-grow">
          <Routes>
            <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path='/main' element={<ProtectedRoute><Main /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
            <Route path="/userdetails/:userId" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
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
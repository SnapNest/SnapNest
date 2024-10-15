import PropTypes from 'prop-types';
import {auth} from '../firebase/firebase-config';
import { createContext, useContext, useEffect, useState  } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setUserLoggedIn(user ? true : false);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userLoggedIn,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

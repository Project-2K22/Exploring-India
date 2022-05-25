import { onAuthStateChanged } from 'firebase/auth';
import { child, get, ref } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';

const useAuthState = () => {
    const [uid, setUid] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const getUserData = uid => {
        const adminRef = ref(db);
        get(child(adminRef, `admins/${uid}`))
            .then(snapshot => {
                if (snapshot.exists()) {
                    setUser(snapshot.val());
                    setLoading(false);
                } else {
                    setError('No data available');
                }
            })
            .catch(error => {
                setError(error);
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user !== null) {
                setUid(user.uid);
                getUserData(user.uid);
            } else setError("User does'nt exists");
        });
    }, []);

    return { uid, user, error, loading };
};

export default useAuthState;

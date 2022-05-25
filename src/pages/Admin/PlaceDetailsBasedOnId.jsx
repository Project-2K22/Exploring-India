import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { child, get, ref } from 'firebase/database';
import { db } from '../../firebase/config';
import BaseContainer from '../../components/BaseContainer';
import Loader from '../../components/Loader';
import PlaceViewAndUpdateForm from '../../components/PlaceViewAndUpdateForm';

const PlaceDetailsBasedOnId = () => {
    const { id } = useParams();

    const [place, setPlace] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const placesRef = ref(db);
        get(child(placesRef, `places/${id}`))
            .then(snapshot => {
                if (snapshot.exists()) {
                    setPlace(snapshot.val());
                    setLoading(false);
                } else {
                    console.log('No data available');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <BaseContainer w="lg">
            {loading ? <Loader /> : <PlaceViewAndUpdateForm page={'admin'} place={place} />}
        </BaseContainer>
    );
};

export default PlaceDetailsBasedOnId;

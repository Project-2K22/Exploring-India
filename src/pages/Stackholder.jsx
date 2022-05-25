import React from 'react';
import BaseContainer from '../components/BaseContainer';
import PlaceViewAndUpdateForm from '../components/PlaceViewAndUpdateForm';

const place = {
    city: '', //
    facts: [], //
    full_discription: '', //
    id: '',
    imagelinks: ['', '', '', '', ''],
    latitude: '', //
    likes: 0,
    longitude: '', //
    name: '', //
    no: 1,
    others: [],
    placeVerified: 'false',
    short_description: '',
    state: '', //
    type: '', //
    uploaddate: Date.now(),
    visitors: 50,
    zipcode: '', //
};

const Stackholder = () => {
    return (
        <BaseContainer w="lg">
            <PlaceViewAndUpdateForm page={'holder'} place={place} />
        </BaseContainer>
    );
};

export default Stackholder;

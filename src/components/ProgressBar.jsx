import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import useStorage from '../hooks/useStorage';

const ProgressBar = ({ file, setFile, form, setForm, where }) => {
    const { progress, url, error } = useStorage(file, where);

    useEffect(() => {
        if (url) {
            setFile(null);
            setForm({ ...form, dplink: url });
        }

        console.log(error);
    }, [url, setFile, error]);

    return (
        <div>
            <CircularProgress variant="determinate" value={progress} />
        </div>
    );
};

export default ProgressBar;

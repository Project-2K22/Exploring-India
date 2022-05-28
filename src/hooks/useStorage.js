import { useState, useEffect } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase/config';
import Compressor from 'compressorjs';

const useStorage = (nonCompressedFile, where) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        new Compressor(nonCompressedFile, {
            quality: 0.8,
            success: file => {
                const storageRef = ref(storage, `${where}/` + file.name);
                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                    'state_changed',
                    snapshot => {
                        let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(percentage);
                    },
                    error => {
                        setError(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => setUrl(downloadUrl));
                    }
                );
            },
        });
    }, [nonCompressedFile]);

    return { progress, error, url };
};

export default useStorage;

import React from 'react';
import { Link } from 'react-router-dom';

const LinkTo = ({ children, to, newWindow }) => {
    return (
        <Link style={{ textDecoration: 'none' }} to={to} target={newWindow && '_blank'}>
            {children}
        </Link>
    );
};

export default LinkTo;

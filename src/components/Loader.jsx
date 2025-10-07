import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <FaSpinner className="spinner" />
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;

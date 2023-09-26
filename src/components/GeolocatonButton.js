import React from 'react';
import '../assets/css/GeoLocationButton.css'
import location from '../assets/css/icons/gps_location.svg'

const GeolocationButton = ({ onGetGeoLocation }) => {
  return (
    <button className="geolocation-button" onClick={onGetGeoLocation}>
      <img
        src={location}
        alt="Get Location"
        width="24"
        height="24"
      />
    </button>
  );
};

export default GeolocationButton;

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const LocationContext = createContext();

/**
 * Provider component that manages shared geolocation state across the map.
 * All location-dependent buttons share this state - when one gets permission,
 * all buttons become active.
 * Automatically requests geolocation permission on page load.
 */
export const LocationProvider = ({ children }) => {
    const [locationGranted, setLocationGranted] = useState(false);
    const [userPosition, setUserPosition] = useState(null);

    const requestGeolocation = useCallback((onSuccess, onError) => {
        if (!navigator.geolocation) {
            onError?.();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const newPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                };
                setUserPosition(newPosition);
                setLocationGranted(true);
                onSuccess?.(newPosition);
            },
            error => {
                onError?.(error);
            },
        );
    }, []);

    // Request geolocation permission on page load
    useEffect(() => {
        requestGeolocation();
    }, [requestGeolocation]);

    return (
        <LocationContext.Provider
            value={{
                locationGranted,
                userPosition,
                setUserPosition,
                requestGeolocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

LocationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Hook to access the shared location context.
 * @returns {{locationGranted: boolean, userPosition: object|null, setUserPosition: function, requestGeolocation: function}}
 */
export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

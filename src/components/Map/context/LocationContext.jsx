import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const LocationContext = createContext();

/**
 * Provider component that manages shared geolocation state across the map.
 * All location-dependent buttons share this state - when one gets permission,
 * all buttons become active.
 * Only auto-fetches location if permission was previously granted.
 * Otherwise, waits for explicit user action to request permission.
 */
export const LocationProvider = ({ children }) => {
    const [locationGranted, setLocationGranted] = useState(false);
    const [userPosition, setUserPosition] = useState(null);
    // 'unknown' | 'prompt' | 'granted' | 'denied'
    const [permissionState, setPermissionState] = useState('unknown');

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
                setPermissionState('granted');
                onSuccess?.(newPosition);
            },
            error => {
                setPermissionState('denied');
                onError?.(error);
            },
        );
    }, []);

    // Check existing permission state without prompting the user.
    // Only auto-fetch location if permission was previously granted.
    useEffect(() => {
        const checkExistingPermission = async () => {
            if (!navigator.permissions || !navigator.geolocation) return;

            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                setPermissionState(status.state);

                if (status.state === 'granted') {
                    requestGeolocation();
                }

                // Listen for permission changes
                status.addEventListener('change', () => {
                    setPermissionState(status.state);
                    if (status.state === 'granted') {
                        requestGeolocation();
                    }
                });
            } catch {
                // Permissions API not supported - don't auto-request
            }
        };

        checkExistingPermission();
    }, [requestGeolocation]);

    return (
        <LocationContext.Provider
            value={{
                locationGranted,
                userPosition,
                setUserPosition,
                requestGeolocation,
                permissionState,
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
 * @returns {{locationGranted: boolean, userPosition: object|null, setUserPosition: function, requestGeolocation: function, permissionState: string}}
 */
export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

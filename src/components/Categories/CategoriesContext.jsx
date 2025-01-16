import React, { useState, useContext, createContext } from 'react';

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    return (
        <CategoriesContext.Provider value={{ categories, setCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoriesProvider');
    }
    return context;
};



    let filtersUrlQueryString = allCheckboxes.filter(n => n).join('&');
    if (window.USE_SERVER_SIDE_CLUSTERING) {
        const mapConfigurationData = useMapStore.getState().mapConfiguration;
        if (mapConfigurationData) {
            const mapConfigQueryString = Object.entries(mapConfigurationData)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            filtersUrlQueryString += `&${mapConfigQueryString}`;
        }
    }

    if (window.USE_SERVER_SIDE_CLUSTERING) {
        return locations.map(location => {
            if (location.type === 'cluster') {
                return <ClusterMarker cluster={location} key={location.cluster_uuid} />;
            }
            return <MarkerPopup place={location} key={location.uuid} />;
        });
    }

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapSection = ({ crashData }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [lastCoordinates, setLastCoordinates] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current).setView([20, 0], 2); // Initial map setup
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapRef.current);
        }

        if (crashData && crashData.payload) {
            const { latitude, longitude } = crashData.payload;

            // Ensure latitude and longitude are defined and are numbers
            if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
                // If the coordinates have changed, move the marker
                if (
                    lastCoordinates.latitude !== latitude ||
                    lastCoordinates.longitude !== longitude
                ) {
                    if (markerRef.current) {
                        // If there's an existing marker, remove it
                        mapRef.current.removeLayer(markerRef.current);
                    }

                    // Create a new marker at the start position
                    markerRef.current = L.marker([lastCoordinates.latitude || latitude, lastCoordinates.longitude || longitude])
                        .addTo(mapRef.current)
                        .bindPopup(`<b>Location of Crash</b><br>Latitude: ${latitude}<br>Longitude: ${longitude}`)
                        .openPopup();

                    // Smooth transition: move the marker slowly in steps
                    moveMarkerSlowly(lastCoordinates.latitude || latitude, lastCoordinates.longitude || longitude, latitude, longitude);

                    // Update the last coordinates after moving
                    setLastCoordinates({ latitude, longitude });
                }
            } else {
                console.warn("Invalid latitude or longitude in crashData payload:", { latitude, longitude });
            }
        }
    }, [crashData, lastCoordinates]);

    // Function to move the marker slowly over 5 seconds (100ms interval)
    const moveMarkerSlowly = (startLat, startLng, endLat, endLng) => {
        let step = 0;
        const steps = 50; // Number of steps to take (can adjust to control the speed)
        const interval = setInterval(() => {
            step++;
            const lat = startLat + (endLat - startLat) * (step / steps);
            const lng = startLng + (endLng - startLng) * (step / steps);
            
            // Move the marker to the new position
            markerRef.current.setLatLng([lat, lng]);

            if (step >= steps) {
                clearInterval(interval); // Stop the movement when done
            }
        }, 100); // 100ms interval (adjust for smoother or faster movement)
    };

    return <div id="map" ref={mapContainerRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default MapSection;

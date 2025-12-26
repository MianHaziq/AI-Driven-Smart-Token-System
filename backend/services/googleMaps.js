/**
 * Google Maps Distance Matrix API Service
 *
 * This service calculates real road distance and travel time between two points
 * using Google Maps Distance Matrix API.
 *
 * Required: GOOGLE_MAPS_API_KEY in .env file
 */

const axios = require('axios');

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json';

/**
 * Calculate distance and travel time between two points using Google Maps API
 *
 * @param {Object} origin - { lat: number, lng: number }
 * @param {Object} destination - { lat: number, lng: number }
 * @returns {Promise<Object>} - { distance: { value: meters, text: "X km" }, duration: { value: seconds, text: "X mins" }, success: boolean }
 */
const getDistanceAndDuration = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('GOOGLE_MAPS_API_KEY not configured. Using fallback calculation.');
        return getFallbackDistanceAndDuration(origin, destination);
    }

    try {
        const response = await axios.get(GOOGLE_MAPS_API_URL, {
            params: {
                origins: `${origin.lat},${origin.lng}`,
                destinations: `${destination.lat},${destination.lng}`,
                mode: 'driving', // driving, walking, bicycling, transit
                language: 'en',
                units: 'metric',
                key: apiKey
            }
        });

        const data = response.data;

        if (data.status !== 'OK') {
            console.error('Google Maps API error:', data.status, data.error_message);
            return getFallbackDistanceAndDuration(origin, destination);
        }

        const element = data.rows[0]?.elements[0];

        if (!element || element.status !== 'OK') {
            console.error('Google Maps API element error:', element?.status);
            return getFallbackDistanceAndDuration(origin, destination);
        }

        // distance.value is in meters, duration.value is in seconds
        const distanceKm = element.distance.value / 1000;
        const durationMinutes = Math.ceil(element.duration.value / 60);

        console.log(`Google Maps API: Distance ${distanceKm.toFixed(1)} km, Duration ${durationMinutes} min`);

        return {
            success: true,
            source: 'google_maps',
            distance: {
                value: element.distance.value, // meters
                km: Math.round(distanceKm * 10) / 10, // km rounded to 1 decimal
                text: element.distance.text
            },
            duration: {
                value: element.duration.value, // seconds
                minutes: durationMinutes, // minutes rounded up
                text: element.duration.text
            }
        };

    } catch (error) {
        console.error('Google Maps API request failed:', error.message);
        return getFallbackDistanceAndDuration(origin, destination);
    }
};

/**
 * Fallback calculation using Haversine formula with road distance multiplier
 * Used when Google Maps API is not available or fails
 *
 * @param {Object} origin - { lat: number, lng: number }
 * @param {Object} destination - { lat: number, lng: number }
 * @returns {Object}
 */
const getFallbackDistanceAndDuration = (origin, destination) => {
    // Haversine formula for straight-line distance
    const R = 6371; // Earth's radius in kilometers
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLng = (destination.lng - origin.lng) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLineDistance = R * c;

    // Apply road distance multiplier (roads are ~1.4x longer than straight line)
    const ROAD_MULTIPLIER = 1.4;
    const roadDistance = straightLineDistance * ROAD_MULTIPLIER;
    const roundedDistance = Math.round(roadDistance * 10) / 10;

    // Estimate travel time (25 km/h average city speed in Pakistan)
    const AVG_SPEED_KM_PER_HOUR = 25;
    const durationMinutes = Math.ceil((roadDistance / AVG_SPEED_KM_PER_HOUR) * 60);

    console.log(`Fallback calculation: Distance ${roundedDistance} km, Duration ${durationMinutes} min`);

    return {
        success: true,
        source: 'fallback',
        distance: {
            value: Math.round(roadDistance * 1000), // meters
            km: roundedDistance,
            text: `${roundedDistance} km`
        },
        duration: {
            value: durationMinutes * 60, // seconds
            minutes: durationMinutes,
            text: `${durationMinutes} mins`
        }
    };
};

/**
 * Check if Google Maps API is configured
 * @returns {boolean}
 */
const isGoogleMapsConfigured = () => {
    return !!process.env.GOOGLE_MAPS_API_KEY;
};

module.exports = {
    getDistanceAndDuration,
    getFallbackDistanceAndDuration,
    isGoogleMapsConfigured
};

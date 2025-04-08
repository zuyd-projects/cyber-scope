import { globe } from './globeConfig.js'
import { FLIGHT_TIME, ARC_REL_LEN, fixedPoint } from './constants.js'

export function emitArc({ lat: startLat, lng: startLng, hostname, address }) {
    const { lat: endLat, lng: endLng } = fixedPoint
    const arc = { startLat, startLng, endLat, endLng, hostname, address }
    globe.arcsData([...globe.arcsData(), arc])
    setTimeout(() => globe.arcsData(globe.arcsData().filter(d => d !== arc)), FLIGHT_TIME * 2)

    const srcRing = { lat: startLat, lng: startLng }
    globe.ringsData([...globe.ringsData(), srcRing])
    setTimeout(() => globe.ringsData(globe.ringsData().filter(r => r !== srcRing)), FLIGHT_TIME * ARC_REL_LEN)
}

export function addPoint({ lat, lng, address }) {
    // If point is within 0.5 degrees of fixedPoint, do not add it
    const { lat: fixedLat, lng: fixedLng } = fixedPoint
    if (Math.abs(lat - fixedLat) < 0.5 && Math.abs(lng - fixedLng) < 0.5) return

    const existingPoint = globe.pointsData().find(p => p.lat === lat && p.lng === lng)
    if (existingPoint) return

    const newPoint = { lat, lng, address }
    const updated = [...globe.pointsData(), newPoint]
    globe.pointsData(updated.length > 40 ? updated.slice(-40) : updated)
}

export function sunPosAt(dt) {
    const day = new Date(+dt).setUTCHours(0, 0, 0, 0);
    const t = solar.century(dt);
    const longitude = (day - dt) / 864e5 * 360 - 180;
    return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)];
};
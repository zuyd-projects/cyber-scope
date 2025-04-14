import { globe } from './globeConfig.js'
import { FLIGHT_TIME, ARC_REL_LEN, fixedPoint } from './constants.js'

export function emitArc({ startLat, startLng, endLat, endLng, src, dst }) {
    const arc = { startLat, startLng, endLat, endLng, src, dst }
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
    const day = new Date(+dt).setUTCHours(0, 0, 0, 0)
    const t = solar.century(dt)
    const longitude = (day - dt) / 864e5 * 360 - 180
    return [longitude - solar.equationOfTime(t) / 4, solar.declination(t)]
}

export const addSSHRequest = (request) => {
    if (request.source_ip.is_local == 1) return
    const data = {
        startLat: request.source_ip.geo_location.latitude,
        startLng: request.source_ip.geo_location.longitude,
        endLat: fixedPoint.lat,
        endLng: fixedPoint.lng,
        dst: request.device.name,
        src: request.source_ip.address,
    }
    emitArc(data)
    const pointData = {
        lat: data.startLat,
        lng: data.startLng,
        address: data.address,
    }

    addPoint(pointData)
}

export const addPacket = (request) => {
    const data = {}
    if (request.source_ip.is_local == 1) {
        data.startLat = fixedPoint.lat
        data.startLng = fixedPoint.lng
        data.src = request.device.name
        data.dst = request.destination_ip.address
    }
    else {
        data.startLat = request.source_ip.geo_location.latitude
        data.startLng = request.source_ip.geo_location.longitude
        data.src = request.source_ip.address
        data.dst = request.device.name
    }
    if (request.destination_ip.is_local == 1) {
        data.endLat = fixedPoint.lat
        data.endLng = fixedPoint.lng
    }
    else {
        data.endLat = request.destination_ip.geo_location.latitude
        data.endLng = request.destination_ip.geo_location.longitude
    }

    if (data.startLat == 0 || data.startLng == 0 || data.endLat == 0 || data.endLng == 0) return

    emitArc(data)

    const pointData = {
        lat: data.endLat,
        lng: data.endLng,
        address: request.destination_ip.address,
    }

    addPoint(pointData)
}

export const addWinFirewallLog = (request) => {
    const data = {
        startLat: request.source_ip.geo_location.latitude,
        startLng: request.source_ip.geo_location.longitude,
        endLat: fixedPoint.lat,
        endLng: fixedPoint.lng,
        dst: request.device.name,
        src: request.source_ip.address,
    }
    emitArc(data)
    const pointData = {
        lat: data.startLat,
        lng: data.startLng,
        address: request.source_ip.address,
    }

    addPoint(pointData)
}
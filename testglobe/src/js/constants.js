export const fixedPoint = {
    lat: 52.0454689,
    lng: 5.358608,
    altitude: 1.8
}

export const ARC_REL_LEN = 0.4
export const FLIGHT_TIME = 4000
export const NUM_RINGS = 3
export const RINGS_MAX_R = 5
export const RING_PROPAGATION_SPEED = 5

export const CUSTOM_LAYER_DATA = [...Array(500).keys()].map(() => ({
    lat: (Math.random() - 1) * 360,
    lng: (Math.random() - 1) * 360,
    alt: Math.random() * 2,
    size: Math.random() * 0.4,
    color: '#e3e3e3'
}))
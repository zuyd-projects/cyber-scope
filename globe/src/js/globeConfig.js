import {
    ARC_REL_LEN,
    FLIGHT_TIME,
    NUM_RINGS,
    RINGS_MAX_R,
    RING_PROPAGATION_SPEED,
    CUSTOM_LAYER_DATA,
} from './constants.js'
import Globe from 'globe.gl'
import * as THREE from 'three'
import * as dayNightCycle from './dayNightCycle.js'
import earthDay from '../img/earth-day.jpg'
import earthDark from '../img/earth-dark.jpg'
import nightSky from '../img/night-sky.png'


export const globe = Globe()
    // .globeImageUrl(earthDay)
    .pointsData([])
    .pointAltitude(0.025)
    .pointRadius(0.6)
    .pointLabel(d => d.address)
    .arcsData([])
    .arcAltitudeAutoScale(0.3)
    .arcColor(["#00ff00aa", "#ffff00aa", "#ff0000aa"])
    .arcStroke(0.5)
    .arcDashLength(ARC_REL_LEN)
    .arcDashGap(2)
    .arcDashInitialGap(1)
    .arcDashAnimateTime(FLIGHT_TIME)
    .arcsTransitionDuration(0)
    .arcLabel(d => `${d.src} ➜ ${d.dst}`)
    .ringColor(() => t => `rgba(255,100,50,${1 - t})`)
    .ringMaxRadius(RINGS_MAX_R)
    .ringPropagationSpeed(RING_PROPAGATION_SPEED)
    .ringRepeatPeriod(FLIGHT_TIME * ARC_REL_LEN / NUM_RINGS)
    .customLayerData(CUSTOM_LAYER_DATA)
    .customThreeObject(d => new THREE.Mesh(
        new THREE.SphereGeometry(d.size),
        new THREE.MeshLambertMaterial({ color: d.color })
    ))
    .customThreeObjectUpdate((obj, d) => {
        Object.assign(obj.position, globe.getCoords(d.lat, d.lng, d.alt))
    })
    .width(window.innerWidth)
    .height(window.innerHeight)

Promise.all([
    new THREE.TextureLoader().loadAsync(earthDay),
    new THREE.TextureLoader().loadAsync(earthDark)
]).then(([dayTexture, nightTexture]) => {
    const material = dayNightCycle.createDayNightMaterial(dayTexture, nightTexture)

    globe.globeMaterial(material)
        .backgroundImageUrl(nightSky)
        .onZoom(({ lng, lat }) => material.uniforms.globeRotation.value.set(lng, lat))

    let dt = +new Date()  // Start with the current date/time

    // Animation loop to update the time and sun position
    function animate() {
        dt = +new Date()  // Real-time update
        material.uniforms.sunPosition.value.set(...dayNightCycle.sunPosAt(dt))

        // Update the time display
        document.getElementById('time').textContent = new Date(dt).toLocaleString('nl-NL')

        requestAnimationFrame(animate)
    }

    animate()
})
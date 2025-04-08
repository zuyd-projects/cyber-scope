import { globe } from './js/globeConfig.js'
import { fixedPoint } from './js/constants.js'
import { addPoint, emitArc } from './js/functions.js'
import './js/ws.js'

globe(document.getElementById('globeViz'))

globe.controls().autoRotate = false
globe.controls().enableZoom = true
globe.pointOfView(fixedPoint)

window.Echo.channel('globe').listen('.IPLogged', (e) => {
    console.log(e)
    addPoint(e)
    emitArc(e)
})
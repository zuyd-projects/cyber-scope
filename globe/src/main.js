import { globe } from './js/globeConfig.js'
import { fixedPoint } from './js/constants.js'
import { addPoint, emitArc } from './js/functions.js'
import './js/ws.js'

globe(document.getElementById('globeViz'))

globe.controls().autoRotate = false
globe.controls().enableZoom = true
globe.pointOfView(fixedPoint)

const statusIndicator = document.getElementById('status-indicator');

window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('WebSocket connected');
    statusIndicator.textContent = 'Online';
    statusIndicator.style.backgroundColor = 'green';
});

window.Echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('WebSocket disconnected');
    statusIndicator.textContent = 'Offline';
    statusIndicator.style.backgroundColor = 'red';
});

window.Echo.connector.pusher.connection.bind('error', (err) => {
    console.error('WebSocket error:', err);
    statusIndicator.textContent = 'Error';
    statusIndicator.style.backgroundColor = 'orange';
});

window.Echo.channel('globe').listen('.IPLogged', (e) => {
    addPoint(e)
    emitArc(e)
})
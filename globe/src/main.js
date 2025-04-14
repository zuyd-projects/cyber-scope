import './css/style.css';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

import { globe } from './js/globeConfig.js'
import { fixedPoint } from './js/constants.js'
import { initEcho } from './js/ws.js'
import { checkTokenValid } from './js/auth.js'
import { getDevices, getSelectedDevices } from './js/devices.js'

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL = 'https://cyberscope.rickokkersen.nl/';

globe(document.getElementById('globeViz'))

globe.controls().autoRotate = false
globe.controls().enableZoom = true
globe.pointOfView(fixedPoint)

window.addEventListener('resize', () => {
    globe.width(window.innerWidth).height(window.innerHeight)
})

async function initializeApp() {
    // Dynamically load the config.js script
    const script = document.createElement('script');
    script.src = '/globe/config.js';
    document.head.appendChild(script);

    if (await checkTokenValid()) {
        initEcho(localStorage.getItem('accessToken'));
        getDevices();
    }
}

// Call the async function to initialize the app
initializeApp();
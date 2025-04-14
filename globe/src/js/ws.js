import Echo from 'laravel-echo'
import { updateDevice, isSelected } from './devices'
import { addPacket, addSSHRequest, addWinFirewallLog } from './functions'

export function initEcho(token) {
    console.log('Initializing WebSocket connection...')
    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: window.__CONFIG__.REVERB_APP_KEY ?? '',
        wsHost: window.__CONFIG__.REVERB_HOST ?? 'localhost',
        wsPort: window.__CONFIG__.REVERB_PORT ?? 8080,
        wssPort: window.__CONFIG__.REVERB_PORT ?? null,
        forceTLS: (window.__CONFIG__.REVERB_SCHEME ?? 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: 'https://cyberscope.rickokkersen.nl/broadcasting/auth',
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })
    addStatusListeners()
    setupChannels()
}

function addStatusListeners() {
    const statusIndicator = document.getElementById('status-indicator')

    window.Echo.connector.pusher.connection.bind('connected', () => {
        console.log('WebSocket connected')
        statusIndicator.textContent = 'Online'
        statusIndicator.style.backgroundColor = 'green'
    })

    window.Echo.connector.pusher.connection.bind('disconnected', () => {
        console.log('WebSocket disconnected')
        statusIndicator.textContent = 'Offline'
        statusIndicator.style.backgroundColor = 'red'
    })

    window.Echo.connector.pusher.connection.bind('error', (err) => {
        console.error('WebSocket error:', err)
        statusIndicator.textContent = 'Error'
        statusIndicator.style.backgroundColor = 'orange'
    })
}

function setupChannels() {
    const user_id = localStorage.getItem('user_id')

    window.Echo.private(`App.Models.User.${user_id}`).listen('.App\\Events\\DeviceUpdated', (e) => {
        console.log('Device updated:', e)
        updateDevice(e.device)
    }).listen('.App\\Events\\SSHRequestProcessed', (e) => {
        if (isSelected(e.sshRequest.device.id))
            addSSHRequest(e.sshRequest)
    }).listen('.App\\Events\\PacketProcessed', (e) => {
        if (isSelected(e.packet.device.id))
            addPacket(e.packet);
    }).listen('.App\\Events\\WinFirewallLogProcessed', (e) => {
        if (isSelected(e.winFirewallLog.device.id))
            addWinFirewallLog(e.winFirewallLog)
    })
}
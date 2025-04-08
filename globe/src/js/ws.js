import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: window.__CONFIG__.REVERB_APP_KEY ?? '',
    wsHost: window.__CONFIG__.REVERB_HOST ?? 'localhost',
    wsPort: window.__CONFIG__.REVERB_PORT ?? 8080,
    wssPort: window.__CONFIG__.REVERB_PORT ?? null,
    forceTLS: (window.__CONFIG__.REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
})
import windowsIcon from '../img/windows.png'
import linuxIcon from '../img/linux.png'
import unknownIcon from '../img/unknown.png'

export function getDevices() {
    // window.devices = {}
    const token = localStorage.getItem('accessToken')

    if (!token) {
        console.error('No token found in localStorage')
        return
    }

    fetch('https://cyberscope.rickokkersen.nl/api/devices', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            // Handle the data as needed
            data.forEach(device => {
                // window.devices[device.id] = device
                addDevice(device)
            })
            // setDevices()
        })
        .catch((err) => {
            console.error('Error:', err)
        })
}

function createOrUpdateDeviceElement(device) {
    let osIcon
    switch (device.os) {
        case 'Windows':
            osIcon = windowsIcon
            break
        case 'Linux':
            osIcon = linuxIcon
            break
        default:
            osIcon = unknownIcon
    }
    const statusClass = device.status ? 'green' : 'red'

    return `
        <div class="device-icon">
            <img src="${osIcon}" alt="${device.os}" />
        </div>
        <div class="device-info">
            <span class="device-name">${device.name}</span>
            <span class="device-status">
                <span class="status-dot ${statusClass}"></span> ${device.status ? 'Online' : 'Offline'}
            </span>
        </div>
    `
}

function addDevice(device) {
    const deviceList = document.getElementById('device-list')

    // Check if the device already exists on the data-device-id property
    const existingDevice = deviceList.querySelector(`[data-device-id="${device.id}"]`)
    if (existingDevice) {
        console.log('Device already exists:', device.id)
        return
    }

    const deviceElement = document.createElement('div')
    deviceElement.className = 'device selected'
    deviceElement.dataset.deviceId = device.id
    deviceElement.innerHTML = createOrUpdateDeviceElement(device)

    deviceElement.addEventListener('click', () => {
        deviceElement.classList.toggle('selected')
    })

    deviceList.appendChild(deviceElement)
}

export function updateDevice(device) {
    const deviceElement = document.querySelector(`[data-device-id="${device.id}"]`)
    if (deviceElement) {
        deviceElement.innerHTML = createOrUpdateDeviceElement(device)
    } else {
        addDevice(device)
    }
}

export function getSelectedDevices() {
    const selectedDevices = document.querySelectorAll('.device.selected')
    const selectedDeviceIds = Array.from(selectedDevices).map(device => device.dataset.deviceId)
    return selectedDeviceIds
}

export function isSelected(deviceId) {
    const selectedDevices = getSelectedDevices()
    return selectedDevices.includes(deviceId.toString())
}
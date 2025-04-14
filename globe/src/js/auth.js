export async function checkTokenValid() {
    const token = localStorage.getItem('accessToken')

    if (!token) {
        console.error('No token found in localStorage')
        return false
    }

    try {
        const res = await fetch('https://cyberscope.rickokkersen.nl/api/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })

        if (res.status === 200) {
            const user = await res.json()
            localStorage.setItem('user_id', user.id)
            return true
        } else {
            console.error('Failed to fetch user data')
            return false
        }
    } catch (err) {
        console.error('Error:', err)
        return false
    }
}
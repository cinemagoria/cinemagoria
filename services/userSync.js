
const config = {
    tursoBackendUrl: import.meta.env.VITE_TURSO_BACKEND_URL || 'https://entercinema-favorites.vercel.app'
};

export async function syncUserToTurso(user) {
    if (!user || !user.email) return;

    try {
        const response = await fetch(`${config.tursoBackendUrl}/api/users/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                first_name: user.name || user.first_name,
                avatar: user.avatar || user.picture
            })
        });

        if (!response.ok) {
            console.warn('User sync failed with status:', response.status);
        }
    } catch (error) {
        console.error('Error syncing user to Turso:', error);
    }
}

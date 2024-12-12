const clientId = '9d5ca11f50dc49a5925edb22d781d7c5'; // Remplace par ton Client ID
const redirectUri = 'https://oiilury.github.io/LuryFy'; // Par ex. http://localhost/callback
const scopes = 'user-read-recently-played user-top-read user-library-read';

document.getElementById('login-button').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
});

window.onload = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('stats-section').classList.remove('hidden');
        fetchSpotifyData(accessToken);
    }
};

async function fetchSpotifyData(token) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        displayStats(data);
    } catch (error) {
        console.error('Erreur lors de la récupération des données Spotify :', error);
    }
}

function displayStats(userData) {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
        <p><strong>Nom :</strong> ${userData.display_name}</p>
        <p><strong>Email :</strong> ${userData.email}</p>
        <p><strong>Pays :</strong> ${userData.country}</p>
        <p><strong>Abonnement :</strong> ${userData.product}</p>
    `;
}

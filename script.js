const clientId = '9d5ca11f50dc49a5925edb22d781d7c5'; // Remplace par ton Client ID
const redirectUri = 'https://oiilury.github.io/LuryFy'; // Par ex. http://localhost/callback
const scopes = 'user-read-email user-read-private user-read-recently-played user-top-read';


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
        // Profil utilisateur
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userResponse.json();

        // Top artistes, morceaux, albums
        const topArtists = await fetchSpotifyTop(token, 'artists');
        const topTracks = await fetchSpotifyTop(token, 'tracks');
        const topGenres = extractTopGenre(topArtists);

        // Affichage des données
        displayUserCard(userData);
        displayTopStats(topArtists, topTracks, topGenres);
    } catch (error) {
        console.error('Erreur lors de la récupération des données Spotify :', error);
    }
}

async function fetchSpotifyTop(token, type) {
    const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
}

function extractTopGenre(artistsData) {
    const genreCounts = {};
    artistsData.items.forEach(artist => {
        artist.genres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
    });
    return Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0] || 'Non disponible';
}

function displayUserCard(user) {
    document.getElementById('user-name').textContent = user.display_name || 'Non disponible';
    document.getElementById('user-image').src = user.images[0]?.url || 'default-avatar.png';
}

function displayTopStats(artistsData, tracksData, topGenre) {
    const topArtistsList = document.getElementById('top-artists');
    const topTracksList = document.getElementById('top-tracks');
    const topAlbumsList = document.getElementById('top-albums');

    artistsData.items.forEach(artist => {
        const li = document.createElement('li');
        li.textContent = artist.name;
        topArtistsList.appendChild(li);
    });

    tracksData.items.forEach(track => {
        const li = document.createElement('li');
        li.textContent = `${track.name} - ${track.artists[0].name}`;
        topTracksList.appendChild(li);
    });

    document.getElementById('top-genre').textContent = topGenre || 'Non disponible';
}   
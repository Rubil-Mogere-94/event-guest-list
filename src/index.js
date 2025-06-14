document.addEventListener('DOMContentLoaded', () => {
    const artistForm = document.getElementById('artist-form');
    const artistNameInput = document.getElementById('artist-name');
    const artistGenreSelect = document.getElementById('artist-genre');
    const artistList = document.getElementById('artist-list');
    const artistCountDisplay = document.getElementById('artist-count');
    
    let artists = [];
    const MAX_ARTISTS = 10;
    
    // Load artists from localStorage if available
    loadArtists();
    
    // Form submission handler
    artistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = artistNameInput.value.trim();
        const genre = artistGenreSelect.value;
        
        if (!name) {
            alert('Please enter an artist name');
            return;
        }
        
        if (artists.length >= MAX_ARTISTS) {
            alert(`Maximum of ${MAX_ARTISTS} artists allowed in this festival lineup!`);
            return;
        }
        
        const newArtist = {
            id: Date.now(),
            name,
            genre,
            confirmed: true,
            timestamp: new Date(),
            isEditing: false
        };
        
        artists.push(newArtist);
        saveArtists();
        renderArtistList();
        
        // Reset form
        artistNameInput.value = '';
        artistNameInput.focus();
    });
    
    // Render the artist list
    function renderArtistList() {
        artistList.innerHTML = '';
        
        artists.forEach(artist => {
            const artistItem = document.createElement('li');
            artistItem.className = 'artist-item new-artist';
            
            if (artist.isEditing) {
                artistItem.innerHTML = `
                    <div class="artist-info">
                        <input type="text" class="edit-artist-input" value="${artist.name}">
                        <select class="edit-artist-genre">
                            <option value="traditional" ${artist.genre === 'traditional' ? 'selected' : ''}>🥁 Traditional</option>
                            <option value="band" ${artist.genre === 'band' ? 'selected' : ''}>🎺 Band</option>
                            <option value="choir" ${artist.genre === 'choir' ? 'selected' : ''}>🎤 Choir</option>
                            <option value="solo" ${artist.genre === 'solo' ? 'selected' : ''}>🎹 Solo</option>
                        </select>
                    </div>
                    <div class="artist-actions">
                        <button class="action-button save-btn">💾</button>
                        <button class="action-button cancel-btn">❌</button>
                    </div>
                `;
                
                const saveBtn = artistItem.querySelector('.save-btn');
                const cancelBtn = artistItem.querySelector('.cancel-btn');
                const editInput = artistItem.querySelector('.edit-artist-input');
                const editGenre = artistItem.querySelector('.edit-artist-genre');
                
                saveBtn.addEventListener('click', () => {
                    const newName = editInput.value.trim();
                    if (newName) {
                        artist.name = newName;
                        artist.genre = editGenre.value;
                        artist.isEditing = false;
                        saveArtists();
                        renderArtistList();
                    }
                });
                
                cancelBtn.addEventListener('click', () => {
                    artist.isEditing = false;
                    renderArtistList();
                });
            } else {
                artistItem.innerHTML = `
                    <div class="artist-info">
                        <span class="artist-name">${artist.name}</span>
                        <span class="artist-genre ${artist.genre}">${
                            artist.genre === 'traditional' ? '🥁 Traditional' :
                            artist.genre === 'band' ? '🎺 Band' :
                            artist.genre === 'choir' ? '🎤 Choir' : '🎹 Solo'
                        }</span>
                        <span class="status ${artist.confirmed ? 'confirmed' : 'pending'}">
                            ${artist.confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                        <div class="artist-time">Added: ${formatTime(artist.timestamp)}</div>
                    </div>
                    <div class="artist-actions">
                        <button class="action-button confirm-btn">${artist.confirmed ? '✅' : '❌'}</button>
                        <button class="action-button edit-btn">✏️</button>
                        <button class="action-button delete-btn">🗑️</button>
                    </div>
                `;
                
                // Add event listeners to action buttons
                const deleteBtn = artistItem.querySelector('.delete-btn');
                const confirmBtn = artistItem.querySelector('.confirm-btn');
                const editBtn = artistItem.querySelector('.edit-btn');
                
                deleteBtn.addEventListener('click', () => {
                    artists = artists.filter(a => a.id !== artist.id);
                    saveArtists();
                    renderArtistList();
                });
                
                confirmBtn.addEventListener('click', () => {
                    artist.confirmed = !artist.confirmed;
                    saveArtists();
                    renderArtistList();
                });
                
                editBtn.addEventListener('click', () => {
                    artist.isEditing = true;
                    renderArtistList();
                });
            }
            
            artistList.appendChild(artistItem);
            
            // Remove new-artist class after animation completes
            setTimeout(() => {
                artistItem.classList.remove('new-artist');
            }, 500);
        });
        
        // Update artist count display
        artistCountDisplay.textContent = `${artists.length}/${MAX_ARTISTS}`;
    }
    
    // Format time for display
    function formatTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
    
    // Save artists to localStorage
    function saveArtists() {
        localStorage.setItem('festivalArtists', JSON.stringify(artists));
    }
    
    // Load artists from localStorage
    function loadArtists() {
        const savedArtists = localStorage.getItem('festivalArtists');
        if (savedArtists) {
            try {
                artists = JSON.parse(savedArtists);
                // Convert string dates back to Date objects
                artists.forEach(artist => {
                    artist.timestamp = new Date(artist.timestamp);
                });
                renderArtistList();
            } catch (e) {
                console.error('Failed to parse saved artists', e);
            }
        }
    }
    
    // Initial render
    renderArtistList();
});
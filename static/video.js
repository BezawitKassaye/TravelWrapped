// Retrieve stored locations (objects containing name and coordinates) from localStorage
const storedLocations = JSON.parse(localStorage.getItem('locations'));
console.log("Stored Locations:", storedLocations); // Log to verify the data

// Check if locations are valid
if (!storedLocations) {
  alert('No locations data found in localStorage.');
  window.location.href = 'index.html';
  throw new Error('No locations data found.');
}

if (storedLocations.length < 2) {
  alert('Insufficient locations found. Returning to the main page.');
  window.location.href = 'index.html';
  throw new Error('Invalid locations data');
}

// Initialize the map with the first location's coordinates
const map = L.map('map', { zoomControl: false }).setView(storedLocations[0].coords, 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Function to animate transitions
async function animateTravel(locations) {
  try {
    // Add markers for all locations using both name and coordinates
    locations.forEach(location => {
      const { coords, location: locationName } = location;
      L.marker(coords).addTo(map)
        .bindPopup(locationName);  // Show name in the popup
    });

    // Draw path between locations
    const pathLine = L.polyline(locations.map(location => location.coords), {
      color: '#4CAF50',
      weight: 3,
      opacity: 0.7
    }).addTo(map);

    // Animate through each location
    for (let i = 0; i < locations.length; i++) {
      await new Promise((resolve) => {
        map.flyTo(locations[i].coords, 8, {
          duration: 3,
          complete: resolve
        });
      });
      // Wait additional time at each location
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Final zoom out to show complete path
    await new Promise((resolve) => {
      map.flyTo([0, 0], 2, {
        duration: 3,
        complete: resolve
      });
    });
  } catch (error) {
    console.error('Animation error:', error);
    alert('Error during animation. Please try again.');
  }
}

// Start the animation when the page loads
animateTravel(storedLocations);

// Handle "Download Video" button
document.getElementById('downloadVideo').addEventListener('click', () => {
  alert('Mock video download initiated! This requires backend video generation.');
  // Implement true video export on the backend if needed.
});

// Handle "Go Back" button
document.getElementById('goBack').addEventListener('click', () => {
  window.location.href = 'index.html';
});

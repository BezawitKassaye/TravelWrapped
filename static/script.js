const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const locations = [];
const locationInput = document.getElementById('location');
const addLocationButton = document.getElementById('addLocation');
const statsDisplay = document.getElementById('stats');
const locationsList = document.getElementById('locations');
const createVideoButton = document.getElementById('createVideo');

function updateStats() {
  statsDisplay.textContent = `Total Locations: ${locations.length}`;
  createVideoButton.disabled = locations.length < 2;
}

function renderLocationList() {
  locationsList.innerHTML = '';
  locations.forEach((entry, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = entry.location;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeLocation(index));
    listItem.appendChild(removeButton);
    locationsList.appendChild(listItem);
  });
}

function addMarker(location, coords) {
  const marker = L.marker(coords).addTo(map);
  marker.bindPopup(location).openPopup();
  return marker;
}

function removeLocation(index) {
  const { marker } = locations[index];
  if (marker) {
    map.removeLayer(marker);
  }
  locations.splice(index, 1);
  updateStats();
  renderLocationList();
}

locationInput.addEventListener('input', () => {
  addLocationButton.disabled = !locationInput.value.trim();
});

addLocationButton.addEventListener('click', async () => {
  const location = locationInput.value.trim();
  if (!location) {
    alert('Please enter a location!');
    return;
  }
  addLocationButton.disabled = true;
  addLocationButton.textContent = 'Adding...';

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const coords = [parseFloat(lat), parseFloat(lon)];
      const marker = addMarker(display_name, coords);

      locations.push({
        location: display_name || location,
        coords: [lat,lon],
      });

      map.setView(coords, 6);

      updateStats();
      renderLocationList();
      // locationInput.value = '';
    } else {
      alert('Location not found! Please try a different location name.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Could not fetch location. Please try again!');
  } finally {
    addLocationButton.disabled = false;
    addLocationButton.textContent = 'Add';
  }
  // localStorage.setItem('locations', JSON.stringify(locations));

});

createVideoButton.addEventListener('click', () => {
  if (locations.length < 2) {
    alert('Add at least two locations to create a travel wrapped!');
    return;
  }
  try {
    // console.log("Saving locations:", coordsArray);  // Debugging log
    localStorage.setItem('locations', JSON.stringify(locations));
    window.location.href = 'video.html';  // Redirect to video creation page
  } catch (error) {
    console.error('Error saving locations:', error);
    alert('Error saving locations. Please try again.');
  }
});
  // Store only the coordinates array for the animation
//   const coordsArray = locations.map(loc => loc.coords);
//   try {
//     console.log("Saving locations:", coordsArray);  // Debugging log
//     localStorage.setItem('locations', JSON.stringify(coordsArray));  // Save coordinates in localStorage
//     window.location.href = 'video.html';  // Redirect to video creation page
//   } catch (error) {
//     console.error('Error saving locations:', error);
//     alert('Error saving locations. Please try again.');
//   }
// });

import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address') as HTMLInputElement;

const GOOGLE_API_KEY = '';

type GoogleGeoCodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[],
  status: 'OK' | 'ZERO_RESULTS'
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const address = encodeURI(addressInput.value);

  axios.get<GoogleGeoCodingResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${ address }&key=${ GOOGLE_API_KEY }`
  )
    .then(response => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not fetch location!');
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 16
      });
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch(error => {
      console.log(error);
      alert(error.message);
    });
}

form.addEventListener('submit', searchAddressHandler);

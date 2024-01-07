
const url = 'http://127.0.0.1:5000/rect'; // Replace with your actual API endpoint

const postData = {
  title: 'Example Post',
  body: 'This is the body of the post.',
  url: "https://upcdn.io/kW15bkb/raw/uploads/2023/11/03/4m44ordTDV-cyberpunk-skyscraper-upside-down-animated-movies-wallpaper-preview.jpg"
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
})
  .then(response => response.json())
  .then(data => {
    console.log('Post created:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
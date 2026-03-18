const POSTER_CLONE_URL = 'http://localhost:5173'; // Change to deployed URL

document.getElementById('openApp').addEventListener('click', () => {
    chrome.tabs.create({ url: POSTER_CLONE_URL + '/external' });
});

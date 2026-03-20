const POSTER_CLONE_URL = 'https://poster-clone.onrender.com'; // Production URL

document.getElementById('openApp').addEventListener('click', () => {
    chrome.tabs.create({ url: POSTER_CLONE_URL + '/external' });
});

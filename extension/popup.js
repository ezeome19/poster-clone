const POSTER_CLONE_URL = 'https://poster-clone-eight.vercel.app'; // Production URL

document.getElementById('openApp').addEventListener('click', () => {
    chrome.tabs.create({ url: POSTER_CLONE_URL + '/external' });
});

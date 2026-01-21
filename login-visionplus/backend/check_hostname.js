const axios = require('axios');

const URL = 'https://vz-579059.b-cdn.net/ce07ee66-a348-4f43-a53b-ac570a8905fa/playlist.m3u8';

async function check() {
    try {
        console.log("Checking with Referer:", URL);
        const response = await axios.head(URL, {
            headers: {
                'Referer': 'https://visionplus-final-production-bb72.up.railway.app/'
            }
        });
        console.log("Status:", response.status);
    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) console.log("Status:", e.response.status);
    }
}

check();

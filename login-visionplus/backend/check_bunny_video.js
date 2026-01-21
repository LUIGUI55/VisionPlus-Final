const axios = require('axios');
const fs = require('fs');

const LIB_ID = '579059';
const API_KEY = '9bdde05c-b0c8-4523-bdca349ef3f6-9d1a-4dcc';
const VIDEO_ID = 'ce07ee66-a348-4f43-a53b-ac570a8905fa';

async function check() {
    try {
        const response = await axios.get(`https://video.bunnycdn.com/library/${LIB_ID}/videos/${VIDEO_ID}`, {
            headers: { 'AccessKey': API_KEY }
        });
        fs.writeFileSync('bunny_response.json', JSON.stringify(response.data, null, 2));
        console.log("Done writing bunny_response.json");
    } catch (e) {
        console.error("Error:", e.message);
    }
}

check();

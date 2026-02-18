const https = require('https');

const url = 'https://dns.google/resolve?name=_mongodb._tcp.xappeedb.qd91bec.mongodb.net&type=SRV';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.Answer) {
                console.log("\n✅ SRV Record Resolved:");
                json.Answer.forEach(ans => {
                    console.log(`- ${ans.data}`);
                });
            } else {
                console.log("\n❌ No SRV records found in the response.");
                console.log("Full Response:", data);
            }
        } catch (e) {
            console.error("Failed to parse JSON:", e.message);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (err) => {
    console.error("Request failed:", err.message);
});

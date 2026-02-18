const dns = require('dns').promises;

const clusterId = "qd91bec";
const clusterName = "xappeedb";

const prefixes = ["xappeedb", "cluster0", "main", "ac-qd91bec"];
const variations = [
    (p) => `${p}-shard-00-00.${clusterId}.mongodb.net`,
    (p) => `${p}-shard-00-01.${clusterId}.mongodb.net`,
    (p) => `${p}-shard-00-02.${clusterId}.mongodb.net`
];

async function probe() {
    console.log("Probing common shard name patterns...");
    
    for (const prefix of prefixes) {
        for (const variation of variations) {
            const hostname = variation(prefix);
            try {
                const addresses = await dns.resolve4(hostname);
                console.log(`✅ FOUND: ${hostname} -> ${addresses.join(', ')}`);
            } catch (e) {
                // Silently skip
            }
        }
    }
    console.log("Probe finished.");
}

probe();

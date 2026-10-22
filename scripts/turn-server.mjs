// Local TURN relay for when devices can't connect to each other directly
// (common on phone hotspots / mobile networks). Run with: npm run turn
// Needs inbound UDP 3478 and UDP 49160-49200 allowed in the firewall.
import Turn from "node-turn";

const user = process.env.TURN_USERNAME || "rtavc";
const pass = process.env.TURN_PASSWORD || "rtavc-local";

const server = new Turn({
  authMech: "long-term",
  credentials: { [user]: pass },
  realm: "rtavc",
  listeningPort: 3478,
  minPort: 49160,
  maxPort: 49200,
  debugLevel: "ERROR",
});

server.start();
console.log(`TURN server listening on UDP 3478 (relay ports 49160-49200), user "${user}"`);

import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error("Production build output is unavailable.");
const files = fs.readdirSync(path.join(dist, "assets")).filter((file) => file.endsWith(".js"));
const bundle = files.map((file) => fs.readFileSync(path.join(dist, "assets", file), "utf8")).join("\n");
for (const required of ["0.10.0-i10-convergence", "us-v0-production-game-projection-1", "U.S. Governing Simulation"]) {
  if (!bundle.includes(required)) throw new Error(`Built application lacks production U.S. runtime marker ${required}.`);
}
for (const forbidden of ["Legacy GL0 Development Harness", "GL0_SYNTHETIC_CONFIGURATION", "createDeterministicWorldFixture"]) {
  if (bundle.includes(forbidden)) throw new Error(`Built application contains quarantined legacy marker ${forbidden}.`);
}
console.log(`Built production application verified across ${files.length} JavaScript bundle(s): U.S. runtime, no GL0 boot markers.`);

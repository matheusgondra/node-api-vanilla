import pg from "pg";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Client } = pg;
const client = new Client();

async function runMigrations() {
	await client.connect();

	await client.query(`CREATE TABLE IF NOT EXISTS migrations (id SERIAL PRIMARY KEY, name TEXT UNIQUE)`);

	const appliedMigrations = await client.query("SELECT name FROM migrations");
	const appliedNames = appliedMigrations.rows.map((row) => row.name);

	const migrationFiles = readdirSync("migrations")
		.sort()
		.filter(file => file.endsWith(".sql"));

	for (const file of migrationFiles) {
		if (!appliedNames.includes(file)) {
			console.log(`Applying migration: ${file}`);
			const filePath = join(__dirname, file);
			const content = readFileSync(filePath, { encoding: "utf-8" });
			await client.query(content);
			await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
		}
	}

	console.log("Migrations complete.");
	await client.end();
}

runMigrations().catch(console.error);

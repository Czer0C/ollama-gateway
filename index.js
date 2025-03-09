const cors = require('cors');
const express = require('express');
const app = express();
const port = 3002;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello, World!');
});

app.post("/chat", async (req, res) => {

	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Transfer-Encoding", "chunked");


	if (!req.body?.prompt) {
		res.status(400).send("Missing prompt");
		return;
	}

	const startTime = new Date();

	const log = `Received request with prompt: **${req.body.prompt}** at ${startTime.toISOString()}`;

	console.log(log)

	try {
		// const controller = new AbortController();

		// const { signal } = controller;

		// req.on("close", () => {
		// 	console.log(`Client disconnected. Aborting request. ${new Date().toISOString()}`);
		// 	controller.abort();
		// });

		const response = await fetch('http://localhost:11434/api/generate', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "llama3.2",
				prompt: req.body.prompt,
				stream: true,
			}),
			// signal
		});

		if (!response.body) {
			res.status(500).send("No response from Ollama");

			return;
		}

		const reader = response.body.getReader();

		const decoder = new TextDecoder();

		while (true) {
			const { value, done } = await reader.read();

			if (done) break;

			res.write(decoder.decode(value, { stream: true }));
		}

		console.log(`Finished streaming response at ${new Date().toISOString()}, elapsed time: ${new Date() - startTime}ms`);

		res.end();
	} catch (error) {
		if (error.name === "AbortError") {
			console.log("Stream aborted");
		} else {
			console.error("Error streaming from Ollama:", error);
			res.status(500).send("Error fetching from Ollama");
		}
	}
});

app.use((req, res) => {
	console.error(`404 Error: ${req.method} ${req.originalUrl}`);

	res.status(404).json({ error: `404 Error: ${req.method} ${req.originalUrl}` });
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
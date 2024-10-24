const path = require("path");
const fastify = require("fastify")({
  logger: true,  // Enable logging for debugging
});

// Setup static file serving
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", 
});

// Parse incoming forms and JSON
fastify.register(require("@fastify/formbody"));

// Home route (GET)
fastify.get("/", function (request, reply) {
  reply.send({ message: "Welcome to the Receive Task API" });
});

// Simulate an async I/O operation (e.g., database query or external API call)
async function asyncOperation(externalData) {
  // Simulate a delay for an async operation (e.g., network request, database access)
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay
  return externalData.length; // Return length of the external data as a simple example
}

// Create the /receive_task POST API route
fastify.post("/receive_task", async function (request, reply) {
  try {
    // Step 1: Extract data from the incoming POST request
    const { task_id, external_data, external_reference_id, system_name } = request.body;

    // Step 2: Validate the required fields
    if (!task_id || !external_data) {
      return reply.status(400).send({ error: "task_id and external_data are required" });
    }

    // Step 3: Simulate an async operation (e.g., processing external_data)
    const characterCount = await asyncOperation(external_data);

    // Step 4: Build the response object
    const responseData = {
      task_id,
      external_data,
      external_reference_id: external_reference_id || "N/A", // Optional field
      system_name: system_name || "External System", // Optional field
      character_count: characterCount, // Result of async operation
      timestamp: new Date().toISOString(),
      status: "Received", // Task status
    };

    // Step 5: Send the response
    reply.status(200).send(responseData);

  } catch (error) {
    // Handle any unexpected errors
    console.error("Error processing task:", error);
    reply.status(500).send({ error: "An error occurred while processing the task." });
  }
});

// Run the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Server running at http://localhost:3000/");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

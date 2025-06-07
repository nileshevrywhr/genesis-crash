const express = require("express");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for Genesis Cloud API - Get instances
app.get("/api/genesis/instances", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header is required",
      });
    }

    console.log("Proxying request to Genesis Cloud API...");

    // Make HTTPS request using Node.js built-in module
    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.genesiscloud.com",
        port: 443,
        path: "/compute/v1/instances",
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Genesis-Cloud-Mobile-App/1.0",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            data: data,
            ok: res.statusCode >= 200 && res.statusCode < 300,
          });
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      req.end();
    });

    console.log(
      `Genesis Cloud API responded with status: ${response.statusCode}`
    );

    if (!response.ok) {
      return res.status(response.statusCode).json({
        error: `Genesis Cloud API error: ${response.statusCode} ${response.statusMessage}`,
        details: response.data,
      });
    }

    // Try to parse as JSON, fallback to text if it fails
    let jsonData;
    try {
      jsonData = JSON.parse(response.data);
    } catch (parseError) {
      jsonData = { raw_response: response.data };
    }

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Proxy server error:", error);
    res.status(500).json({
      error: "Proxy server error",
      details: error.message,
    });
  }
});

// Proxy endpoint for Genesis Cloud API - Instance actions
app.post("/api/genesis/instances/:instanceId/actions", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const { instanceId } = req.params;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization header is required",
      });
    }

    if (!instanceId) {
      return res.status(400).json({
        error: "Instance ID is required",
      });
    }

    // Get the action from request body, default to "start" for backward compatibility
    const action = req.body?.action || "start";

    console.log(`Proxying instance action "${action}" for: ${instanceId}`);

    // Prepare the request body
    const requestBody = JSON.stringify({ action });

    // Make HTTPS request using Node.js built-in module
    const response = await new Promise((resolve, reject) => {
      const options = {
        hostname: "api.genesiscloud.com",
        port: 443,
        path: `/compute/v1/instances/${instanceId}/actions`,
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Genesis-Cloud-Mobile-App/1.0",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            data: data,
            ok: res.statusCode >= 200 && res.statusCode < 300,
          });
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      // Write the request body
      req.write(requestBody);
      req.end();
    });

    console.log(
      `Genesis Cloud API responded with status: ${response.statusCode}`
    );

    if (!response.ok) {
      return res.status(response.statusCode).json({
        error: `Genesis Cloud API error: ${response.statusCode} ${response.statusMessage}`,
        details: response.data,
      });
    }

    // Try to parse as JSON, fallback to text if it fails
    let jsonData;
    try {
      jsonData = JSON.parse(response.data);
    } catch (parseError) {
      jsonData = { raw_response: response.data };
    }

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Proxy server error:", error);
    res.status(500).json({
      error: "Proxy server error",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Genesis Cloud Proxy Server is running" });
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `🚀 Genesis Cloud Proxy Server running on http://localhost:${PORT}`
  );
  console.log(`📡 Proxying requests to Genesis Cloud API`);
  console.log(
    `🔗 Use http://localhost:${PORT}/api/genesis/instances for API calls`
  );
});

module.exports = app;

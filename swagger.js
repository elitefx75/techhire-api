const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Generate dynamic swagger spec with correct server URLs
const generateSwaggerSpec = () => {
    const port = process.env.PORT || 4000;
    const host = process.env.HOST || "0.0.0.0";
    const displayHost = host === "0.0.0.0" ? "localhost" : host;
    const isProduction = process.env.NODE_ENV === "production";

    // Get base URL based on environment
    let servers = [];

    // Add production server if Render URL is available
    if (process.env.RENDER_EXTERNAL_URL) {
        const renderUrl = process.env.RENDER_EXTERNAL_URL.trim().replace(/\/$/, "");
        servers.push({
            url: renderUrl,
            description: "Production server (Render)"
        });
    }

    // Add local development server
    const localUrl = `http://${displayHost}:${port}`;
    servers.push({
        url: localUrl,
        description: "Local development server"
    });

    // Use at least one server
    if (servers.length === 0) {
        servers.push({
            url: `http://localhost:${port}`,
            description: "Default server"
        });
    }

    // Create a modified swagger spec with dynamic servers
    const dynamicSpec = {
        ...swaggerDocument,
        servers: servers
    };

    return dynamicSpec;
};

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(generateSwaggerSpec(), {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'TechHire API Docs'
    })
};


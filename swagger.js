const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

module.exports = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(swaggerDocument, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'TechHire API Docs'
    })
};

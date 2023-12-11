
const swaggerConfig = {
    "openapi": "3.0.3",
    "info": {
      "title": "Fils API doc",
      "contact": {
        "email": "contact@fils.com"
      },
      "version": "0.0.0.9"
    },
    "servers": [
      {
        "url": process.env.BASE_URL
      }
    ],
    "tags": [
      {
        "name": "Organizations",
        "description": "Get list of organizations",
        "externalDocs": {
          "description": "",
          "url": "#"
        }
      },
      {
        "name": "Points",
        "description": "Access to points",
        "externalDocs": {
          "description": "",
          "url": "#"
        }
      }
    ],
    "paths": {
      "/v1/organizations": {
        "get": {
          "tags": [
            "Organizations"
          ],
          "parameters": [
            {
              "in": "body",
              "name": "body",
              "description": "To get list of all organizations",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Organizations"
              }
            }
          ],
          "summary": "Returns all organizations",
          "description": "",
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessOrganizations"
                  }
                }
              }
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      },
      "/v1/points/transfer": {
        "post": {
          "tags": [
            "Points"
          ],
          "parameters": [
            {
              "in": "body",
              "name": "body",
              "description": "To transfer the points need valid data",
              "required": true,
              "schema": {
                "$ref": "#/definitions/Points"
              }
            }
          ],
          "summary": "Returns initiated points status",
          "description": "",
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessPoints"
                  }
                }
              }
            }
          },
          "security": [
            {
              "ApiKeyAuth": []
            }
          ]
        }
      }
      
    },
    "definitions": {
      "Organizations": {
        "type": "object",
        "xml": {
          "name": "Organizations"
        }
      },
      "Points": {
        "type": "object",
        "required": [
          "refId",
          "amount",
          "orgId",
          "transferTo",
          "organizationId"
        ],
        "properties": {
          "refId": {
            "type": "string",
            "example": "1001"
          },
          "amount": {
            "type": "integer",
            "example": 100
          },
          "customerId": {
            "type": "string",
            "example": "1001"
          },
          "organizationId": {
            "type": "string",
            "example": "80"
          },
          "transferTo": {
            "type": "string",
            "example": "74"
          },
          "orgId": {
            "type": "string",
            "example": "643e6098980313251092595d"
          }
        },
        "xml": {
          "name": "Points"
        }
      }
    },
    "components": {
      "schemas": {
        "Points": {
          "type": "object",
          "properties": {
            "amount": {
              "type": "integer",
              "example": 100
            },
            "refId": {
              "type": "string",
              "example": "10001"
            },
            "organizationId": {
              "type": "string",
              "example": "643e6098980313251092595d"
            },
            "customerId": {
              "type": "string",
              "example": "10002"
            },
            "orgId": {
              "type": "string",
              "example": "80"
            },
            "transferTo": {
              "type": "string",
              "example": "74"
            }
          }
        },
        "SuccessPoints": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "64364faff6b2a708f8580e68"
            }
          },
          "xml": {
            "name": "Points"
          }
        },
        "SuccessOrganizations": {
          "type": "object",
          "properties": {
            "_id": {
              "type": "string",
              "example": "64422bb423f723384b002ffe"
            },
            "organizationId": {
              "type": "string",
              "example": "11"
            },
            "name": {
              "type": "string",
              "example": "Hdfc Group"
            },
            "desc": {
              "type": "string",
              "example": "testing"
            }
          },
          "xml": {
            "name": "Organizations"
          }
        }
      },
      "requestBodies": {
        "Points": {
          "description": "Pet object that needs to be added to the points",
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Points"
              }
            },
            "application/xml": {
              "schema": {
                "$ref": "#/components/schemas/Points"
              }
            }
          }
        }
      },
      "securitySchemes": {
        "ApiKeyAuth": {
          "type": "apiKey",
          "name": "x-api-key",
          "in": "header"
        }
      }
    }
  }

  
module.exports = swaggerConfig
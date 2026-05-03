import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "0.0.1",
    title: "Dokumentasi API Acara",
    description: "Dokumentasi API Acara",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://back-end-acara-psi-five.vercel.app/api",
      description: "Deploy Server",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      }
    },
    schemas: {
      LoginRequest: {
        identifier: "syahzl",
        password: "12345678"
      },
      RegisterRequest: {
        fullName: "Syahrul R",
        username: "syahzl",
        email: "syahzl@gmail.com",
        password: "12345678",
        confirmPassword: "12345678"
      },
      ActivationRequest: {
        code: "abcdef"
      }
    }
  }
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

// backend connection
export const API_URL = import.meta.env.VITE_EXPRESS_API_URL || "http://localhost:3000" || 'http://fullstack_backend:3000';
// ;

export const API_ENDPOINTS = {

    WELCOME_API : "/",
    // Initital Setup Endpoints from backend
    GET_DATA: "/initialSetup", 
    POST_DATA: "/initialSetup", 
    PUT_DATA: "/initialSetup/:id", 
    DELETE_DATA: "/initialSetup/:id", 

    // Add more endpoints as needed
  };

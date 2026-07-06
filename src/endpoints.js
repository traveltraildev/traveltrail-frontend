// src/endpoints.js — single source of truth for API endpoints
export const BASE_URL = process.env.REACT_APP_API_BASE;

export const getAllTrips = BASE_URL + "/api/trips";
export const getAllAccommodations = BASE_URL + "/api/accommodations";
export const sheetProxy = BASE_URL + "/api/sheets-proxy";
export const adminCheckout = BASE_URL + "/api/admin/check-auth";
export const adminLoginPath = BASE_URL + "/api/admin/login";
export const aboutUsPage = BASE_URL + "/api/cms/pages/about-us";
export const contactUsPage = BASE_URL + "/api/cms/pages/contact-us";
export const tacPage = BASE_URL + "/api/cms/pages/terms-and-conditions";
export const getUserBookingHistory = BASE_URL + "/api/bookings/history";

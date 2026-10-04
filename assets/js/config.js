/**
 * VOYAGR · config.js
 * Global constants: app metadata, currency table, transport fare model
 * Designed & developed by Nikhil Chary Sriramoju
 */
const APP = { name: "VOYAGR", version: "4.0.0", author: "Nikhil Chary Sriramoju" };
// Approximate INR per 1 unit of currency (used for fares + budget feasibility)
const FX = { INR: 1, USD: 85, EUR: 92, GBP: 108 };
// Distance-based fare model (INR). Estimates only, not live prices.
const MODES = [
  { id: "flight", icon: "✈️", name: "Flight",           fixed: 2400, perKm: 4.2,  speed: 720, overhead: 3.2, minKm: 400 },
  { id: "train",  icon: "🚆", name: "Train (3AC)",      fixed: 120,  perKm: 1.55, speed: 52,  overhead: 0.8, maxKm: 2800 },
  { id: "bus",    icon: "🚌", name: "AC Sleeper Bus",   fixed: 80,   perKm: 1.8,  speed: 46,  overhead: 0.4, maxKm: 1800 },
  { id: "car",    icon: "🚗", name: "Cab / Self-drive", perVehicle: 13, speed: 55, overhead: 0, maxKm: 2000 },
];

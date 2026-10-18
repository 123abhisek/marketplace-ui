// src/config/vehicleFields.js

/**
 * 8 Canonical Vehicle Types matching user category dropdown
 */
export const VEHICLE_CATEGORIES = [
  "Car / SUV / Sedan / Hatchback",
  "Bike / Motorcycle",
  "Scooter / Scooty",
  "Commercial / Pickup / Truck",
  "Tractor / Farm Equipment",
  "Electric Vehicle (EV)",
  "Auto Rickshaw / 3-Wheeler",
  "Other Vehicle",
];

export const CANONICAL_VEHICLE_OPTIONS = [
  { label: "Car / SUV / Sedan / Hatchback", value: "Car / SUV / Sedan / Hatchback" },
  { label: "Bike / Motorcycle", value: "Bike / Motorcycle" },
  { label: "Scooter / Scooty", value: "Scooter / Scooty" },
  { label: "Commercial / Pickup / Truck", value: "Commercial / Pickup / Truck" },
  { label: "Tractor / Farm Equipment", value: "Tractor / Farm Equipment" },
  { label: "Electric Vehicle (EV)", value: "Electric Vehicle (EV)" },
  { label: "Auto Rickshaw / 3-Wheeler", value: "Auto Rickshaw / 3-Wheeler" },
  { label: "Other Vehicle", value: "Other Vehicle" },
];

/**
 * Normalizes input string to one of the 8 canonical vehicle types.
 */
export function normalizeVehicleCategory(input) {
  if (!input) return "Car / SUV / Sedan / Hatchback";
  const str = String(input).trim().toLowerCase();

  if (str.includes("car") || str.includes("suv") || str.includes("sedan") || str.includes("hatchback")) {
    return "Car / SUV / Sedan / Hatchback";
  }
  if (str.includes("scooter") || str.includes("scooty") || str.includes("moped")) {
    return "Scooter / Scooty";
  }
  if (str.includes("bike") || str.includes("motorcycle") || str.includes("two-wheeler") || str.includes("two wheeler")) {
    return "Bike / Motorcycle";
  }
  if (str.includes("commercial") || str.includes("pickup") || str.includes("truck") || str.includes("lorry") || str.includes("bus")) {
    return "Commercial / Pickup / Truck";
  }
  if (str.includes("tractor") || str.includes("farm")) {
    return "Tractor / Farm Equipment";
  }
  if (str.includes("electric") || str.includes("ev")) {
    return "Electric Vehicle (EV)";
  }
  if (str.includes("auto") || str.includes("rickshaw") || str.includes("3-wheeler") || str.includes("three wheeler")) {
    return "Auto Rickshaw / 3-Wheeler";
  }
  return "Other Vehicle";
}

/**
 * Standard Legal & Verification Checklist for Vehicles
 */
export const VEHICLE_CHECKLIST = [
  { key: "clear_title", label: "Clear Title / Hypothecation Free / NOC Ready", type: "yesno" },
  { key: "rc_original", label: "Original RC Book Available", type: "yesno" },
  { key: "insurance_active", label: "Insurance Actively Valid", type: "yesno" },
  { key: "service_history", label: "Complete Authorized Service History Available", type: "yesno" },
  { key: "road_tax_paid", label: "Lifetime / Up-to-date Road Tax Paid", type: "yesno" },
  { key: "spare_key", label: "Original Spare / Duplicate Key Available", type: "yesno" },
  { key: "accidental_free", label: "Non-Accidental / No Major Dent or Damage", type: "yesno" },
  { key: "loan_pending", label: "Vehicle Loan Pending", type: "yesno_amount" },
];

/**
 * Category-Specific Declarative Configurations
 */
export const VEHICLE_CATEGORY_CONFIG = {
  "Car / SUV / Sedan / Hatchback": {
    specificFields: [
      {
        name: "body_type",
        label: "Body Type",
        type: "select",
        options: ["Hatchback", "Sedan", "Compact SUV", "Full-size SUV", "MUV / MPV", "Coupe", "Convertible", "Luxury"],
        helperText: "Vehicle body styling",
      },
      {
        name: "seating_capacity",
        label: "Seating Capacity",
        type: "select",
        options: ["4 Seater", "5 Seater", "6 Seater", "7 Seater", "8+ Seater"],
        helperText: "Passenger seating capacity",
      },
      {
        name: "airbags",
        label: "Airbags Count",
        type: "number",
        placeholder: "e.g. 2, 6",
        helperText: "Total number of safety airbags installed",
      },
      {
        name: "sunroof",
        label: "Sunroof Available",
        type: "yesno",
      },
      {
        name: "cruise_control",
        label: "Cruise Control",
        type: "yesno",
      },
      {
        name: "reverse_camera",
        label: "Reverse Parking Camera / Sensors",
        type: "yesno",
      },
      {
        name: "alloy_wheels",
        label: "Alloy Wheels",
        type: "yesno",
      },
      {
        name: "touchscreen_system",
        label: "Touchscreen Infotainment / Apple CarPlay / Android Auto",
        type: "yesno",
      },
    ],
  },

  "Bike / Motorcycle": {
    specificFields: [
      {
        name: "bike_type",
        label: "Bike Category",
        type: "select",
        options: [
          "Commuter (100cc - 125cc)",
          "Sports Bike",
          "Cruiser",
          "Adventure / Tourer",
          "Street / Naked",
          "Cafe Racer",
          "Dirt / Off-Road",
        ],
        helperText: "Riding style and purpose",
      },
      {
        name: "engine_cc",
        label: "Engine Displacement (cc)",
        type: "number",
        placeholder: "e.g. 150, 250, 350",
        helperText: "Engine capacity in cubic centimeters",
      },
      {
        name: "abs_system",
        label: "Braking / ABS System",
        type: "select",
        options: ["Dual Channel ABS", "Single Channel ABS", "Front Disc Only (Non-ABS)", "Drum Brakes (Combi)"],
        helperText: "Braking safety configuration",
      },
      {
        name: "start_type",
        label: "Starting Mechanism",
        type: "select",
        options: ["Self & Kick Start", "Electric / Self Start Only", "Kick Start Only"],
      },
      {
        name: "tubeless_tyres",
        label: "Tubeless Tyres",
        type: "yesno",
      },
      {
        name: "custom_exhaust",
        label: "Aftermarket / Custom Exhaust Installed",
        type: "yesno",
      },
    ],
  },

  "Scooter / Scooty": {
    specificFields: [
      {
        name: "engine_cc",
        label: "Engine Capacity",
        type: "select",
        options: ["100cc - 110cc", "125cc", "150cc+"],
        helperText: "Scooter engine class",
      },
      {
        name: "underseat_storage",
        label: "Boot / Underseat Storage",
        type: "select",
        options: ["Large (Fits Full-Face Helmet)", "Medium", "Standard"],
      },
      {
        name: "mobile_charging_port",
        label: "Mobile Charging USB Port",
        type: "yesno",
      },
      {
        name: "disc_brake",
        label: "Front Disc Brake",
        type: "yesno",
      },
      {
        name: "tubeless_tyres",
        label: "Tubeless Tyres",
        type: "yesno",
      },
      {
        name: "lady_driven",
        label: "Single Hand / Lady Driven",
        type: "yesno",
      },
    ],
  },

  "Commercial / Pickup / Truck": {
    specificFields: [
      {
        name: "commercial_type",
        label: "Commercial Vehicle Class",
        type: "select",
        options: [
          "Pickup / Mini Truck (e.g. Bolero, Ace)",
          "Light Commercial Vehicle (LCV)",
          "Medium & Heavy Commercial (HCV)",
          "Tipper / Dumper",
          "Van / Delivery Van",
          "Mini Bus / Bus",
          "Container Truck / Trailer",
        ],
        helperText: "Payload and transport classification",
      },
      {
        name: "loading_capacity",
        label: "Payload / Loading Capacity",
        type: "text",
        placeholder: "e.g. 1.5 Ton, 3.5 Ton, 10 Ton",
        helperText: "Approved GVW or cargo payload rating",
      },
      {
        name: "permit_type",
        label: "Permit Authorization",
        type: "select",
        options: ["All India National Permit", "State Goods Permit", "Local / District Permit"],
      },
      {
        name: "body_structure",
        label: "Body Structure",
        type: "select",
        options: ["Open Body", "Closed Container / Box", "High Deck", "Tipper Body", "Flat Bed"],
      },
      {
        name: "fitness_certificate_valid",
        label: "Fitness Certificate (FC) Valid",
        type: "yesno",
      },
      {
        name: "speed_governor",
        label: "Speed Governor Installed & Certified",
        type: "yesno",
      },
      {
        name: "gps_installed",
        label: "AIS-140 GPS Device Installed",
        type: "yesno",
      },
    ],
  },

  "Tractor / Farm Equipment": {
    specificFields: [
      {
        name: "horsepower",
        label: "Tractor Horsepower (HP)",
        type: "select",
        options: ["Under 30 HP", "30 - 40 HP", "40 - 50 HP", "50 - 60 HP", "Above 60 HP"],
        helperText: "Rated engine horsepower",
      },
      {
        name: "drive_type",
        label: "Drive Configuration",
        type: "select",
        options: ["2WD (Two-Wheel Drive)", "4WD (Four-Wheel Drive)"],
      },
      {
        name: "attachments_included",
        label: "Farm Implements Included",
        type: "multiselect",
        options: ["Rotavator", "Cultivator", "Trolley / Trailer", "Plough", "Harrow", "Dozer Blade", "Tractor Only"],
        helperText: "Attachments sold together with tractor",
      },
      {
        name: "power_steering",
        label: "Power Steering",
        type: "yesno",
      },
      {
        name: "pto_system",
        label: "PTO Output",
        type: "select",
        options: ["Single Speed PTO", "Dual Speed PTO", "Multi-Speed Reverse PTO"],
      },
      {
        name: "hours_run",
        label: "Hours Run (Meter Reading)",
        type: "number",
        placeholder: "e.g. 1200",
        helperText: "Total engine hours run from hour meter",
      },
    ],
  },

  "Electric Vehicle (EV)": {
    specificFields: [
      {
        name: "ev_segment",
        label: "EV Segment",
        type: "select",
        options: [
          "Electric Car / SUV",
          "Electric Scooter",
          "Electric Bike",
          "Electric Auto Rickshaw",
          "Electric Commercial Truck",
        ],
      },
      {
        name: "battery_capacity",
        label: "Battery Pack Capacity",
        type: "text",
        placeholder: "e.g. 3.2 kWh, 30 kWh, 40 kWh",
        helperText: "Battery capacity in kWh",
      },
      {
        name: "real_range_km",
        label: "Real-World Range per Full Charge (km)",
        type: "number",
        placeholder: "e.g. 120, 280",
        helperText: "Estimated kilometers on 100% battery",
      },
      {
        name: "fast_charging",
        label: "Fast Charging (CCS2 / DC) Supported",
        type: "yesno",
      },
      {
        name: "home_charger_included",
        label: "Portable Home Charger Included",
        type: "yesno",
      },
      {
        name: "battery_warranty",
        label: "Battery Under Active OEM Warranty",
        type: "yesno",
      },
      {
        name: "battery_health_soh",
        label: "Battery Health / SOH %",
        type: "number",
        placeholder: "e.g. 96",
        helperText: "State of health percentage from app / OBD",
      },
    ],
  },

  "Auto Rickshaw / 3-Wheeler": {
    specificFields: [
      {
        name: "auto_category",
        label: "3-Wheeler Purpose",
        type: "select",
        options: ["Passenger Auto (3+1)", "Cargo / Delivery Auto", "E-Rickshaw"],
      },
      {
        name: "fuel_system",
        label: "Fuel / Propulsion",
        type: "select",
        options: ["CNG", "Petrol", "LPG", "Diesel", "Electric"],
      },
      {
        name: "permit_scope",
        label: "Permit Type",
        type: "select",
        options: ["City Passenger Permit", "Taluk / Rural Permit", "Goods Carriage Permit", "Green EV Permit"],
      },
      {
        name: "fare_meter",
        label: "Calibrated Fare Meter Installed",
        type: "yesno",
      },
      {
        name: "hood_curtains",
        label: "Hood & Rain Curtains Condition",
        type: "select",
        options: ["New / Excellent", "Good", "Needs Minor Repair"],
      },
    ],
  },

  "Other Vehicle": {
    specificFields: [
      {
        name: "equipment_name",
        label: "Vehicle / Equipment Description",
        type: "text",
        placeholder: "e.g. Earth Mover / JCB, Forklift, Road Roller, Vintage Car",
        helperText: "Specify the exact machinery or specialty vehicle",
      },
      {
        name: "operational_condition",
        label: "Operational Condition",
        type: "select",
        options: ["Ready to Use / Excellent", "Good / Working Condition", "Needs Minor Servicing"],
      },
      {
        name: "heavy_machinery",
        label: "Heavy Machinery / Industrial Equipment",
        type: "yesno",
      },
      {
        name: "commercial_registration",
        label: "Commercial / Yellow Board Registered",
        type: "yesno",
      },
    ],
  },
};

/**
 * Returns default empty details state for vehicle
 */
export function getDefaultVehicleDetails() {
  return {
    amenities: {},
    custom_fields: [],
  };
}

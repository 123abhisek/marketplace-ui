// src/config/propertyFields.js

/**
 * 8 Canonical Property Types
 */
export const PROPERTY_TYPES = [
  "Residential",
  "Commercial",
  "Agricultural / Farm Land",
  "Site / Plot",
  "Flat",
  "Apartment",
  "Villa / Independent House",
  "Land",
];

/**
 * Amenity Group Headings & Descriptions
 */
export const AMENITY_GROUPS = {
  U: { id: "U", title: "Utilities", description: "Electricity, water supply, power backup, and connections" },
  A: { id: "A", title: "Access & Surroundings", description: "Road access, security, boundary fencing, and transit" },
  N: { id: "N", title: "Nearby Facilities", description: "Proximity to schools, hospitals, markets, and transit hubs" },
  F: { id: "F", title: "Property Features", description: "Parking, elevators, gym, swimming pool, and club amenities" },
  L: { id: "L", title: "Legal & Documents", description: "Registration, title deeds, approvals, and loan clearances" },
};

/**
 * Master Amenity Dictionary across U, A, N, F, L
 */
export const AMENITIES_DICTIONARY = {
  // ── U: Utilities ──
  electricity:       { key: "electricity",       defaultLabel: "Electricity",             group: "U", type: "yesno" },
  water_supply:      { key: "water_supply",      defaultLabel: "Water supply",            group: "U", type: "yesno" },
  borewell:          { key: "borewell",          defaultLabel: "Borewell / well",         group: "U", type: "yesno" },
  drainage:          { key: "drainage",          defaultLabel: "Drainage / sewage",       group: "U", type: "yesno" },
  internet:          { key: "internet",          defaultLabel: "Internet / broadband",    group: "U", type: "yesno" },
  power_backup:      { key: "power_backup",      defaultLabel: "Power backup",            group: "U", type: "yesno" },
  street_lights:     { key: "street_lights",     defaultLabel: "Street lights",           group: "U", type: "yesno" },

  // ── A: Access & Surroundings ──
  road_access:       { key: "road_access",       defaultLabel: "Road access",             group: "A", type: "yesno" },
  public_transport:  { key: "public_transport",  defaultLabel: "Public transport nearby", group: "A", type: "yesno" },
  fenced:            { key: "fenced",            defaultLabel: "Compound wall / fencing", group: "A", type: "yesno" },
  gated:             { key: "gated",             defaultLabel: "Gated / secured",         group: "A", type: "yesno" },
  cctv:              { key: "cctv",              defaultLabel: "CCTV / security",         group: "A", type: "yesno" },

  // ── N: Nearby Facilities ──
  school:            { key: "school",            defaultLabel: "School",                     group: "N", type: "yesno" },
  hospital:          { key: "hospital",          defaultLabel: "Hospital",                   group: "N", type: "yesno" },
  market:            { key: "market",            defaultLabel: "Market / shopping",          group: "N", type: "yesno" },
  bank_atm:          { key: "bank_atm",          defaultLabel: "Bank / ATM",                 group: "N", type: "yesno" },
  place_of_worship:  { key: "place_of_worship",  defaultLabel: "Temple / place of worship",  group: "N", type: "yesno" },
  bus_railway:       { key: "bus_railway",       defaultLabel: "Bus stand / railway station",group: "N", type: "yesno" },

  // ── F: Property Features ──
  parking:           { key: "parking",           defaultLabel: "Parking",                 group: "F", type: "yesno" },
  lift:              { key: "lift",              defaultLabel: "Lift",                    group: "F", type: "yesno" },
  garden:            { key: "garden",            defaultLabel: "Garden / open space",     group: "F", type: "yesno" },
  play_area:         { key: "play_area",         defaultLabel: "Children's play area",    group: "F", type: "yesno" },
  gym:               { key: "gym",               defaultLabel: "Gym / clubhouse",         group: "F", type: "yesno" },
  swimming_pool:     { key: "swimming_pool",     defaultLabel: "Swimming pool",           group: "F", type: "yesno" },

  // ── L: Legal & Documents ──
  registered:        { key: "registered",        defaultLabel: "Registered property",     group: "L", type: "yesno" },
  clear_title:       { key: "clear_title",       defaultLabel: "Clear title / no disputes",group: "L", type: "yesno" },
  khata_rtc:         { key: "khata_rtc",         defaultLabel: "Khata / RTC / patta available", group: "L", type: "yesno" },
  authority_approved:{ key: "authority_approved",defaultLabel: "Approved by authority (DTCP/BDA/panchayat)", group: "L", type: "yesno" },
  loan_pending:      { key: "loan_pending",      defaultLabel: "Loan pending",            group: "L", type: "yesno_amount" },
};

const NEARBY_KEYS = ["school", "hospital", "market", "bank_atm", "place_of_worship", "bus_railway"];
const LEGAL_ALL_KEYS = ["registered", "clear_title", "khata_rtc", "authority_approved", "loan_pending"];
const ACCESS_ALL_KEYS = ["road_access", "public_transport", "fenced", "gated", "cctv"];

/**
 * Category-Specific Declarative Configurations
 */
export const CATEGORY_CONFIG = {
  "Agricultural / Farm Land": {
    specificFields: [
      {
        name: "soil",
        label: "Soil composition",
        type: "multiselect",
        options: ["Red", "Black", "Sandy", "Loamy", "Laterite", "Clay"],
        helperText: "Select one or more soil types present on the land",
      },
      {
        name: "suitable_crops",
        label: "Good for",
        type: "multiselect",
        options: ["Areca nut", "Coconut", "Banana", "Paddy", "Sugarcane", "Ragi", "Maize", "Vegetables"],
        helperText: "Select crops most suited for this land",
      },
      {
        name: "ownership",
        label: "Ownership type",
        type: "select",
        options: ["Registered", "Government / Inam", "Agreement only"],
        placeholder: "Select ownership type",
      },
    ],
    amenities: {
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "borewell", labelOverride: "Well irrigation provided" },
      ],
      A: [
        { key: "road_access" },
        { key: "public_transport" },
        { key: "fenced", labelOverride: "Borders enclosed" },
      ],
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      L: [
        { key: "registered" },
        { key: "clear_title" },
        { key: "khata_rtc" },
        { key: "loan_pending", labelOverride: "Agricultural loan pending" },
      ],
    },
  },

  "Land": {
    specificFields: [
      {
        name: "land_use",
        label: "Land use",
        type: "select",
        options: ["Residential", "Commercial", "Industrial", "Agricultural", "Converted (DC)"],
        placeholder: "Select designated land usage",
      },
      {
        name: "conversion_done",
        label: "Land conversion done",
        type: "yesno",
      },
      {
        name: "survey_sketch",
        label: "Survey sketch / RTC available",
        type: "yesno",
      },
    ],
    amenities: {
      U: [{ key: "electricity" }, { key: "water_supply" }, { key: "borewell" }],
      A: [{ key: "road_access" }, { key: "public_transport" }, { key: "fenced" }],
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },

  "Site / Plot": {
    specificFields: [
      {
        name: "facing",
        label: "Facing",
        type: "select",
        options: ["East", "West", "North", "South", "NE", "NW", "SE", "SW"],
        placeholder: "Select site facing",
      },
      {
        name: "dimensions",
        label: "Dimensions",
        type: "text",
        placeholder: "e.g. 30x40, 40x60, 50x80",
      },
      {
        name: "corner_site",
        label: "Corner site",
        type: "yesno",
      },
    ],
    amenities: {
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "borewell" },
        { key: "drainage" },
        { key: "street_lights" },
      ],
      A: ACCESS_ALL_KEYS.map((k) => ({ key: k })),
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },

  "Residential": {
    specificFields: [
      {
        name: "bhk",
        label: "BHK",
        type: "select",
        options: ["1", "2", "3", "4", "5+"],
        placeholder: "Select BHK",
      },
      {
        name: "furnishing",
        label: "Furnishing",
        type: "select",
        options: ["Unfurnished", "Semi-furnished", "Fully furnished"],
        placeholder: "Select furnishing status",
      },
    ],
    amenities: {
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "drainage" },
        { key: "internet" },
        { key: "power_backup" },
        { key: "street_lights" },
      ],
      A: ACCESS_ALL_KEYS.map((k) => ({ key: k })),
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      F: [
        { key: "parking" },
        { key: "lift" },
        { key: "garden" },
        { key: "play_area" },
        { key: "gym" },
        { key: "swimming_pool" },
      ],
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },

  "Commercial": {
    specificFields: [
      {
        name: "commercial_type",
        label: "Type",
        type: "select",
        options: ["Shop", "Office", "Showroom", "Warehouse", "Industrial"],
        placeholder: "Select commercial space type",
      },
      {
        name: "floor",
        label: "Floor",
        type: "number",
        placeholder: "e.g. 0 (Ground), 1, 2",
      },
      {
        name: "main_road_facing",
        label: "Main road facing",
        type: "yesno",
      },
      {
        name: "trade_license",
        label: "Trade license available",
        type: "yesno",
      },
    ],
    amenities: {
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "drainage" },
        { key: "internet" },
        { key: "power_backup" },
        { key: "street_lights" },
      ],
      A: ACCESS_ALL_KEYS.map((k) => ({ key: k })),
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      F: [{ key: "parking" }, { key: "lift" }, { key: "gym" }],
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },

  "Flat": {
    specificFields: [
      {
        name: "bhk",
        label: "BHK",
        type: "select",
        options: ["1", "2", "3", "4+"],
        placeholder: "Select BHK",
      },
      {
        name: "floor_number",
        label: "Floor number",
        type: "number",
        placeholder: "e.g. 3, 5",
      },
      {
        name: "furnishing",
        label: "Furnishing",
        type: "select",
        options: ["Unfurnished", "Semi-furnished", "Fully furnished"],
        placeholder: "Select furnishing",
      },
      {
        name: "rera_approved",
        label: "RERA approved",
        type: "yesno",
      },
    ],
    amenities: {
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "drainage" },
        { key: "internet" },
        { key: "power_backup" },
        { key: "street_lights" },
      ],
      A: [
        { key: "road_access" },
        { key: "public_transport" },
        { key: "gated" },
        { key: "cctv" },
      ],
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      F: [
        { key: "parking" },
        { key: "lift" },
        { key: "garden" },
        { key: "play_area" },
        { key: "gym" },
        { key: "swimming_pool" },
      ],
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },

  "Apartment": {
    specificFields: [
      {
        name: "bhk",
        label: "BHK",
        type: "select",
        options: ["1", "2", "3", "4+"],
        placeholder: "Select BHK",
      },
      {
        name: "floor_number",
        label: "Floor number",
        type: "number",
        placeholder: "e.g. 4",
      },
      {
        name: "total_floors",
        label: "Total floors",
        type: "number",
        placeholder: "e.g. 14",
      },
      {
        name: "furnishing",
        label: "Furnishing",
        type: "select",
        options: ["Unfurnished", "Semi-furnished", "Fully furnished"],
        placeholder: "Select furnishing",
      },
      {
        name: "rera_approved",
        label: "RERA approved",
        type: "yesno",
      },
    ],
    amenities: {
      // Same as Flat
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "drainage" },
        { key: "internet" },
        { key: "power_backup" },
        { key: "street_lights" },
      ],
      A: [
        { key: "road_access" },
        { key: "public_transport" },
        { key: "gated" },
        { key: "cctv" },
      ],
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      F: [
        { key: "parking" },
        { key: "lift" },
        { key: "garden" },
        { key: "play_area" },
        { key: "gym" },
        { key: "swimming_pool" },
      ],
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },

  "Villa / Independent House": {
    specificFields: [
      {
        name: "bhk",
        label: "BHK",
        type: "select",
        options: ["2", "3", "4", "5+"],
        placeholder: "Select BHK",
      },
      {
        name: "floors",
        label: "Number of floors",
        type: "number",
        placeholder: "e.g. 1, 2, 3 (G+1, G+2)",
      },
      {
        name: "plot_area",
        label: "Plot area sq ft",
        type: "number",
        placeholder: "e.g. 1500, 2400",
      },
      {
        name: "furnishing",
        label: "Furnishing",
        type: "select",
        options: ["Unfurnished", "Semi-furnished", "Fully furnished"],
        placeholder: "Select furnishing",
      },
      {
        name: "solar_panels",
        label: "Solar panels",
        type: "yesno",
      },
    ],
    amenities: {
      U: [
        { key: "electricity" },
        { key: "water_supply" },
        { key: "borewell" },
        { key: "drainage" },
        { key: "internet" },
        { key: "power_backup" },
        { key: "street_lights" },
      ],
      A: ACCESS_ALL_KEYS.map((k) => ({ key: k })),
      N: NEARBY_KEYS.map((k) => ({ key: k })),
      F: [
        { key: "parking" },
        { key: "garden" },
        { key: "play_area" },
        { key: "gym" },
        { key: "swimming_pool" },
      ],
      L: LEGAL_ALL_KEYS.map((k) => ({ key: k })),
    },
  },
};

/**
 * Returns a clean initial details state for a given category
 */
export function getDefaultDetails(category) {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["Residential"];
  const initial = {
    amenities: {},
    custom_fields: [],
  };

  cfg.specificFields.forEach((f) => {
    if (f.type === "multiselect") {
      initial[f.name] = [];
    } else {
      initial[f.name] = null;
    }
  });

  return initial;
}

/**
 * Normalizes property type string to match CATEGORY_CONFIG key
 */
export function normalizePropertyType(type) {
  if (!type) return "Residential";
  const t = String(type).trim().toLowerCase();
  for (const cat of PROPERTY_TYPES) {
    if (t === cat.toLowerCase()) return cat;
  }
  if (t.includes("farm") || t.includes("agri")) return "Agricultural / Farm Land";
  if (t.includes("site") || t.includes("plot")) return "Site / Plot";
  if (t.includes("villa") || t.includes("house")) return "Villa / Independent House";
  if (t.includes("flat")) return "Flat";
  if (t.includes("apartment")) return "Apartment";
  if (t.includes("commercial") || t.includes("office") || t.includes("shop")) return "Commercial";
  if (t.includes("land")) return "Land";
  return "Residential";
}

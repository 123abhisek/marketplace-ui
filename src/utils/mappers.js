// src/utils/mappers.js

/**
 * extractError
 * Pulls a human-readable message from:
 *   1. Frontend-thrown errors (err.isFrontendError === true)
 *   2. FastAPI 422 Unprocessable Entity  — detail is an array of objects
 *   3. FastAPI plain { detail: "string" }
 *   4. Generic Error.message fallback
 */
export function extractError(err) {
  if (err?.isFrontendError) return err.message

  const detail = err?.response?.data?.detail

  // FastAPI 422 — detail is an array: [{ loc, msg, type }, ...]
  if (Array.isArray(detail)) {
    return (
      detail
        .map((d) => {
          const field = d.loc?.filter((l) => l !== 'body').join(' → ') || ''
          const msg   = d.msg || ''
          return field ? `${field}: ${msg}` : msg
        })
        .filter(Boolean)
        .join('  |  ') || 'Validation error'
    )
  }

  if (typeof detail === 'string') return detail

  return err?.message || 'Something went wrong. Please try again.'
}

/**
 * normalizeProperty / mapProperty
 * Converts a raw API property object → the shape used by the frontend.
 * Handles both snake_case (API) and camelCase (legacy) fields.
 */
export function normalizeProperty(p) {
  return {
    id:            p.id,
    title:         p.title          || '',
    propertyType:  p.property_type  || p.propertyType  || '',
    location:      p.location       || '',
    apartmentName: p.apartment_name || p.apartmentName || '',
    floor:         p.floor          ?? null,
    rooms:         p.rooms          ?? null,
    bedrooms:      p.bedrooms       ?? null,
    area:          p.area           ?? null,
    landArea:      p.land_area      || p.landArea       || '',
    cropsGrown:    p.crops_grown    || p.cropsGrown     || '',
    price:         p.price          ?? p.expectedPrice  ?? null,
    rentLease:     p.rent_lease     || p.rentLease      || '',
    contactNumber: p.contact_number || p.contactNumber  || '',
    images:        p.images         || [],
    ownerId:       p.owner_id       || p.ownerId        || null,
    createdAt:     p.created_at     || p.createdAt      || null,
  }
}

// Alias — some pages import this as mapProperty
export const mapProperty = normalizeProperty

/**
 * normalizeVehicle / mapVehicle
 * Converts a raw API vehicle object → the shape used by the frontend.
 */
export function normalizeVehicle(v) {
  return {
    id:            v.id,
    title:         v.title           || '',
    vehicleType:   v.vehicle_type    || v.vehicleType   || '',
    brand:         v.brand           || '',
    model:         v.model           || '',
    year:          v.year            ?? null,
    fuelType:      v.fuel_type       || v.fuelType      || '',
    transmission:  v.transmission    || '',
    kmDriven:      v.km_driven       ?? v.kmDriven      ?? null,
    color:         v.color           || '',
    location:      v.location        || '',
    price:         v.price           ?? null,
    description:   v.description     || '',
    contactNumber: v.contact_number  || v.contactNumber || '',
    images:        v.images          || [],
    ownerId:       v.owner_id        || v.ownerId       || null,
    createdAt:     v.created_at      || v.createdAt     || null,
  }
}

// Alias — some pages import this as mapVehicle
export const mapVehicle = normalizeVehicle
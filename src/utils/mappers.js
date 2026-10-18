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
  if (!p) return {}
  const priceVal = p.price ?? p.expected_price ?? p.expectedPrice ?? null
  const pType = p.property_type || p.propertyType || p.type || ''
  const rentLeaseVal = p.rent_lease || p.rentLease || ''
  const contactVal = p.contact_number || p.contactNumber || p.contact || ''
  const localAddr = p.local_address || p.localAddress || ''
  const aptName = p.apartment_name || p.apartmentName || ''
  const waterSupplyVal = p.water_supply || p.waterSupply || ''
  const propAge = p.property_age || p.propertyAge || ''
  const landAreaVal = p.land_area || p.landArea || ''
  const cropsGrownVal = p.crops_grown || p.cropsGrown || ''
  const rentAdvanceVal = p.rent_advance_amount ?? p.rentAdvanceAmount ?? null
  const leaseDurationVal = p.lease_duration_years ?? p.leaseDurationYears ?? null
  const addlDimensions = p.additional_dimensions_details || p.additionalDimensionsDetails || ''
  const ownerIdVal = p.owner_id || p.ownerId || p.user_id || null
  const createdVal = p.created_at || p.createdAt || null
  const updatedVal = p.updated_at || p.updatedAt || null

  return {
    ...p,
    id:                           p.id,
    title:                        p.title || '',
    propertyType:                 pType,
    property_type:                pType,
    localAddress:                 localAddr,
    local_address:                localAddr,
    city:                         p.city || '',
    state:                        p.state || '',
    location:                     p.location || '',
    apartmentName:                aptName,
    apartment_name:               aptName,
    floor:                        p.floor ?? null,
    rooms:                        p.rooms ?? null,
    bedrooms:                     p.bedrooms ?? null,
    bathrooms:                    p.bathrooms ?? null,
    furnishing:                   p.furnishing || '',
    facing:                       p.facing || '',
    parking:                      p.parking || '',
    waterSupply:                  waterSupplyVal,
    water_supply:                 waterSupplyVal,
    propertyAge:                  propAge,
    property_age:                 propAge,
    area:                         p.area ?? null,
    landArea:                     landAreaVal,
    land_area:                    landAreaVal,
    cropsGrown:                   cropsGrownVal,
    crops_grown:                  cropsGrownVal,
    price:                        priceVal,
    expectedPrice:                priceVal,
    expected_price:               priceVal,
    rentLease:                    rentLeaseVal,
    rent_lease:                   rentLeaseVal,
    rentAdvanceAmount:            rentAdvanceVal,
    rent_advance_amount:          rentAdvanceVal,
    leaseDurationYears:           leaseDurationVal,
    lease_duration_years:         leaseDurationVal,
    additionalDimensionsDetails:  addlDimensions,
    additional_dimensions_details:addlDimensions,
    contactNumber:                contactVal,
    contact:                      contactVal,
    images:                       Array.isArray(p.images) ? p.images : [],
    ownerId:                      ownerIdVal,
    owner_id:                     ownerIdVal,
    createdAt:                    createdVal,
    created_at:                   createdVal,
    updatedAt:                    updatedVal,
    updated_at:                   updatedVal,
    status:                       p.status || 'approved',
    rejectionReason:              p.rejection_reason || p.rejectionReason || null,
    rejection_reason:             p.rejection_reason || p.rejectionReason || null,
    details:                      p.details || {},
    description:                  p.description || '',
    owner:                        p.owner || null,
  }
}

// Alias — some pages import this as mapProperty
export const mapProperty = normalizeProperty

/**
 * normalizeVehicle / mapVehicle
 * Converts a raw API vehicle object → the shape used by the frontend.
 */
export function normalizeVehicle(v) {
  if (!v) return {}
  const priceVal = v.price ?? v.expected_price ?? v.expectedPrice ?? null
  const catVal = v.category || v.vehicle_type || v.vehicleType || ''
  const kmVal = v.km_driven ?? v.kmDriven ?? null
  const fuelVal = v.fuel_type || v.fuelType || ''
  const insuranceVal = v.insurance_validity || v.insuranceValidity || ''
  const rtoVal = v.rto_code || v.rtoCode || ''
  const vehNum = v.vehicle_number || v.vehicleNumber || ''
  const localAddr = v.local_address || v.localAddress || ''
  const contactVal = v.contact_number || v.contactNumber || v.contact || ''
  const ownerIdVal = v.owner_id || v.ownerId || v.user_id || null
  const createdVal = v.created_at || v.createdAt || null
  const updatedVal = v.updated_at || v.updatedAt || null

  return {
    ...v,
    id:                v.id,
    title:             v.title || '',
    category:          catVal,
    vehicleType:       catVal,
    vehicle_type:      catVal,
    brand:             v.brand || '',
    model:             v.model || '',
    year:              v.year ?? null,
    fuelType:          fuelVal,
    fuel_type:         fuelVal,
    transmission:      v.transmission || '',
    ownership:         v.ownership || '',
    insuranceValidity: insuranceVal,
    insurance_validity:insuranceVal,
    kmDriven:          kmVal,
    km_driven:         kmVal,
    rtoCode:           rtoVal,
    rto_code:          rtoVal,
    vehicleNumber:     vehNum,
    vehicle_number:    vehNum,
    color:             v.color || '',
    localAddress:      localAddr,
    local_address:     localAddr,
    city:              v.city || '',
    state:             v.state || '',
    location:          v.location || '',
    price:             priceVal,
    expectedPrice:     priceVal,
    expected_price:    priceVal,
    description:       v.description || '',
    contactNumber:     contactVal,
    contact:           contactVal,
    images:            Array.isArray(v.images) ? v.images : [],
    ownerId:           ownerIdVal,
    owner_id:          ownerIdVal,
    createdAt:         createdVal,
    created_at:        createdVal,
    updatedAt:         updatedVal,
    updated_at:        updatedVal,
    status:            v.status || 'approved',
    rejectionReason:   v.rejection_reason || v.rejectionReason || null,
    rejection_reason:  v.rejection_reason || v.rejectionReason || null,
    details:           v.details || {},
    owner:             v.owner || null,
  }
}

// Alias — some pages import this as mapVehicle
export const mapVehicle = normalizeVehicle
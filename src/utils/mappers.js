// src/utils/mappers.js

/**
 * Maps API snake_case property response → UI camelCase shape.
 * Handles both public teaser shape (/all) and full shape (/my/listings, /add).
 */
export const mapProperty = (p) => ({
  id:             p.id,
  ownerId:        p.user_id ?? null,
  title:          p.title ?? '',
  propertyType:   p.property_type ?? '',
  location:       p.location ?? '',
  apartmentName:  p.apartment_name ?? '',
  contactNumber:  p.contact ?? '',
  floor:          p.floor ?? '',
  rooms:          p.rooms ?? '',
  bedrooms:       p.bedrooms ?? '',
  area:           p.area ?? '',
  landArea:       p.land_area ?? '',
  cropsGrown:     p.crops_grown ?? '',
  expectedPrice:  p.price ?? 0,
  rentLease:      p.rent_lease ?? '',
  images:         p.images ?? [],
  message:        p.message ?? '',
  createdAt:      p.created_at ?? null,
})

/**
 * Maps API user object → UI user shape.
 */
export const mapUser = (u) => ({
  id:           u.id,
  name:         u.name ?? '',
  email:        u.email ?? '',
  mobile:       u.phone ?? '',
  gender:       u.gender ?? '',
  dob:          u.dob ?? '',
  occupation:   u.occupation ?? '',
  photo:        u.avatar_url ?? null,
  location:     u.location ?? '',
  state:        u.state ?? '',
  city:         u.city ?? '',
  pincode:      u.pincode ?? '',
  isPremium:    u.is_premium ?? false,
  role:         u.is_premium ? 'premium' : 'free',
  subscription: u.is_premium ? 'active' : 'inactive',
  loggedIn:     true,
})

/**
 * Extracts a human-readable error message from an Axios error.
 */
export const extractError = (err) => {
  if (err?.response?.data?.detail) {
    const detail = err.response.data.detail
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg).join(', ')
    }
    return String(detail)
  }
  if (err?.response?.statusText) return err.response.statusText
  if (err?.message) return err.message
  return 'An unexpected error occurred'
}
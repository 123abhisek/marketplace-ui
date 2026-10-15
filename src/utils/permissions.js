// src/utils/permissions.js

/**
 * Standard utility to check if the current user has permission
 * to view protected listing details (photos, contact numbers, exact address).
 *
 * Checks active premium subscription, admin/seller roles, or listing ownership.
 */
export function canViewPremiumDetails(user, ownerId = null) {
  if (!user) return false;

  // Listing owner always has access to their own listing
  if (ownerId && (user.id === ownerId || user._id === ownerId)) {
    return true;
  }

  const role = String(user.role || "").toLowerCase();

  // Admin or Seller roles
  if (user.is_admin || user.isAdmin || role === "admin" || user.is_seller || user.isSeller || role === "seller") {
    return true;
  }

  // Premium status checks
  if (user.is_premium || user.isPremium || role === "premium") {
    return true;
  }

  return false;
}

/**
 * Helper to get the display city from listing or location string.
 */
export function getDisplayCity(listing) {
  if (!listing) return "Karnataka";
  if (listing.city) return listing.city;

  const loc = String(listing.location || "").trim();
  if (!loc) return "Karnataka";

  const parts = loc.split(/[,/|–-]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return "Karnataka";
  if (parts.length === 1) return parts[0];

  const knownRegions = ["karnataka", "india", "tamil nadu", "maharashtra", "kerala", "goa", "telangana", "andhra pradesh"];
  if (parts.length >= 2 && knownRegions.includes(parts[parts.length - 1].toLowerCase())) {
    return parts[parts.length - 2];
  }
  return parts[parts.length - 1];
}

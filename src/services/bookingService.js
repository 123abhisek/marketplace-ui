// src/services/bookingService.js
import api from "./api";

export async function initiateBooking({
  property_id = null,
  vehicle_id = null,
  amount,
  currency = "INR",
}) {
  if (!property_id && !vehicle_id) {
    throw new Error("Either property_id or vehicle_id is required");
  }

  if (property_id && vehicle_id) {
    throw new Error("Pass only one of property_id or vehicle_id");
  }

  const validAmount = Number(amount) > 0 ? Number(amount) : 1;

  const result = await api.post("booking/initiate", {
    ...(property_id ? { property_id } : {}),
    ...(vehicle_id ? { vehicle_id } : {}),
    amount: validAmount,
    currency,
  });

  return result;
}

export async function getMyBookings(status = null) {
  const query = new URLSearchParams();
  if (status) query.set("status", status);

  return api.get(`booking/my${query.toString() ? `?${query.toString()}` : ""}`);
}

export async function getReceivedBookings(status = null) {
  const query = new URLSearchParams();
  if (status) query.set("status", status);

  return api.get(
    `booking/received${query.toString() ? `?${query.toString()}` : ""}`,
  );
}

export async function getBooking(bookingId) {
  return api.get(`booking/${bookingId}`);
}

export async function cancelBooking(bookingId) {
  return api.delete(`booking/${bookingId}`);
}

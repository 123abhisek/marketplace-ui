// src/layouts/AuthLayout.jsx
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  // Completely bare — no Navbar, no Footer.
  // Login and Register render full-screen by themselves.
  return <Outlet />
}
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import adminOrdersService from './../../services/adminOrdersApi';

const UI = {
  bg: '#f5f7fb',
  shell: '#fcfdff',
  surface: '#ffffff',
  surfaceSoft: '#f8fafc',
  border: 'rgba(15,23,42,0.08)',
  borderStrong: 'rgba(15,23,42,0.12)',
  text: '#0f172a',
  muted: '#64748b',
  faint: '#94a3b8',
  primary: '#0f766e',
  primarySoft: 'rgba(15,118,110,0.10)',
  purple: '#7c3aed',
  purpleSoft: 'rgba(124,58,237,0.10)',
  blue: '#2563eb',
  blueSoft: 'rgba(37,99,235,0.10)',
  success: '#16a34a',
  successSoft: 'rgba(22,163,74,0.10)',
  warning: '#d97706',
  warningSoft: 'rgba(217,119,6,0.10)',
  shadowSm: '0 2px 10px rgba(15,23,42,0.04)',
  shadowMd: '0 10px 32px rgba(15,23,42,0.06)',
};

const cardSx = {
  borderRadius: '22px',
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
};

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function getListingTone(type = '') {
  const lower = String(type).toLowerCase();
  if (lower === 'property') {
    return {
      icon: <HomeWorkRoundedIcon sx={{ fontSize: 22 }} />,
      color: UI.primary,
      bg: UI.primarySoft,
      label: 'Property',
    };
  }
  return {
    icon: <DirectionsCarRoundedIcon sx={{ fontSize: 22 }} />,
    color: UI.blue,
    bg: UI.blueSoft,
    label: 'Vehicle',
  };
}

function getStatusTone(status = '') {
  const value = String(status).toUpperCase();
  if (value === 'CONFIRMED') {
    return {
      color: UI.success,
      bg: UI.successSoft,
      icon: <CheckCircleRoundedIcon sx={{ fontSize: '15px !important' }} />,
    };
  }
  return {
    color: UI.warning,
    bg: UI.warningSoft,
    icon: <AccessTimeRoundedIcon sx={{ fontSize: '15px !important' }} />,
  };
}

function StatCard({ title, value, subtitle, icon, color, bg }) {
  return (
    <Card sx={{ ...cardSx, height: '100%' }}>
      <CardContent sx={{ p: 2.1 }}>
        <Stack spacing={1}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: bg,
              color,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography sx={{ fontSize: '1.7rem', lineHeight: 1, fontWeight: 900, color: UI.text }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: UI.text }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '0.76rem', color: UI.muted, lineHeight: 1.55 }}>
            {subtitle}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminOrdersService.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setOrders([]);
      setError(err?.response?.detail || err?.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) =>
      [
        order.id,
        order.status,
        order.listing?.title,
        order.listing?.type,
        order.listing?.location,
        order.owner?.name,
        order.owner?.phone,
        order.owner?.email,
        order.payment?.payment_status,
        order.payment?.payment_method,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [orders, search]);

  const counts = useMemo(() => {
    const total = orders.length;
    const confirmed = orders.filter((order) => String(order.status).toUpperCase() === 'CONFIRMED').length;
    const paid = orders.filter((order) => String(order.payment?.payment_status).toUpperCase() === 'SUCCESS').length;
    const totalAmount = orders.reduce((sum, order) => sum + Number(order.payment?.amount || 0), 0);
    return { total, confirmed, paid, totalAmount };
  }, [orders]);

  return (
    <Box sx={{ minHeight: '100vh', background: UI.bg, p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box
        sx={{
          maxWidth: 1320,
          mx: 'auto',
          p: { xs: 1.5, sm: 2, md: 2.5 },
          borderRadius: { xs: '24px', md: '30px' },
          border: `1px solid ${UI.border}`,
          background: UI.shell,
          boxShadow: UI.shadowMd,
        }}
      >
        <Stack spacing={2.2}>
          <Card sx={{ ...cardSx, boxShadow: 'none' }}>
            <CardContent sx={{ p: { xs: 1.6, sm: 2.2 } }}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.6}
                justifyContent="space-between"
                alignItems={{ md: 'center' }}
              >
                <Box>
                  <Typography sx={{ fontSize: { xs: '1.45rem', sm: '1.8rem' }, fontWeight: 900, color: UI.text, letterSpacing: '-0.03em' }}>
                    Orders Management
                  </Typography>
                  <Typography sx={{ mt: 0.7, fontSize: '0.9rem', color: UI.muted, lineHeight: 1.65 }}>
                    Displaying all bookings from the admin orders endpoint with listing, owner, payment, and timeline details.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by order, listing, owner, payment, location"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ fontSize: 18, color: UI.faint }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      minWidth: { md: 360 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        background: UI.surfaceSoft,
                      },
                    }}
                  />
                  <Tooltip title="Refresh orders">
                    <IconButton
                      onClick={loadOrders}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '14px',
                        background: UI.surfaceSoft,
                        border: `1px solid ${UI.border}`,
                      }}
                    >
                      <RefreshRoundedIcon sx={{ fontSize: 18, color: UI.text }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {!!error && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: '16px' }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0,1fr))', lg: 'repeat(4, minmax(0,1fr))' },
              gap: 1.6,
            }}
          >
            <StatCard
              title="Total Orders"
              value={counts.total}
              subtitle="All bookings returned by API"
              icon={<ShoppingBagRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.primary}
              bg={UI.primarySoft}
            />
            <StatCard
              title="Confirmed"
              value={counts.confirmed}
              subtitle="Orders currently confirmed"
              icon={<CheckCircleRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.success}
              bg={UI.successSoft}
            />
            <StatCard
              title="Payments Success"
              value={counts.paid}
              subtitle="Orders with successful payment"
              icon={<PaymentsRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.blue}
              bg={UI.blueSoft}
            />
            <StatCard
              title="Total Amount"
              value={`₹${counts.totalAmount}`}
              subtitle="Sum of payment amounts"
              icon={<CurrencyRupeeRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.purple}
              bg={UI.purpleSoft}
            />
          </Box>

          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 1.6, sm: 2.2 } }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: UI.faint }}>
                    All orders
                  </Typography>
                  <Typography sx={{ mt: 0.55, fontSize: '1.08rem', color: UI.text, fontWeight: 900, letterSpacing: '-0.02em' }}>
                    Total displayed: {filteredOrders.length}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: UI.border }} />

                {loading ? (
                  <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
                    <Stack spacing={1.2} alignItems="center">
                      <CircularProgress size={34} sx={{ color: UI.primary }} />
                      <Typography sx={{ fontSize: '0.88rem', color: UI.muted, fontWeight: 700 }}>
                        Loading orders...
                      </Typography>
                    </Stack>
                  </Box>
                ) : filteredOrders.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1rem', color: UI.text, fontWeight: 800 }}>
                      No orders found
                    </Typography>
                    <Typography sx={{ mt: 0.6, fontSize: '0.84rem', color: UI.muted }}>
                      Try another search term or check whether the API returned any bookings.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {filteredOrders.map((order) => {
                      const listingTone = getListingTone(order.listing?.type);
                      const statusTone = getStatusTone(order.status);

                      return (
                        <Card
                          key={order.id}
                          sx={{
                            ...cardSx,
                            boxShadow: 'none',
                            transition: 'all .18s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              borderColor: UI.borderStrong,
                              boxShadow: UI.shadowSm,
                            },
                          }}
                        >
                          <CardContent sx={{ p: { xs: 1.6, sm: 2 } }}>
                            <Stack spacing={1.6}>
                              <Stack
                                direction={{ xs: 'column', lg: 'row' }}
                                spacing={1.4}
                                justifyContent="space-between"
                                alignItems={{ lg: 'center' }}
                              >
                                <Stack direction="row" spacing={1.3} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                                  <Box
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 15,
                                      background: listingTone.bg,
                                      color: listingTone.color,
                                      display: 'grid',
                                      placeItems: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {listingTone.icon}
                                  </Box>
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '0.96rem', fontWeight: 900, color: UI.text }} noWrap>
                                      {order.listing?.title || 'Untitled Listing'}
                                    </Typography>
                                    <Typography sx={{ mt: 0.35, fontSize: '0.8rem', color: UI.muted }} noWrap>
                                      Order ID: {order.id}
                                    </Typography>
                                  </Box>
                                </Stack>

                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                  <Chip
                                    size="small"
                                    icon={listingTone.icon}
                                    label={listingTone.label}
                                    sx={{
                                      height: 30,
                                      borderRadius: '999px',
                                      fontWeight: 800,
                                      fontSize: '0.74rem',
                                      color: listingTone.color,
                                      background: listingTone.bg,
                                      border: 'none',
                                    }}
                                  />
                                  <Chip
                                    size="small"
                                    icon={statusTone.icon}
                                    label={order.status || 'Pending'}
                                    sx={{
                                      height: 30,
                                      borderRadius: '999px',
                                      fontWeight: 800,
                                      fontSize: '0.74rem',
                                      color: statusTone.color,
                                      background: statusTone.bg,
                                      border: 'none',
                                    }}
                                  />
                                  <Chip
                                    size="small"
                                    icon={<PaymentsRoundedIcon sx={{ fontSize: '15px !important' }} />}
                                    label={order.payment?.payment_status || 'Unknown'}
                                    sx={{
                                      height: 30,
                                      borderRadius: '999px',
                                      fontWeight: 800,
                                      fontSize: '0.74rem',
                                      color: UI.blue,
                                      background: UI.blueSoft,
                                      border: 'none',
                                    }}
                                  />
                                </Stack>
                              </Stack>

                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0,1fr))' },
                                  gap: 1.2,
                                }}
                              >
                                <Box sx={{ p: 1.4, borderRadius: '16px', background: UI.surfaceSoft, border: `1px solid ${UI.border}` }}>
                                  <Typography sx={{ fontSize: '0.72rem', color: UI.faint, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Listing Details
                                  </Typography>
                                  <Stack spacing={0.65} sx={{ mt: 1 }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                      <LocationOnRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                                      <Typography sx={{ fontSize: '0.82rem', color: UI.muted }}>
                                        {order.listing?.location || '-'}
                                      </Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: '0.82rem', color: UI.text, fontWeight: 800 }}>
                                      Price: ₹{order.listing?.price ?? '-'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: UI.muted }}>
                                      Listing ID: {order.listing?.id || '-'}
                                    </Typography>
                                  </Stack>
                                </Box>

                                <Box sx={{ p: 1.4, borderRadius: '16px', background: UI.surfaceSoft, border: `1px solid ${UI.border}` }}>
                                  <Typography sx={{ fontSize: '0.72rem', color: UI.faint, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Owner Details
                                  </Typography>
                                  <Stack spacing={0.65} sx={{ mt: 1 }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                      <Avatar sx={{ width: 24, height: 24, bgcolor: UI.primary, fontWeight: 800, fontSize: '0.7rem' }}>
                                        {getInitials(order.owner?.name || 'U')}
                                      </Avatar>
                                      <Typography sx={{ fontSize: '0.82rem', color: UI.text, fontWeight: 800 }}>
                                        {order.owner?.name || '-'}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                      <PhoneRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                                      <Typography sx={{ fontSize: '0.8rem', color: UI.muted }}>
                                        {order.owner?.phone || '-'}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
                                      <EmailRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                                      <Typography sx={{ fontSize: '0.8rem', color: UI.muted }} noWrap>
                                        {order.owner?.email || '-'}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Box>

                                <Box sx={{ p: 1.4, borderRadius: '16px', background: UI.surfaceSoft, border: `1px solid ${UI.border}` }}>
                                  <Typography sx={{ fontSize: '0.72rem', color: UI.faint, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Payment Details
                                  </Typography>
                                  <Stack spacing={0.65} sx={{ mt: 1 }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: UI.text, fontWeight: 800 }}>
                                      Amount: ₹{order.payment?.amount ?? 0} {order.payment?.currency || 'INR'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: UI.muted }}>
                                      Method: {order.payment?.payment_method || '-'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: UI.muted, wordBreak: 'break-all' }}>
                                      Payment ID: {order.payment?.payment_id || '-'}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Box>

                              <Box sx={{ p: 1.45, borderRadius: '18px', background: '#fbfcfe', border: `1px solid ${UI.border}` }}>
                                <Typography sx={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: UI.faint }}>
                                  Timeline
                                </Typography>
                                <Stack spacing={1} sx={{ mt: 1.2 }}>
                                  {(order.timeline || []).map((item, index) => (
                                    <Stack key={`${order.id}-${index}`} direction={{ xs: 'column', sm: 'row' }} spacing={0.7} justifyContent="space-between">
                                      <Typography sx={{ fontSize: '0.82rem', color: UI.text, fontWeight: 800 }}>
                                        {item.status}
                                      </Typography>
                                      <Typography sx={{ fontSize: '0.8rem', color: UI.muted }}>
                                        {formatDate(item.time)}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                              </Box>

                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.1} justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: UI.muted }}>
                                  Created: <Box component="span" sx={{ color: UI.text, fontWeight: 700 }}>{formatDate(order.created_at)}</Box>
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: UI.muted }}>
                                  Updated: <Box component="span" sx={{ color: UI.text, fontWeight: 700 }}>{formatDate(order.updated_at)}</Box>
                                </Typography>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
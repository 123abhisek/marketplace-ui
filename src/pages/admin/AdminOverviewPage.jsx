
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import adminOrdersService from '../../services/adminOrdersApi';

const colors = {
  navy: '#16213a',
  blue: '#3e7bfa',
  purple: '#8067d9',
  orange: '#f47b4d',
  green: '#149b7d',
  red: '#e05b65',
  text: '#182233',
  muted: '#7c8799',
  background: '#f4f6fa',
  border: 'rgba(27, 42, 67, 0.08)',
};

const cardSx = {
  borderRadius: '24px',
  border: `1px solid ${colors.border}`,
  boxShadow: '0 12px 35px rgba(38, 54, 82, 0.055)',
  background: '#fff',
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.detail ||
  error?.response?.detail ||
  error?.message ||
  fallback;

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

function IconBadge({ children, color, background }) {
  return (
    <Box
      sx={{
        width: 46,
        height: 46,
        borderRadius: '15px',
        display: 'grid',
        placeItems: 'center',
        color,
        background,
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

function StatCard({ title, value, helper, icon, color, background, trend }) {
  return (
    <Card sx={{ ...cardSx, height: '100%' }}>
      <CardContent sx={{ p: 2.3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <IconBadge color={color} background={background}>
            {icon}
          </IconBadge>
          <IconButton size="small" sx={{ color: '#9aa4b3' }}>
            <MoreHorizRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Typography sx={{ mt: 2.2, color: colors.muted, fontSize: 13, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 0.35, color: colors.text, fontSize: 28, fontWeight: 950, letterSpacing: '-0.04em' }}>
          {value}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 1 }}>
          {trend !== undefined && (
            <Chip
              size="small"
              label={`${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`}
              sx={{
                height: 22,
                fontWeight: 800,
                color: trend >= 0 ? colors.green : colors.red,
                background: trend >= 0 ? 'rgba(20,155,125,.1)' : 'rgba(224,91,101,.1)',
              }}
            />
          )}
          <Typography sx={{ color: colors.muted, fontSize: 11.5, fontWeight: 600 }}>
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value, icon, color, background, progress }) {
  return (
    <Box sx={{ p: 1.6, borderRadius: '17px', background: '#fbfcfe', border: `1px solid ${colors.border}` }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <IconBadge color={color} background={background}>{icon}</IconBadge>
          <Typography sx={{ color: colors.text, fontSize: 13, fontWeight: 750 }}>{label}</Typography>
        </Stack>
        <Typography sx={{ color: colors.text, fontWeight: 900, fontSize: 14 }}>{value}</Typography>
      </Stack>
      {progress !== undefined && (
        <LinearProgress
          variant="determinate"
          value={Math.min(Math.max(progress, 0), 100)}
          sx={{ mt: 1.2, height: 6, borderRadius: 5, background: `${color}20`, '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 5 } }}
        />
      )}
    </Box>
  );
}

function StatusChip({ status }) {
  const normalized = String(status || '').toLowerCase();
  const isConfirmed = ['confirmed', 'completed', 'success', 'paid'].includes(normalized);
  const isPending = ['pending', 'processing', 'in_progress'].includes(normalized);
  const color = isConfirmed ? colors.green : isPending ? '#c68b16' : colors.red;
  const background = isConfirmed ? 'rgba(20,155,125,.1)' : isPending ? 'rgba(198,139,22,.12)' : 'rgba(224,91,101,.1)';
  return <Chip size="small" label={status || 'Unknown'} sx={{ height: 24, color, background, fontWeight: 800, textTransform: 'capitalize' }} />;
}

function ActivityItem({ title, subtitle, amount, status }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.4} sx={{ py: 1.25 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: '12px', display: 'grid', placeItems: 'center', color: colors.blue, background: 'rgba(62,123,250,.1)' }}>
        <ShoppingBagRoundedIcon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography noWrap sx={{ color: colors.text, fontSize: 13, fontWeight: 800 }}>{title}</Typography>
        <Typography noWrap sx={{ color: colors.muted, fontSize: 11.5 }}>{subtitle}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ color: colors.text, fontSize: 13, fontWeight: 900 }}>{amount}</Typography>
        <StatusChip status={status} />
      </Box>
    </Stack>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({});
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [sellersWithOrders, setSellersWithOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, customersData, sellersData, sellerOrdersData] = await Promise.all([
        adminOrdersService.getDashboardStats(),
        adminOrdersService.getCustomers(0, 100),
        adminOrdersService.getSellers(0, 100),
        adminOrdersService.getSellersWithOrders(0, 100),
      ]);

      setStats(statsData || {});
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setSellers(Array.isArray(sellersData) ? sellersData : []);
      setSellersWithOrders(Array.isArray(sellerOrdersData) ? sellerOrdersData : []);

      const allOrders = Array.isArray(sellerOrdersData)
        ? sellerOrdersData.flatMap((seller) =>
            Array.isArray(seller.orders)
              ? seller.orders.map((order) => ({ ...order, seller_name: seller.name }))
              : [],
          )
        : [];
      setOrders(allOrders);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load admin dashboard data.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const metrics = useMemo(() => {
    const totalCustomers = Number(stats.total_customers ?? customers.length);
    const totalSellers = Number(stats.total_sellers ?? sellers.length);
    const totalProperties = Number(stats.total_properties ?? sellers.reduce((sum, seller) => sum + (seller.properties?.length || 0), 0));
    const totalVehicles = Number(stats.total_vehicles ?? sellers.reduce((sum, seller) => sum + (seller.vehicles?.length || 0), 0));
    const totalBookings = Number(stats.total_bookings ?? sellersWithOrders.reduce((sum, seller) => sum + Number(seller.total_orders || 0), 0));
    const totalRevenue = Number(stats.total_revenue ?? sellersWithOrders.reduce((sum, seller) => sum + Number(seller.total_revenue || 0), 0));
    const premiumCustomers = customers.filter((customer) => Boolean(customer.is_premium || customer.isPremium)).length;
    const activeCustomers = customers.filter((customer) => customer.is_active).length;
    const confirmedOrders = sellersWithOrders.reduce((sum, seller) => sum + Number(seller.confirmed_orders || 0), 0);
    const pendingOrders = sellersWithOrders.reduce((sum, seller) => sum + Number(seller.pending_orders || 0), 0);
    const cancelledOrders = sellersWithOrders.reduce((sum, seller) => sum + Number(seller.cancelled_orders || 0), 0);
    const premiumRate = totalCustomers ? (premiumCustomers / totalCustomers) * 100 : 0;
    const averageBookingValue = totalBookings ? totalRevenue / totalBookings : 0;

    return {
      totalCustomers,
      totalSellers,
      totalProperties,
      totalVehicles,
      totalBookings,
      totalRevenue,
      premiumCustomers,
      activeCustomers,
      confirmedOrders,
      pendingOrders,
      cancelledOrders,
      premiumRate,
      averageBookingValue,
    };
  }, [stats, customers, sellers, sellersWithOrders]);

  const topSeller = useMemo(
    () => [...sellersWithOrders].sort((a, b) => Number(b.total_revenue || 0) - Number(a.total_revenue || 0))[0],
    [sellersWithOrders],
  );

  const filteredCustomers = customers.filter((customer) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [customer.name, customer.email, customer.phone, customer.city].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const filteredSellers = sellers.filter((seller) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [seller.name, seller.email, seller.phone, seller.city].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const displayRows = tab === 0 ? filteredCustomers : filteredSellers;

  const exportData = async () => {
    try {
      const response = tab === 0 ? await adminOrdersService.exportCustomers() : await adminOrdersService.exportSellers();
      const blob = response?.data ?? response;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = tab === 0 ? 'customers_export.xlsx' : 'sellers_export.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err, 'Export failed.'));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: colors.background, p: { xs: 2, md: 3.5 } }}>
      <Box sx={{ maxWidth: 1600, mx: 'auto' }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} gap={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 48, height: 48, borderRadius: '16px', display: 'grid', placeItems: 'center', color: '#fff', background: `linear-gradient(135deg, ${colors.blue}, ${colors.purple})` }}>
                <AdminPanelSettingsRoundedIcon />
              </Box>
              <Box>
                <Typography sx={{ color: colors.text, fontSize: { xs: 25, md: 31 }, fontWeight: 950, letterSpacing: '-.045em' }}>Admin Overview</Typography>
                <Typography sx={{ color: colors.muted, fontSize: 13 }}>Monitor your marketplace performance and platform activity.</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={loadDashboard} disabled={loading} startIcon={<RefreshRoundedIcon />} sx={{ borderRadius: '13px', borderColor: colors.border, color: colors.text, fontWeight: 800 }}>Refresh</Button>
              <Button variant="contained" onClick={exportData} startIcon={<DownloadRoundedIcon />} sx={{ borderRadius: '13px', background: colors.navy, fontWeight: 800, '&:hover': { background: '#253555' } }}>Export</Button>
            </Stack>
          </Stack>

          {error && <Alert severity="error" sx={{ borderRadius: '15px' }}>{error}</Alert>}
          {loading && <LinearProgress sx={{ borderRadius: 4 }} />}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Total customers" value={metrics.totalCustomers} helper={`${metrics.activeCustomers} active accounts`} icon={<PeopleAltRoundedIcon />} color={colors.blue} background="rgba(62,123,250,.11)" /></Grid>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Total sellers" value={metrics.totalSellers} helper={`${metrics.totalProperties + metrics.totalVehicles} total listings`} icon={<StorefrontRoundedIcon />} color={colors.purple} background="rgba(128,103,217,.12)" /></Grid>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Total bookings" value={metrics.totalBookings} helper={`${metrics.confirmedOrders} confirmed orders`} icon={<ShoppingBagRoundedIcon />} color={colors.orange} background="rgba(244,123,77,.12)" /></Grid>
            <Grid item xs={12} sm={6} lg={3}><StatCard title="Total revenue" value={formatCurrency(metrics.totalRevenue)} helper={`Average ${formatCurrency(metrics.averageBookingValue)} per booking`} icon={<CurrencyRupeeRoundedIcon />} color={colors.green} background="rgba(20,155,125,.12)" /></Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} lg={8}>
              <Card sx={cardSx}>
                <CardContent sx={{ p: { xs: 2, md: 2.8 } }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={1.5}>
                    <Box>
                      <Typography sx={{ color: colors.text, fontSize: 18, fontWeight: 900 }}>Marketplace performance</Typography>
                      <Typography sx={{ color: colors.muted, fontSize: 12.5, mt: .4 }}>Current data from the admin service endpoints</Typography>
                    </Box>
                    <Chip label="Live data" size="small" sx={{ color: colors.green, background: 'rgba(20,155,125,.1)', fontWeight: 800 }} />
                  </Stack>

                  <Grid container spacing={1.5} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}><SummaryRow label="Property listings" value={metrics.totalProperties} icon={<HomeWorkRoundedIcon fontSize="small" />} color={colors.green} background="rgba(20,155,125,.1)" /></Grid>
                    <Grid item xs={12} sm={6}><SummaryRow label="Vehicle listings" value={metrics.totalVehicles} icon={<DirectionsCarRoundedIcon fontSize="small" />} color={colors.blue} background="rgba(62,123,250,.1)" /></Grid>
                    <Grid item xs={12} sm={6}><SummaryRow label="Premium customers" value={`${metrics.premiumCustomers} (${metrics.premiumRate.toFixed(1)}%)`} progress={metrics.premiumRate} icon={<WorkspacePremiumRoundedIcon fontSize="small" />} color={colors.purple} background="rgba(128,103,217,.1)" /></Grid>
                    <Grid item xs={12} sm={6}><SummaryRow label="Average booking value" value={formatCurrency(metrics.averageBookingValue)} icon={<TrendingUpRoundedIcon fontSize="small" />} color={colors.orange} background="rgba(244,123,77,.1)" /></Grid>
                  </Grid>

                  <Box sx={{ mt: 2, p: 2, borderRadius: '18px', background: 'linear-gradient(135deg, #edf3ff, #f7f4ff)' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                      <Box><Typography sx={{ color: colors.muted, fontSize: 12, fontWeight: 700 }}>Top seller by revenue</Typography><Typography sx={{ color: colors.text, fontSize: 20, fontWeight: 950, mt: .4 }}>{topSeller?.name || 'No seller data'}</Typography><Typography sx={{ color: colors.green, fontWeight: 900 }}>{formatCurrency(topSeller?.total_revenue || 0)}</Typography></Box>
                      <Box sx={{ textAlign: { sm: 'right' } }}><Typography sx={{ color: colors.muted, fontSize: 12, fontWeight: 700 }}>Order status</Typography><Stack direction="row" spacing={.8} sx={{ mt: .8 }}><Chip size="small" icon={<CheckCircleRoundedIcon />} label={metrics.confirmedOrders} color="success" /><Chip size="small" icon={<PendingRoundedIcon />} label={metrics.pendingOrders} color="warning" /><Chip size="small" icon={<CancelRoundedIcon />} label={metrics.cancelledOrders} color="error" /></Stack></Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card sx={{ ...cardSx, height: '100%' }}>
                <CardContent sx={{ p: 2.8 }}>
                  <Typography sx={{ color: colors.text, fontSize: 18, fontWeight: 900 }}>Recent activity</Typography>
                  <Typography sx={{ color: colors.muted, fontSize: 12.5, mt: .4 }}>Latest transactions from sellers</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  {orders.length ? orders.slice(0, 5).map((order, index) => <ActivityItem key={order.id || order.order_id || index} title={order.title || order.name || order.order_id || `Order ${index + 1}`} subtitle={order.seller_name || order.customer_name || order.created_at || 'Marketplace order'} amount={formatCurrency(order.total_amount ?? order.amount ?? order.price ?? 0)} status={order.status || 'pending'} />) : <Typography sx={{ color: colors.muted, py: 4, textAlign: 'center', fontSize: 13 }}>No order activity available.</Typography>}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} gap={2}>
                <Box><Typography sx={{ color: colors.text, fontSize: 18, fontWeight: 900 }}>Platform records</Typography><Typography sx={{ color: colors.muted, fontSize: 12.5, mt: .4 }}>Browse customers and sellers returned by the admin APIs.</Typography></Box>
                <Stack direction="row" spacing={1}><TextField size="small" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> }} sx={{ width: { xs: '100%', sm: 250 }, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} /></Stack>
              </Stack>

              <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mt: 2, minHeight: 42, '& .MuiTab-root': { minHeight: 42, fontWeight: 800, textTransform: 'none' } }}>
                <Tab label={`Customers (${customers.length})`} />
                <Tab label={`Sellers (${sellers.length})`} />
              </Tabs>

              <Box sx={{ mt: 1.5, overflowX: 'auto' }}>
                {displayRows.length ? displayRows.slice(0, 8).map((record) => (
                  <Stack key={record.id} direction="row" alignItems="center" spacing={2} sx={{ minWidth: 680, py: 1.3, borderBottom: `1px solid ${colors.border}` }}>
                    <Box sx={{ width: 38, height: 38, borderRadius: '13px', display: 'grid', placeItems: 'center', color: tab === 0 ? colors.blue : colors.purple, background: tab === 0 ? 'rgba(62,123,250,.1)' : 'rgba(128,103,217,.1)' }}>{tab === 0 ? <PeopleAltRoundedIcon fontSize="small" /> : <StorefrontRoundedIcon fontSize="small" />}</Box>
                    <Box sx={{ flex: 1, minWidth: 180 }}><Typography sx={{ color: colors.text, fontWeight: 850, fontSize: 13 }}>{record.name || 'Unnamed'}</Typography><Typography sx={{ color: colors.muted, fontSize: 11.5 }}>{record.email || record.phone || 'No contact information'}</Typography></Box>
                    <Typography sx={{ width: 130, color: colors.muted, fontSize: 12 }}>{record.city || '—'}</Typography>
                    <Typography sx={{ width: 110, color: colors.text, fontSize: 12, fontWeight: 800 }}>{tab === 0 ? `${record.total_bookings || 0} bookings` : `${record.total_listings || 0} listings`}</Typography>
                    <StatusChip status={record.is_active ? 'Active' : 'Inactive'} />
                  </Stack>
                )) : <Typography sx={{ color: colors.muted, textAlign: 'center', py: 4 }}>No records found.</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
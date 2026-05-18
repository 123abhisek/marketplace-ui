
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
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import adminUsersService from '../../services/UserService';

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
  shadowSm: '0 2px 10px rgba(15,23,42,0.04)',
  shadowMd: '0 10px 32px rgba(15,23,42,0.06)',
};

const cardSx = {
  borderRadius: '22px',
  border: `1px solid ${UI.border}`,
  background: UI.surface,
  boxShadow: UI.shadowSm,
};

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'U';
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function getRoleColor(role = '') {
  const lower = String(role).toLowerCase();
  if (lower.includes('admin')) {
    return {
      color: UI.purple,
      bg: UI.purpleSoft,
      icon: <AdminPanelSettingsRoundedIcon sx={{ fontSize: 16 }} />,
    };
  }
  return {
    color: UI.blue,
    bg: UI.blueSoft,
    icon: <PersonRoundedIcon sx={{ fontSize: 16 }} />,
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminUsersService.getAll({ skip: 0, limit: 100 });
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setUsers([]);
      setError(err?.response?.detail || err?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email, user.phone, user.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [users, search]);

  const counts = useMemo(() => {
    const premium = users.filter((user) => Boolean(user.is_premium)).length;
    const free = users.filter((user) => !user.is_premium).length;
    const admin = users.filter((user) => String(user.role || '').toLowerCase().includes('admin')).length;
    return { premium, free, admin };
  }, [users]);

  return (
    <Box sx={{ minHeight: '100vh', background: UI.bg, p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box
        sx={{
          maxWidth: 1280,
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
                  <Typography
                    sx={{
                      fontSize: { xs: '1.45rem', sm: '1.8rem' },
                      fontWeight: 900,
                      color: UI.text,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    Users Management
                  </Typography>
                  <Typography sx={{ mt: 0.7, fontSize: '0.9rem', color: UI.muted, lineHeight: 1.65 }}>
                    Displaying all users with name, email, phone number, and role.
                  </Typography>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.1} sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone, role"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ fontSize: 18, color: UI.faint }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      minWidth: { md: 320 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '14px',
                        background: UI.surfaceSoft,
                      },
                    }}
                  />
                  <Tooltip title="Refresh users">
                    <IconButton
                      onClick={loadUsers}
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
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0,1fr))' },
              gap: 1.6,
            }}
          >
            <StatCard
              title="Premium Users"
              value={counts.premium}
              subtitle="Users with premium access"
              icon={<WorkspacePremiumRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.purple}
              bg={UI.purpleSoft}
            />
            <StatCard
              title="Free Users"
              value={counts.free}
              subtitle="Users on free plan"
              icon={<PersonRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.primary}
              bg={UI.primarySoft}
            />
            <StatCard
              title="Admin Users"
              value={counts.admin}
              subtitle="Users with admin role"
              icon={<ShieldRoundedIcon sx={{ fontSize: 22 }} />}
              color={UI.blue}
              bg={UI.blueSoft}
            />
          </Box>

          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 1.6, sm: 2.2 } }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: UI.faint,
                    }}
                  >
                    All users
                  </Typography>
                  <Typography
                    sx={{ mt: 0.55, fontSize: '1.08rem', color: UI.text, fontWeight: 900, letterSpacing: '-0.02em' }}
                  >
                    Total displayed: {filteredUsers.length}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: UI.border }} />

                {loading ? (
                  <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
                    <Stack spacing={1.2} alignItems="center">
                      <CircularProgress size={34} sx={{ color: UI.primary }} />
                      <Typography sx={{ fontSize: '0.88rem', color: UI.muted, fontWeight: 700 }}>
                        Loading users...
                      </Typography>
                    </Stack>
                  </Box>
                ) : filteredUsers.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '1rem', color: UI.text, fontWeight: 800 }}>
                      No users found
                    </Typography>
                    <Typography sx={{ mt: 0.6, fontSize: '0.84rem', color: UI.muted }}>
                      Try another search term or check whether the API returned any users.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.35}>
                    {filteredUsers.map((user) => {
                      const roleTone = getRoleColor(user.role);

                      return (
                        <Card
                          key={user.id}
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
                            <Stack
                              direction={{ xs: 'column', md: 'row' }}
                              spacing={1.5}
                              justifyContent="space-between"
                              alignItems={{ md: 'center' }}
                            >
                              <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 50,
                                    height: 50,
                                    bgcolor: UI.primary,
                                    fontWeight: 900,
                                    fontSize: '0.94rem',
                                  }}
                                >
                                  {getInitials(user.name || user.email || 'User')}
                                </Avatar>

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography sx={{ fontSize: '0.97rem', fontWeight: 900, color: UI.text }} noWrap>
                                    {user.name || 'Unnamed User'}
                                  </Typography>
                                  <Stack spacing={0.5} sx={{ mt: 0.7 }}>
                                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
                                      <EmailRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                                      <Typography sx={{ fontSize: '0.82rem', color: UI.muted }} noWrap>
                                        {user.email || '-'}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                      <PhoneRoundedIcon sx={{ fontSize: 16, color: UI.faint }} />
                                      <Typography sx={{ fontSize: '0.82rem', color: UI.muted }}>
                                        {user.phone || '-'}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Box>
                              </Stack>

                              <Chip
                                size="small"
                                icon={roleTone.icon}
                                label={user.role || 'User'}
                                sx={{
                                  height: 30,
                                  borderRadius: '999px',
                                  fontWeight: 800,
                                  fontSize: '0.74rem',
                                  color: roleTone.color,
                                  background: roleTone.bg,
                                  border: 'none',
                                  alignSelf: { xs: 'flex-start', md: 'center' },
                                }}
                              />
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
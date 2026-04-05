// src/components/EmptyState.jsx
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import InboxRoundedIcon from '@mui/icons-material/InboxRounded'

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Create your first listing to get started.',
  actionLabel,
  onAction,
}) {
  return (
    <Card className="rounded-3xl border border-dashed border-slate-300 bg-white">
      <CardContent className="py-12">
        <Stack spacing={2} alignItems="center" textAlign="center">
          <InboxRoundedIcon color="disabled" sx={{ fontSize: 54 }} />
          <Typography variant="h6" fontWeight={800}>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
          {actionLabel && <Button onClick={onAction}>{actionLabel}</Button>}
        </Stack>
      </CardContent>
    </Card>
  )
}
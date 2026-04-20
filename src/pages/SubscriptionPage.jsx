// src/pages/SubscriptionPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardContent, Chip, Container, Stack, Typography } from '@mui/material'
import ImageUploader from '../components/ImageUploader'
import { useAppState } from '../hooks/useAppState'

export default function SubscriptionPage() {
  const [files, setFiles] = useState([])
  const { upgradePremium } = useAppState()
  const navigate = useNavigate()

  const activate = () => {
    upgradePremium()
    navigate('/dashboard/subscription')
  }

  return (
    <Container maxWidth="sm" className="py-12">
      <Card className="rounded-[32px]">
        <CardContent className="p-6 md:p-8">
          <Stack spacing={2}>
            <Chip label="Premium Plan" color="success" className="w-fit" />
            <Typography variant="h4" fontWeight={800}>Premium Access — ₹299</Typography>
            <Typography color="text.secondary">
              Unlock full listing details, contact numbers, and posting access for property and vehicle listings.
            </Typography>
            <Card className="rounded-3xl border border-slate-200 bg-slate-50">
              <CardContent>
                <Typography fontWeight={800}>UPI Payment Instructions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pay ₹299 to: easydeal@upi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your mobile number in payment note, then upload the screenshot below.
                </Typography>
              </CardContent>
            </Card>
            <ImageUploader value={files} onChange={setFiles} label="Upload Payment Screenshot" />
            <Button onClick={activate} size="large">Activate Premium</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}
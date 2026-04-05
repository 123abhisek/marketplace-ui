// src/dashboard/ProfilePage.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import FormInput from '../components/FormInput'
import SelectInput from '../components/SelectInput'
import ImageUploader from '../components/ImageUploader'
import { useAppState } from '../hooks/useAppState'

export default function ProfilePage() {
  const { user, updateProfile } = useAppState()
  const [files, setFiles] = useState(user.photo ? [{ name: 'profile-photo', preview: user.photo }] : [])
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      gender: user.gender,
      dob: user.dob,
      location: user.location,
      state: user.state,
      city: user.city,
      pincode: user.pincode,
      occupation: user.occupation,
      email: user.email,
      mobile: user.mobile,
    },
  })

  const onSubmit = (data) => {
    updateProfile({
      ...data,
      photo: files[0]?.preview || user.photo,
    })
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={800}>Profile</Typography>
      <Card className="rounded-3xl">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ImageUploader value={files} onChange={setFiles} label="Update Profile Photo" />
              </Grid>
              <Grid item xs={12} md={6}><FormInput name="name" label="Name" control={control} /></Grid>
              <Grid item xs={12} md={6}>
                <SelectInput
                  name="gender"
                  label="Gender"
                  control={control}
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6}><FormInput name="dob" label="Date of Birth" type="date" control={control} /></Grid>
              <Grid item xs={12} md={6}><FormInput name="occupation" label="Occupation" control={control} /></Grid>
              <Grid item xs={12} md={4}><FormInput name="location" label="Location" control={control} /></Grid>
              <Grid item xs={12} md={4}><FormInput name="state" label="State" control={control} /></Grid>
              <Grid item xs={12} md={4}><FormInput name="city" label="City" control={control} /></Grid>
              <Grid item xs={12} md={6}><FormInput name="pincode" label="Pincode" control={control} /></Grid>
              <Grid item xs={12} md={6}><FormInput name="mobile" label="Mobile Number" control={control} /></Grid>
              <Grid item xs={12}><FormInput name="email" label="Email" control={control} /></Grid>
              <Grid item xs={12}><Button type="submit">Save Profile</Button></Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Stack>
  )
}
// src/forms/VehicleForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Grid } from '@mui/material'
import FormInput from '../components/FormInput'
import ImageUploader from '../components/ImageUploader'

export default function VehicleForm({ onSubmit }) {
  const [files, setFiles] = useState([])
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      vehicleNumber: '',
      brand: '',
      model: '',
      year: '',
      state: '',
      rtoCode: '',
      kmDriven: '',
      location: '',
      expectedPrice: '',
      contactNumber: '',
    },
  })

  return (
    <form
      onSubmit={handleSubmit((data) =>
        onSubmit({
          ...data,
          images: files.map((file) => file.preview),
        }),
      )}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><FormInput name="title" label="Listing Title" control={control} rules={{ required: 'Title is required' }} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="vehicleNumber" label="Vehicle Number" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="brand" label="Brand" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="model" label="Model" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="year" label="Year" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="state" label="State" control={control} /></Grid>
        <Grid item xs={12} md={4}><FormInput name="rtoCode" label="RTO Code" control={control} /></Grid>
        <Grid item xs={12} md={4}><FormInput name="kmDriven" label="KM Driven" control={control} /></Grid>
        <Grid item xs={12} md={4}><FormInput name="location" label="Location" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="expectedPrice" label="Expected Price" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="contactNumber" label="Contact Number" control={control} /></Grid>
        <Grid item xs={12}><ImageUploader value={files} onChange={setFiles} label="Upload Vehicle Photos" /></Grid>
        <Grid item xs={12}><Button type="submit">Submit Vehicle</Button></Grid>
      </Grid>
    </form>
  )
}
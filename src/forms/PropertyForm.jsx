// src/forms/PropertyForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Grid } from '@mui/material'
import FormInput from '../components/FormInput'
import SelectInput from '../components/SelectInput'
import ImageUploader from '../components/ImageUploader'

export default function PropertyForm({ onSubmit }) {
  const [files, setFiles] = useState([])
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      propertyType: '',
      location: '',
      apartmentName: '',
      floor: '',
      rooms: '',
      bedrooms: '',
      area: '',
      landArea: '',
      cropsGrown: '',
      expectedPrice: '',
      rentLease: '',
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
        <Grid item xs={12} md={6}>
          <FormInput name="title" label="Listing Title" control={control} rules={{ required: 'Title is required' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectInput
            name="propertyType"
            label="Property Type"
            control={control}
            rules={{ required: 'Property type is required' }}
            options={[
              { label: 'Residential', value: 'Residential' },
              { label: 'Commercial', value: 'Commercial' },
              { label: 'Agricultural', value: 'Agricultural' },
              { label: 'Site', value: 'Site' },
              { label: 'Flat', value: 'Flat' },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}><FormInput name="location" label="Location" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="apartmentName" label="Apartment Name" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="floor" label="Floor" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="rooms" label="Rooms" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="bedrooms" label="Bedrooms" control={control} /></Grid>
        <Grid item xs={12} md={3}><FormInput name="area" label="Area sq.ft" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="landArea" label="Land Area" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="cropsGrown" label="Crops Grown" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="expectedPrice" label="Expected Price" control={control} /></Grid>
        <Grid item xs={12} md={6}><FormInput name="rentLease" label="Rent / Lease Details" control={control} /></Grid>
        <Grid item xs={12}><FormInput name="contactNumber" label="Contact Number" control={control} /></Grid>
        <Grid item xs={12}><ImageUploader value={files} onChange={setFiles} label="Upload Multiple Property Images" /></Grid>
        <Grid item xs={12}><Button type="submit">Submit Property</Button></Grid>
      </Grid>
    </form>
  )
}
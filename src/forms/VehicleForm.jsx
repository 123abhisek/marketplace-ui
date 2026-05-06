

// src/forms/VehicleForm.jsx
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Grid } from "@mui/material";
import FormInput from "../components/FormInput";
import ImageUploader from "../components/ImageUploader";
import { filesToBase64, revokePreviewUrls } from "../utils/imageUtils";

export default function VehicleForm({ onSubmit }) {
  const [files, setFiles] = useState([]);

  // ✅ Always track latest files via ref for safe cleanup on unmount
  const filesRef = useRef(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);
  useEffect(() => {
    return () => revokePreviewUrls(filesRef.current.map((f) => f.preview));
  }, []);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      vehicleNumber: "",
      brand: "",
      model: "",
      year: "",
      state: "",
      rtoCode: "",
      kmDriven: "",
      location: "",
      expectedPrice: "",
      contactNumber: "",
    },
  });

  const handleFormSubmit = async (data) => {
    // ✅ Extract raw File objects → convert to base64 data URIs
    const rawFiles = files
      .map((f) => (f && f.file instanceof File ? f.file : f))
      .filter(Boolean);

    const base64Images = await filesToBase64(rawFiles);

    onSubmit({
      ...data,
      images: base64Images, // ✅ "data:image/jpeg;base64,..." — persists in DB
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormInput
            name="title"
            label="Listing Title"
            control={control}
            rules={{ required: "Title is required" }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormInput
            name="vehicleNumber"
            label="Vehicle Number"
            control={control}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormInput name="brand" label="Brand" control={control} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormInput name="model" label="Model" control={control} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormInput name="year" label="Year" control={control} />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormInput name="state" label="State" control={control} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormInput name="rtoCode" label="RTO Code" control={control} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormInput name="kmDriven" label="KM Driven" control={control} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormInput name="location" label="Location" control={control} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormInput
            name="expectedPrice"
            label="Expected Price"
            control={control}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormInput
            name="contactNumber"
            label="Contact Number"
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <ImageUploader
            value={files}
            onChange={setFiles}
            label="Upload Vehicle Photos"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit">Submit Vehicle</Button>
        </Grid>
      </Grid>
    </form>
  );
}

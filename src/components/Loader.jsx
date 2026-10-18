// src/components/Loader.jsx
import React from "react";
import { Grid } from "@mui/material";
import { CardSkeleton, CardSkeletonGrid } from "./skeletons/AppSkeletons";

export { CardSkeleton, CardSkeletonGrid };
export * from "./skeletons/AppSkeletons";

export default function Loader({ count = 6 }) {
  return <CardSkeletonGrid count={count} />;
}
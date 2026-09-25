import React from "react";
import { Stack } from "expo-router";
import { RoadmapProvider } from "../src/context/RoadmapContext";

export default function Layout() {
  return (
    <RoadmapProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RoadmapProvider>
  );
}
import { useEffect, useState } from "react";

import useSeriesReducer from "../hooks/useSeriesReducer";

export default function NewHero() {
  const { isSeriesLoading, newSeason, seriesError, series } =
    useSeriesReducer();

  useEffect(() => {
    if (newSeason) console.log(newSeason, "3");
    if (series) console.log(series, "2");
  }, [newSeason, series]);
}

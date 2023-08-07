import { useEffect, useState } from "react";

import { useMovieReducer } from "../hooks/useMovieReducer";

export default function NewHero() {
  const { media } = useMovieReducer();

  useEffect(() => {
    console.log(media, "ee");
  }, [media]);
}

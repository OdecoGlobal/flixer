import { useEffect, useState } from "react";

import { useMovie } from "../hooks/useMovie";

export default function NewHero() {
  const { media, mediaInfo } = useMovie("2021", "2015", "2018", "");

  useEffect(() => {
    console.log(media, "ee");
  }, [mediaInfo]);
}

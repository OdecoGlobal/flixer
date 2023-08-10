import { useEffect, useState } from 'react';

import { useSeries } from '../hooks/useSeries';

export default function NewHero() {
  const { newSeason } = useSeries();

  useEffect(() => {
    if (newSeason) console.log(newSeason, 'o');
  }, [newSeason]);
  return <div>NewHero</div>;
}

import { useEffect, useState } from 'react';

import { useMovie } from '../hooks/useMovie';

export default function NewHero() {
  const { media } = useMovie(`&append_to_response=videos`);

  useEffect(() => {
    if (media) console.log(media, 'orro');
  }, [media]);
  return <div>NewHero</div>;
}

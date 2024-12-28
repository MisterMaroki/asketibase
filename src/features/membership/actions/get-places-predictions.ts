'use server';

import { getEnvVar } from '@/utils/get-env-var';

export async function getPlacesPredictions(input: string, countryCode?: string) {
  if (!input) return [];

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=address&key=${getEnvVar(process.env.MAPS_API_KEY, 'MAPS_API_KEY')}`
  );

  const data = await response.json();

  if (!data.predictions) {
    return [];
  }

  return data.predictions.map((prediction: any) => ({
    description: prediction.description,
    placeId: prediction.place_id,
  }));
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address&key=${getEnvVar(
      process.env.MAPS_API_KEY,
      'MAPS_API_KEY'
    )}`
  );

  const data = await response.json();

  if (!data.result) {
    return null;
  }

  return data.result.formatted_address;
}

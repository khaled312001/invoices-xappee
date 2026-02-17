import { cache } from "react";
import { Fetch } from "../actions/fetch";

export const getCarriers = cache(async () => {
  const { ok, data } = await Fetch(`carriers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "default",
  });
  if (ok) {
    return data.carriers;
  } else return [];
});

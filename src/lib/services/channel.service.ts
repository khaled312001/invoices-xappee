import { cache } from "react";
import { Fetch } from "../actions/fetch";

export const fetchChannels = async () => {
  const { ok, data } = await Fetch(`channels`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // cache: "force-cache",
  });
  if (ok) {
    return data.channels;
  } else return [];
};

export const fetchCahnnelsWithId = cache(async (ids: number[]) => {
  const { ok, data } = await Fetch(`channels/with-id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channelIds: ids }),
    cache: "force-cache",
  });
  return data.channels;
});

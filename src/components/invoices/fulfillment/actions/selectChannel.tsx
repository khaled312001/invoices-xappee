import { DataSelector } from "@/components/shared/dataSelector";
import { IChannel } from "@/types/channel";
import React, { useEffect } from "react";

export default function SelectChannels({
  channels,
  selectedChannelIds,
  setSelectedChannelIds,
}: {
  channels: IChannel[];
  setSelectedChannelIds: any;
  selectedChannelIds: number[];
}) {
  const savedSelectedChannelIds = JSON.parse(
    localStorage.getItem("selectedChannelIds") || "[]"
  );
  useEffect(() => {
    if (savedSelectedChannelIds.length > 0 && selectedChannelIds.length === 0) {
      setSelectedChannelIds(savedSelectedChannelIds);
    }
  }, [savedSelectedChannelIds]);

  useEffect(() => {
    if (selectedChannelIds.length > 0) {
      localStorage.setItem(
        "selectedChannelIds",
        JSON.stringify(selectedChannelIds)
      );
    }
  }, [selectedChannelIds]);

  return (
    <DataSelector
      selectAll
      data={channels}
      itemKey="channel_id"
      returnKey="channel_id"
      selectData={setSelectedChannelIds}
      selectedData={selectedChannelIds}
      text="channels"
      extra={"type"}
      mutliple={true}
      name={"name"}
    />
  );
}

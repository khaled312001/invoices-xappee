"use client";
import useInfiniteScroll from "@/lib/hooks/useInfiniteScroll";
import { useDispatch, useSelector } from "@/redux/store";
import { fetchPaginatedItemsThunk } from "@/redux/slices/itemSlice/thunks/fetchPaginatedItemsThunk";
import { selectItemsSlice } from "@/redux/slices/itemSlice/selectors";
import React, { useCallback, useEffect } from "react";
import { ItemsTable } from "./table";
import Spinner from "../ui/custom/spinner";
import { itemslice } from "@/redux/slices/itemSlice/itemSlice";

export function ItemsContainer({
  initialItems,
  nextPage,
  user
}: {
  initialItems: any[];
  nextPage: number;
  user: any;
}) {
  const dispatch = useDispatch();
  const { items, page, itemsStatus } = useSelector(selectItemsSlice);

  const handleFetchNextPage = useCallback(
    async () => await dispatch(fetchPaginatedItemsThunk(page)),
    [page]
  );

  useEffect(() => {
    dispatch(itemslice.actions.setInitialState({ initialItems, nextPage }));
  }, [dispatch, initialItems, nextPage]);

  const isFetching = useInfiniteScroll(handleFetchNextPage);

  const loading = itemsStatus === "loading" || isFetching;
  useEffect(() => {
    if (nextPage > 2) {
      handleFetchNextPage();
    }
  }, [isFetching, dispatch]);

  
  return (
    <div>
      <ItemsTable loading={loading} data={items} user={user} />
      {loading && (
        <div className="flex items-center w-full justify-center p-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/custom/spinner";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { appendOrdersThunk } from "@/redux/slices/orderSlice/thunks/appendOrdersThunk";
import { useDispatch, useSelector } from "@/redux/store";
import React from "react";

export default function ImportOneOrder({ query }: { query: string }) {
  const dispatch = useDispatch();
  const { ordersStatus } = useSelector(selectOrderSlice);
  return (
    <>
      {query && query.length > 6 ? (
        <div className="text-center mt-[40vh] text-muted-foreground space-y-2 flex flex-col items-center justify-center">
          <p className="font-bold text-xl"> {query}</p>
          <Button
            onClick={() => dispatch(appendOrdersThunk(query))}
            variant={"ghost"}
            className=" flex items-center gap-2 pl-8"
          >
            {`This order doesn't exist, Do you want to import it?`}
            <span
              className={`${
                ordersStatus === "loading" ? "opacity-1" : "opacity-0"
              }`}
            >
              {<Spinner />}
            </span>
          </Button>
        </div>
      ) : (
        <div className="text-center mt-[40vh] text-muted-foreground">
          <p>No results</p>
        </div>
      )}
    </>
  );
}

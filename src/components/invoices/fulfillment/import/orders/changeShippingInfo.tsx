"use client";

import { updateOrder } from "@/lib/services/orders.service";
import { orderSlice } from "@/redux/slices/orderSlice/orderSlice";
import { selectOrderSlice } from "@/redux/slices/orderSlice/selectors";
import { fetchCarriersThunk } from "@/redux/slices/orderSlice/thunks/fetchCarriersThunk";
import { useDispatch, useSelector } from "@/redux/store";
import { ArrowRight, Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export const ChangeShippingInfoButton = ({
  carrierName,
  service,
  selectedServcie,
  handleUpdateOrderShippingInfo,
}: {
  carrierName: string;
  service: any;
  selectedServcie: string;
  handleUpdateOrderShippingInfo: any;
}) => {
  return (
    <button
      className="hover:bg-secondary p-1.5 w-full text-left rounded-md flex items-center gap-2 justify-between"
      onClick={() => handleUpdateOrderShippingInfo(carrierName, service.name)}
    >
      {service.name}
      {selectedServcie === service.name && (
        <Check size={17} className="text-primary" />
      )}
    </button>
  );
};

export const ChangeShippingInfo = ({
  orderId,
  selectedServcie,
  selectedCarrier,
  handleProblemSolved,
}: {
  orderId: string;
  selectedServcie: string;
  selectedCarrier: string;
  handleProblemSolved?: (id: string) => void;
}) => {
  const { carriers } = useSelector(selectOrderSlice);
  const dispatch = useDispatch();

  const handleUpdateOrderShippingInfo = async (
    carrierName: string,
    shippingMethod: string
  ) => {
    try {
      const isUpdated = await updateOrder(orderId, {
        carrierName,
        shippingMethod,
      });
      if (isUpdated) {
        toast.success(`Shipping method is changes successfuly`);
        if (handleProblemSolved) {
          handleProblemSolved(orderId);
        } else {
          // if there is no callback function to handle problems then the funciotn is called from the order context menu
          // so we update the state in store
          dispatch(
            orderSlice.actions.updateShippingInfo({
              id: orderId,
              values: { carrierName, shippingMethod },
            })
          );
        }
      } else {
        toast.error(`Something went wrong, Please try again later.`);
      }
    } catch (err: any) {
      toast.error(
        `Something went wrong, Please try again later. | ${err.message}`
      );
    }
  };
  return (
    <div className="text-left p-1  space-y-1 text-sm">
      {carriers &&
        carriers.map((carrier) => (
          <div
            className="group hover:bg-secondary p-1.5 rounded-md"
            key={carrier.id}
          >
            <p className="flex items-center justify-between">
              {carrier.name}{" "}
              <ArrowRight
                size={17}
                className={`${
                  selectedCarrier === carrier.name && "text-primary"
                }`}
              />
            </p>
            <div className="hidden group-hover:block bg-background ml-[140px] absolute text-left w-[250px] p-2 space-y-1 rounded-lg shadow-lg">
              {carrier.services.map((service: any, i: number) => (
                <ChangeShippingInfoButton
                  carrierName={carrier.name}
                  handleUpdateOrderShippingInfo={handleUpdateOrderShippingInfo}
                  selectedServcie={selectedServcie}
                  key={i}
                  service={service}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

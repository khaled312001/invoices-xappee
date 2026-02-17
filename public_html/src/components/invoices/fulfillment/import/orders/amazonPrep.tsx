import { Button } from '@/components/ui/button';
import CloseBtn from '@/components/ui/custom/closeBtn';
import Spinner from '@/components/ui/custom/spinner';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { updateOrder } from '@/lib/services/orders.service';
import { orderSlice } from '@/redux/slices/orderSlice/orderSlice';
import { fixOneOrderThunk } from '@/redux/slices/orderSlice/thunks/fixOneOrderThunk';
import { useDispatch } from '@/redux/store';
import { PopoverClose } from '@radix-ui/react-popover';
import { UploadCloud } from 'lucide-react';

import React, { useState } from 'react'
import { toast } from 'sonner';

export default function AmazonPrep({ order }: { order: any }) {

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prepQty, setPrepQty] = useState(order.prepQty);
    const [prepCharge, setPrepCharge] = useState(order.prepCharge);
    const dispatch = useDispatch();
    

    const handleSubmitPrepCharge = async () => {
        try {
            setLoading(true);
          const isUpdated = await updateOrder(order.id, {
            prepQty: Number(prepQty),
            prepCharge: Number(prepCharge)
          });
          if (isUpdated) {
            toast.success(`Prep Charge is changed successfuly`);
            dispatch(
                orderSlice.actions.updateShippingInfo({
                  id: order._id,
                  values: { prepQty, prepCharge },
                })
              );
              await dispatch(fixOneOrderThunk(order.id));
            toast.info(
                "Don't forget to generate invoice again after finshing."
              );
              
         
          } else {
            toast.error(`Something went wrong, Please try again later.`);
          }
        } catch (err: any) {
          toast.error(
            `Something went wrong, Please try again later. | ${err.message}`
          );
        }finally {
            setLoading(false);
            setIsPopoverOpen(false);
          }
      };

    return (
        <Popover onOpenChange={(v) => setIsPopoverOpen(v)} open={isPopoverOpen}>
            <PopoverTrigger onClick={() => setIsPopoverOpen(true)} asChild>
                <button  className="text-sm p-0" onClick={() => setIsPopoverOpen(true)}>
                    Edit Amazon Prep Charge
                </button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="grid gap-2 ">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium leading-none">Prep Charge</h4>
                            <PopoverClose>
                                <CloseBtn />
                            </PopoverClose>
                        </div>
                    </div>
                    <div className="grid relative items-center gap-2">
                        <Label
                            className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                            htmlFor="prepQty"
                        >
                            Qty
                        </Label>
                        <Input
                             value={prepQty}
                             onChange={(e) => setPrepQty(e.target.value)}
                            id="prepQty"
                            name="prepQty"
                            defaultValue={prepQty}
                            className="h-10 "
                        />
                    </div>

                    <div className="grid relative items-center gap-2">
                        <Label
                            className="absolute -top-2 text-xs font-light bg-background z-20 rounded-lg px-2 py-[1px]"
                            htmlFor="prepCharge"
                        >
                            fee charge
                        </Label>
                        <Input
                            value={prepCharge}
                            onChange={(e) => setPrepCharge(e.target.value)}
                            id="prepCharge"
                            name="prepCharge"
                            defaultValue={prepCharge}
                            className="h-10 "
                        />
                    </div>
                    <div className="flex">


                        <Button
                            disabled={loading}
                            onClick={handleSubmitPrepCharge}
                            className="gap-2 font-bold mt-2"
                        >
                            Upload {loading ? <Spinner /> : <UploadCloud size={20} />}
                        </Button></div>
                </div>

            </PopoverContent>
        </Popover>
    )
}

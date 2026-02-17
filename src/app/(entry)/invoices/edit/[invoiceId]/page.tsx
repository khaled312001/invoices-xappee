"use client";
import { DataSelector } from '@/components/shared/dataSelector';
import { fetchClients } from '@/lib/services/client.service';
import { fetchSearchItemsByName } from '@/lib/services/item.service';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Plus, PoundSterling, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/shared/datePicker';
import { toast } from 'sonner';
import { CustomInvoice, CustomInvoiceItem } from '@/types/invoice';
import { fetchCustomInvoiceById, fetchInvoiceById, updateCustomInvoice } from '@/lib/services/invoice.service';
import { useParams, useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useSession } from 'next-auth/react';




export default function EditInvoice({ params }: { params: { invoiceId: string } }) {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState('');
  const [sender, setSender] = useState('');
  const [items, setItems] = useState<CustomInvoiceItem[]>([{ description: '', qty: 1, price: 0, itemId: '' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [taxRate, setTaxRate] = useState(20); // Default tax rate
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState('percentage');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [tempDiscountAmount, setTempDiscountAmount] = useState(0);
  const [tempDiscountType, setTempDiscountType] = useState('percentage');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Date picker state
  const [showPayments, setShowPayments] = useState<boolean>(true);


  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const fetchData = async () => {
      console.log("params.invoiceId", params.invoiceId);
      try {
        // Fetch clients for the dropdown
        const clientData = await fetchClients();
        setClients(clientData);

        // Fetch invoice data by ID
        const { invoice } = await fetchCustomInvoiceById(params.invoiceId);
       setShowPayments(invoice.showPayments);
        //   console.log("invoice", invoice);

        setClient(invoice.client);
        setSender(invoice.sender);
        setItems(invoice.items);
        setTaxRate(invoice.taxRate);
        setTempDiscountAmount(invoice.discount);
        setTempDiscountType(invoice.discountType);
        setDiscountAmount(invoice.discount);
        setDiscountType(invoice.discountType);
        setSelectedDate(new Date(invoice.date)); // Prepopulate date picker
      } catch (error) {
        // console.error('Error fetching invoice:', error);
      }
    };

    fetchData();
  }, [params.invoiceId]);

  
  const user: any = session?.data.user || null;
  if (user && user.role !== "admin")
    return (
      <div className="w-full grid place-content-center text-muted-foreground">
        <p className="mt-[40vh]">Forbidden</p>
      </div>
    );




  const debouncedSearch = debounce(async (term, setFilteredItems, setLoading) => {
    if (term) {
      setLoading(true);
      try {
        const data = await fetchSearchItemsByName(term);
        setFilteredItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredItems([]);
    }
  }, 500);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term, setFilteredItems, setLoading);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // if (field === 'qty' || field === 'price') {
    //   newItems[index].total = (newItems[index].qty ?? 0) * (newItems[index].price ?? 0);
    // }

    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { description: '', qty: 1, price: 0, itemId: '' }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  };

  const calculateDiscount = () => {
    if (discountType === 'percentage') {
      return (calculateSubtotal() * (discountAmount / 100)).toFixed(2);
    } else {
      return discountAmount.toFixed(2);
    }
  };

  const calculateTax = (total) => {
    return ((total * (taxRate / 100))).toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(calculateDiscount());
    const totalAfterDiscount = subtotal - discount;
    const tax = parseFloat(calculateTax(totalAfterDiscount));
    return (totalAfterDiscount + tax).toFixed(2);
  };

  const addSearchedItem = (item) => {
    setItems([...items, { description: item.name, qty: 1, price: item.price ?? 0, itemId: item._id }]);
    setSearchTerm('');
    setFilteredItems([]);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date); // Update the selected date
  };

  const handleCheckedChagne = (v: any) => {
    setShowPayments(v);
  };


  const handleUpdateInvoice = async () => {
    const newErrors = [];

    if (!client) {
      newErrors.push('Client must be selected.');
    }

    if (!sender) {
      newErrors.push('Sender must be selected.');
    }

    if (items.length <= 0) {
      newErrors.push('No Items have been added.');
    }

    items.forEach((item, index) => {
      if (!item.description) {
        newErrors.push(`Item ${index + 1} must have a description.`);
      }
      if (item.qty <= 0) {
        newErrors.push(`Item ${index + 1} must have a valid quantity.`);
      }
      if (item.price <= 0) {
        newErrors.push(`Item ${index + 1} must have a valid price.`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const invoiceData: CustomInvoice = {
      _id: params.invoiceId,
      client,
      sender,
      items,
      date: selectedDate,
      subtotal: parseFloat(calculateSubtotal().toString()),
      discount: discountAmount,
      discountType,
      taxRate,
      total: parseFloat(calculateTotal().toString()),
      showPayments: showPayments
    };


    // console.log('Updated Invoice Data:', JSON.stringify(invoiceData, null, 2));
    const toastId = toast.loading("Updating...");
    try {
      const ok = await updateCustomInvoice(invoiceData); // Use `updateInvoice` to save changes
      if (ok) {
        toast.success("Invoice updated successfully", { id: toastId });
        router.push('/invoices'); // Navigate to the invoice list page after successful update
      }
      //   else {
      //     toast.error(data.error.message, { id: toastId });
      //   }
    } catch (err: any) {
      toast.error(`Invoice isn't updated, please try again. | ${err.message}`);
    }
  };

  const openDiscountModal = () => {
    setIsDiscountModalOpen(true);
  };

  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
  };

  const handleDiscountSubmit = () => {
    setDiscountAmount(tempDiscountAmount);
    setDiscountType(tempDiscountType);
    closeDiscountModal();
  };

  return (
    <div className="w-[95%] mx-auto">

      {errors.length > 0 && (
        <div className="validation-errors mb-4">
          <ul>
            {errors.map((error, index) => (
              <li key={index} className="text-red-500">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Client, Sender, Date, and Search */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">

        <div className="flex-grow">
          <Label htmlFor="senders" className="block mb-1">From</Label>
          <DataSelector
            data={clients}
            itemKey="name"
            returnKey="name"
            selectData={setSender}
            selectedData={[sender]}
            text="From"
            name={"name"}
          />
        </div>


        <div className="flex-grow">
          <Label htmlFor="clients" className="block mb-1">To</Label>
          <DataSelector
            data={clients}
            itemKey="name"
            returnKey="name"
            selectData={setClient}
            selectedData={[client]}
            text="To"
            name={"name"}
          />
        </div>



        <div className="flex-grow">
          <Label htmlFor="invoice-date" className="block mb-1">Invoice Date</Label>
          <DatePicker onDateChange={handleDateChange} />
        </div>

        <div className="flex-grow relative md:flex-none md:w-1/3">
          <Label htmlFor="item-search" className="block mb-1">Search Items</Label>
          <div className="flex items-center">
            <Input
              type="text"
              id="item-search" // Added ID for the label association
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Enter Item Name"
              className="w-full"
            />
            <Button variant='outline' onClick={addNewItem} className="ml-2 p-2">
              <Plus className="h-5 w-5 text-red-600" aria-hidden="true" />
            </Button>
          </div>

          {(loading || filteredItems.length > 0) && (
            <ul className="search-results absolute bg-white shadow-md rounded-lg p-2 max-h-40 overflow-y-auto w-full z-10 mt-1">
              {loading ? (
                <li className="loading-item p-2">Loading...</li>
              ) : (
                filteredItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => addSearchedItem(item)}
                    className="search-item cursor-pointer p-2 hover:bg-gray-100 rounded"
                  >
                    <div className="item-info flex justify-between">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">£{item.price?.toFixed(2)}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

      </div>
      <div className="max-h-[50vh] overflow-y-auto pretty-scrollbar px-2 mb-5">
        <Table className="invoice-table w-full border-collapse mb-4">
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-gray-700">
              <th className="bg-gray-200 dark:bg-gray-700">Description</th>
              <th className="bg-gray-200 dark:bg-gray-700">Qty</th>
              <th className="bg-gray-200 dark:bg-gray-700">Price</th>
              <th className="bg-gray-200 dark:bg-gray-700">Total</th>
              <th className="bg-gray-200 dark:bg-gray-700"> <X className="h-5 w-5 text-black-600" /></th>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow className='hover:text-black' key={index}>
                <TableCell>
                  <Input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="input-field"
                  />
                  <input type="hidden" value={item.itemId} /> {/* Hidden input for item ID */}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 1 : parseFloat(e.target.value);
                      handleItemChange(index, 'qty', value);
                    }}
                    className="input-field"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      handleItemChange(index, 'price', value);
                    }}
                    className="input-field"
                  />
                </TableCell>
                <TableCell>£{(item.qty * item.price).toFixed(2)}</TableCell>
                <TableCell>
                  <button onClick={() => removeItem(index)}>
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="summary-section">

        <div className="flex relative items-center gap-2 my-5">
          <Switch checked={showPayments} onCheckedChange={handleCheckedChagne} />
          <Label className="  bg-background rounded-lg">
            Show Payments In Invoice
          </Label>
        </div>

        <div className="flex justify-between mb-2">
          <span>Items:</span>
          <span>{items.reduce((total, item) => total + item.qty, 0).toFixed(2)}</span> {/* Display the number of items */}
        </div>

        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>£{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Discount <button className='mt-1' onClick={openDiscountModal}><Edit className='text-red-500' size={16} /></button></span>
          <span>£{calculateDiscount()}</span>
        </div>
        <div className="flex justify-between">
          <span className='w-36'>Tax Rate (%):</span>
          <Input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} // Set to 0 if the input is empty
            className="w-24"
            min="0" // Prevent negative values
          />
        </div>
        <div className="summary-row flex justify-between">
          <span>Tax:</span>
          <span>£{calculateTax(calculateSubtotal() - parseFloat(calculateDiscount()))}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total:</span>
          <span>£{calculateTotal()}</span>
        </div>

      </div>

      <div className='flex justify-end mt-10'>
        {/* Submit Button */}
        <Button onClick={handleUpdateInvoice} className="mt-4">
          <Edit className="mr-2 h-4 w-4" /> Update Invoice
        </Button>
      </div>

      {/* Discount Modal */}
      <Dialog open={isDiscountModalOpen} onOpenChange={setIsDiscountModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discount</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col space-y-5'>
            <label>
              Discount Amount:
              <Input
                type="number"
                value={tempDiscountAmount}
                onChange={(e) => setTempDiscountAmount(parseFloat(e.target.value) || 0)}
              />
            </label>
            <label className="ml-2">
              Discount Type:
              <select
                value={tempDiscountType}
                onChange={(e) => setTempDiscountType(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </label>
            {/* Centering the button */}
            <div className="flex justify-center">
              <Button className='mt-5 w-40' onClick={handleDiscountSubmit}>Apply Discount</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

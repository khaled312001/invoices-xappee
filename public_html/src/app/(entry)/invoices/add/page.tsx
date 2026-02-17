"use client";
import { DataSelector } from '@/components/shared/dataSelector';
import { fetchClients } from '@/lib/services/client.service';
import { fetchSearchItemsByName } from '@/lib/services/item.service';
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Plus, PoundSterling, UploadCloud, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Import Dialog from Shadcn
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/shared/datePicker';
import { setDate } from 'date-fns';
import { date } from 'zod';
import { addCustomInvoice } from '@/lib/services/invoice.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CustomInvoice } from '@/types/invoice';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { AddNewClientFromInvoice } from '@/components/clients/addNewClientFromInvoice';
import { fetchChannels } from '@/lib/services/channel.service';
import { Switch } from '@/components/ui/switch';

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

export default function AddInvoice() {
  const [clients, setClients] = useState([]);
  const [channels, setChannels] = useState([]);
  const [client, setClient] = useState('');
  const [sender, setSender] = useState('');
  const [items, setItems] = useState([{ description: '', qty: 1, price: 0, itemId: '' }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [taxRate, setTaxRate] = useState(20); // Default tax rate
  const [discountAmount, setDiscountAmount] = useState(0); // Discount amount
  const [discountType, setDiscountType] = useState('percentage'); // 'percentage' or 'fixed'
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false); // Modal state
  const [tempDiscountAmount, setTempDiscountAmount] = useState(0); // Temp discount for modal
  const [showPayments, setShowPayments] = useState<boolean>(true);
  const [tempDiscountType, setTempDiscountType] = useState('percentage'); // Temp discount type for modal
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Manage selected date separately
  const router = useRouter();

  const handleNewClient = (newClient: any) => {
    console.log("newClient", newClient);
    setClients((prevClients) => [...prevClients, newClient]);
    setClient(newClient.name); // Make the new client selected
  };

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    const fetchChannelsDate = async () => {
      try {
        const data = await fetchChannels();
        setChannels(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchChannelsDate();
    fetchClientsData();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term, setFilteredItems, setLoading);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // if (field === 'qty' || field === 'price') {
    //   newItems[index].total = newItems[index].qty * newItems[index].price;
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
      return discountAmount.toFixed(2); // Fixed discount
    }
  };

  const calculateTax = (total) => {
    return ((total * (taxRate / 100))).toFixed(2); // Calculate tax based on dynamic tax rate
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = parseFloat(calculateDiscount());
    const totalAfterDiscount = subtotal - discount;
    const tax = parseFloat(calculateTax(totalAfterDiscount));
    return (totalAfterDiscount + tax).toFixed(2); // Total after applying discount and tax
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

  const handleSubmitInvoice = async () => {
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
      client,
      sender,
      items,
      date: selectedDate,
      subtotal: parseFloat(calculateSubtotal().toString()),
      discount: discountAmount,
      discountType,
      taxRate,
      // tax: calculateTax(calculateSubtotal() - parseFloat(calculateDiscount().toString())),
      total: parseFloat(calculateTotal().toString()),
      showPayments: showPayments
    };

    console.log('Invoice Data:', JSON.stringify(invoiceData, null, 2));
    const toastId = toast.loading("Loading...");
    try {
      const { ok, data } = await addCustomInvoice(invoiceData);
      if (ok) {
        toast.success("Invoice added successfully", { id: toastId });
        router.push('/invoices');
      } else {
        toast.error(data.error.message, { id: toastId });
      }
    } catch (err: any) {
      toast.error(`Invoice isn't added, please try again. | ${err.message}`);
    } finally {
    }
    setErrors([]);
  };

  const openDiscountModal = () => {
    setIsDiscountModalOpen(true);
  };

  const closeDiscountModal = () => {
    setIsDiscountModalOpen(false);
  };

  const handleDiscountSubmit = () => {
    // Apply the discount only after submission
    setDiscountAmount(tempDiscountAmount);
    setDiscountType(tempDiscountType);
    closeDiscountModal(); // Close the modal after applying the discount
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
          <div className='flex items-center'>
            <DataSelector
              data={clients}
              itemKey="name"
              returnKey="name"
              selectData={setClient}
              selectedData={[client]}
              text="To"
              name={"name"}
            />
            <AddNewClientFromInvoice channels={channels} onNewClient={handleNewClient} />
          </div>

        </div>

        <div className="flex-grow">
          <Label htmlFor="senders" className="block mb-1">Date</Label>
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
          <TableBody >

            {items.map((item, index) => (
              <TableRow  className='hover:text-black' key={index}>
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
        <Button onClick={handleSubmitInvoice} className="gap-2">Submit Invoice <UploadCloud size={20} /></Button>
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

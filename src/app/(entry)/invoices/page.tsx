// "use client";
import CustomInvoiceActions from "@/components/invoices/customInvoiceActions";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/custom/spinner";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentSession } from "@/lib/auth";
import { getCustomInvoices } from "@/lib/services/invoice.service";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

export default async function Invoices() {
const invoices = await getCustomInvoices();
const session = await getCurrentSession();
const user = session?.user || null;

    // const [invoices, setInvoices] = useState([]);
    // const [loading, setLoading] = useState(true); // Loading state
    // const [user, setUser] = useState(null);
    // Fetch invoices from API or backend
    // useEffect(() => {
    //     const fetchInvoices = async () => {
    //         setLoading(true); // Start loading
    //         try {
    //             const data = await getCustomInvoices();
    //             setInvoices(data);
    //         } catch (error) {
    //             //     console.error("Error fetching invoices:", error);
    //         } finally {
    //             setLoading(false); // End loading
    //         }
    //     };

    //     fetchInvoices();

    //     const fetchSession = async () => {
    //         const session = await getCurrentSession();
    //         setUser(session?.user || null);
    //       };
      
    //       fetchSession();
    // }, []);

    // Calculate total for each invoice
    const calculateTotal = (items, discount, discountType, taxRate) => {
        // Sum item prices
        let subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

        // Apply discount
        if (discountType === "fixed") {
            subtotal -= discount;
        } else if (discountType === "percentage") {
            subtotal -= (subtotal * discount) / 100;
        }

        // Apply tax
        const total = subtotal + (subtotal * taxRate) / 100;
        return total.toFixed(2);
    };

    return (
        <div className="container mx-auto p-4">

           {user && user.role === "admin" ? <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Invoices</h2>
                <Link
                    href={`/invoices/add`}
                    target="_blank"
                    className="hover:bg-secondary"
                >
                    <Button>
                        Add Invoice
                    </Button>
                </Link>
            </div> : null}

            {false ? ( // Show loading indicator
                <div className="flex items-center w-full justify-center p-4">
                    <Spinner />
                </div>
            ) : invoices.length === 0 ? (
                <p>No invoices available.</p>
            ) : (
                <Table className="table-auto w-full border">
                    <TableHeader>
                        <TableRow className="bg-gray-200 dark:bg-gray-700">
                            <th className="px-4 py-2">Actions</th>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">From</th>
                            <th className="px-4 py-2">To</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Discount</th>
                            <th className="px-4 py-2">Tax Rate</th>
                            <th className="px-4 py-2">Total (£)</th>
                            <th className="px-4 py-2">Items</th>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice._id} className="border-t">
                                <TableCell className="px-4 py-2 text-center">
                                    <CustomInvoiceActions invoice={invoice} user={user} />
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">INV-{invoice._id}</TableCell>
                                <TableCell className="px-4 py-2 text-center">{invoice.sender}</TableCell>
                                <TableCell className="px-4 py-2 text-center">{invoice.client}</TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                    {new Date(invoice.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                    {invoice.discountType === "fixed"
                                        ? `£${invoice.discount}`
                                        : `${invoice.discount}%`}
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">{invoice.taxRate}%</TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                    {calculateTotal(invoice.items, invoice.discount, invoice.discountType, invoice.taxRate)}
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                    <div className="max-h-24 overflow-y-auto pretty-scrollbar">
                                        {invoice.items.map((item, index) => (
                                            <div key={index}>
                                                {index + 1}. {item.description} - £{item.price.toFixed(2)}
                                            </div>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

import { CustomInvoice, FulfillmentInvoice } from "@/types/invoice";
import { format, getWeek } from "date-fns";
import { enUS } from "date-fns/locale";

export const CustomInvoiceContentForPDF = ({ invoice, client, sender }: { invoice: CustomInvoice, client: any, sender: any }): string => {

  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="style.css" type="text/css" media="all" />
</head>

<body>
  <div>
    <div class="py-4">
      <div class="px-14 py-6">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-full align-top">
                <div>
                  <img src=${sender.imageUrl ? (process.env.NEXT_PUBLIC_SERVER + sender.imageUrl) : "/logo.png"} class="h-12" />
                </div>
              </td>

              <td class="align-top">
                <div class="text-sm">
                  <table class="border-collapse border-spacing-0">
                    <tbody>
                      <tr>
                        <td class="border-r pr-4">
                          <div>
                            <p class="whitespace-nowrap text-slate-400 text-right">Date</p>
                                        <p class="whitespace-nowrap font-bold text-main text-right"> ${format(new Date(invoice.date), "MMM dd, yyyy")}</p>
                          </div>
                        </td>
                        <td class="pl-4">
                          <div>
                            <p class="whitespace-nowrap text-slate-400 text-right">Invoice #</p>
                            <p class="whitespace-nowrap font-bold text-main text-right">${invoice._id}</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-slate-100 px-14 py-6 text-sm">
        <table class="w-full border-collapse border-spacing-0">
          <tbody>
            <tr>
              <td class="w-1/2 align-top">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">${sender.busineesName ?? sender.name}</p>
                </div>
               <div class="text-sm text-neutral-600">
                  <p class="font-bold">${sender.address ?? ''}</p>
                </div>
                 <div class="text-sm text-neutral-600">
                  <p class="font-bold">${sender.phone ?? ''}</p>
                </div>
                 <div class="text-sm text-neutral-600">
                  <p class="font-bold">taxNo: ${sender.taxNo ?? ''}</p>
                </div>
              </td>
              <td class="w-1/2 align-top text-right">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">${invoice.client}</p>
                </div>
               <div class="text-sm text-neutral-600">
                  <p class="font-bold">${client.address ?? ''}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-2 py-10  text-neutral-700">
        <table class="w-full border-collapse border-spacing-0 text-xs">
          <thead>
            <tr>
              <td class="border-b-2 border-main pb-3 pl-3 font-bold text-main">Description</td>
              <td class="border-b-2 border-main pb-3 pl-2 font-bold text-main">Qty</td>
              <td class="border-b-2 border-main pb-3 pl-2 text-right font-bold text-main">Price(£)</td>
              <td class="border-b-2 border-main pb-3 pl-2 text-center font-bold text-main">Total(£)</td>
            </tr>
          </thead>
          <tbody>
             ${invoice.items.map(item => `<tr class="text-xs">
              <td class="border-b py-3 pl-3"> ${item.description}</td>
              <td class="border-b py-3 pl-2">${item.qty}</td>
              <td class="border-b py-3 pl-2 text-right">${item.price.toFixed(2)}</td>
              <td class="border-b py-3 pl-2 text-center">${(item.price * item.qty).toFixed(2)}</td>
            </tr>`).join('')}
            <tr class="text-xs">
              <td colspan="9">
                <table class="w-full border-collapse border-spacing-0">
                  <tbody>
                    <tr>
                      <td class="w-full"></td>
                      <td>
                        <table class="w-full border-collapse border-spacing-0">
                          <tbody>
                            <tr>
                              <td class="border-b p-3">
                                <div class="whitespace-nowrap text-slate-600">Items:</div>
                              </td>
                              <td class="border-b p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">${invoice.items.reduce((total, item) => total + item.qty, 0).toFixed(2)}</div>
                              </td>
                            </tr>
                               <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">SubTotal:</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.subtotal.toFixed(2)}</div>
                              </td>
                            </tr>
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Tax Rate (%):</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">${invoice.taxRate.toFixed(2)}</div>
                              </td>
                            </tr>
                             <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Discount ${invoice.discount > 0 ? `(${invoice.discountType == "fixed" ? "Fixed" : "Percentage"})` : ''}: </div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">${invoice.discount.toFixed(2)}</div>
                              </td>
                            </tr>
                             <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Total:</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.total.toFixed(2)}</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      ${(invoice.showPayments && sender.accNumber) ? `<div class="px-14 text-sm text-neutral-700">
        <p class="text-main font-bold">PAYMENT DETAILS</p>
        <p>Name: ${sender.accName}</p>
        <p>Bank/Sort Code: ${sender.sortCode}</p>
        <p>Account Number: ${sender.accNumber}</p>
      </div>` : ''} 

      ${sender.notes ? `<div class="px-14 py-10 text-sm text-neutral-700">
        <p class="text-main font-bold">Notes</p>
        <p>${sender.notes}</p>
        </dvi>` : ''} 

        
      </div>
    </div>
</body>

</html>
  `;
};

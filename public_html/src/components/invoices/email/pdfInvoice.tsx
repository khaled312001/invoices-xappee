import { FulfillmentInvoice } from "@/types/invoice";
import { format, getWeek } from "date-fns";
import { enUS } from "date-fns/locale";

export const InvoiceContentForPDF = (invoice: FulfillmentInvoice): string => {
  console.log("invoice.frommmmm",invoice.from)
  console.log("invoice.toooooo",invoice.to)
  return `
    <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
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
                  <img src="/logo.png" class="h-12" />
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
                            <p class="whitespace-nowrap font-bold text-main text-right"> Week ${getWeek(invoice.from, { locale: enUS, weekStartsOn: 1 })} - 
            ${getWeek(invoice.to, { locale: enUS, weekStartsOn: 1 })}</p>
                                        <p class="whitespace-nowrap font-bold text-main text-right"> ${format(new Date(invoice.from), "dd.MM.yy" ,{ locale: enUS, weekStartsOn: 1 })} -
            ${format(new Date(invoice.to), "dd.MM.yy" ,{ locale: enUS, weekStartsOn: 1 })}</p>
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
                  <p class="font-bold">XAPPEE LTD</p>
                  <p>2a Tame Road, Birmingham B6 7HS.</p>
                   <p>+44 (0) 121 285 5040</p>
                </div>
              </td>
              <td class="w-1/2 align-top text-right">
                <div class="text-sm text-neutral-600">
                  <p class="font-bold">${invoice.clientBusinessName ?? invoice.client}</p>
                  <p>${invoice.clientAddress  ?? ''}</p>
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
              <td class="border-b-2 border-main pb-3 pl-3 font-bold text-main">Date</td>
              <td class="border-b-2 border-main pb-3 pl-2 font-bold text-main">Order ID</td>
              <td class="border-b-2 border-main pb-3 pl-2 text-right font-bold text-main">Channel</td>
              <td class="border-b-2 border-main pb-3 pl-2 text-center font-bold text-main">Handling(£)</td>
              <td class="border-b-2 border-main pb-3 pl-2 text-center font-bold text-main">Packaging(£)</td>
              <td class="border-b-2 border-main pb-3 pl-2 text-right font-bold text-main">Postage(£)</td>
              <td class="border-b-2 border-main pb-3 pl-2 pr-3 text-right font-bold text-main">Amazon Prep Charge(£)</td>
              <td class="border-b-2 border-main pb-3 pl-2 pr-3 text-right font-bold text-main">Surge(£)</td>
              <td class="border-b-2 border-main pb-3 pl-2 pr-3 text-right font-bold text-main">Total(£)</td>
            </tr>
          </thead>
          <tbody>
             ${invoice.orders.map(order => `<tr class="text-xs">
              <td class="border-b py-3 pl-3"> ${format(order.date, "dd/MM/yyyy")}</td>
              <td class="border-b py-3 pl-2">${order.id}</td>
              <td class="border-b py-3 pl-2 text-right">${order.channel ?? ''}</td>
              <td class="border-b py-3 pl-2 text-center">${(order.charges.handling).toFixed(2)}</td>
              <td class="border-b py-3 pl-2 text-center">${(order.charges.packaging).toFixed(2)}</td>
              <td class="border-b py-3 pl-2 text-right">${(order.charges.postage).toFixed(2)}</td>
              <td class="border-b py-3 pl-2 pr-3 text-right">${(order.charges.prepCharge).toFixed(2)}</td>
              <td class="border-b py-3 pl-2 pr-3 text-right">${(order.charges.surge).toFixed(2)}</td>
              <td class="border-b py-3 pl-2 pr-3 text-right">${(
                    order.charges.handling +
                    order.charges.packaging +
                    order.charges.postage +
                    order.charges.prepCharge +
                    order.charges.surge
                  ).toFixed(2)}</td>
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
                                <div class="whitespace-nowrap text-slate-600">Total Postage</div>
                              </td>
                              <td class="border-b p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main"> £${invoice.totals.totalPostage.toFixed(2)}</div>
                              </td>
                            </tr>
                               <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Total Surge:</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.totals.totalSurge.toFixed(2)}</div>
                              </td>
                            </tr>
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Total Handling:</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.totals.totalHandling.toFixed(2)}</div>
                              </td>
                            </tr>
                             <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Total Packaging:</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.totals.totalPackaging.toFixed(2)}</div>
                              </td>
                            </tr>
                             <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Total Amazon Prep:</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.totals.totalPrep.toFixed(2)}</div>
                              </td>
                            </tr>
                            ${invoice.expenseValue && invoice.expenseValue > 0
                              ? ` <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Additional Expenses ${invoice.expenseCause ? `(${invoice.expenseCause})` : ``}</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.expenseValue.toFixed(2)}</div>
                              </td>
                            </tr>`
                               : ``
                              }
                            <tr>
                              <td class="p-3">
                                <div class="whitespace-nowrap text-slate-600">Tax(20%):</div>
                              </td>
                              <td class="p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-main">£${invoice.totals.totalTax.toFixed(2)}</div>
                              </td>
                            </tr>


                            <tr>
                              <td class="bg-main p-3">
                                <div class="whitespace-nowrap font-bold text-white">Total:</div>
                              </td>
                              <td class="bg-main p-3 text-right">
                                <div class="whitespace-nowrap font-bold text-white">£${(invoice.totals.total+ invoice.expenseValue).toFixed(2)}</div>
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

    </div>
</body>

</html>
  `;
};


// "use client"

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { postCarrierCharges } from "@/lib/services/invoice.service";
// import { Fragment, useEffect, useState } from "react";
// import { toast } from "sonner";


// const FulfilmentForm = ({ carriers }) => {
//     const [formState, setFormState] = useState({});
//     const [weights, setWeights] = useState([]);

//     useEffect(() => {
//         const initialFormState = {};
//         const weightsSet = new Set();

//         carriers.forEach(carrier => {

//             initialFormState[carrier.name] = {};
//             initialFormState[carrier.name] = { discount: carrier.discount || '' }; // Initialize discount field
//             carrier.services.forEach(service => {
//                 initialFormState[carrier.name][service.name] = { ...service.charges };
//                 Object.keys(service.charges).forEach(weight => weightsSet.add(weight));
//             });
//         });
//         setFormState(initialFormState);
//         setWeights(Array.from(weightsSet).sort((a: any, b: any) => a - b));

//     }, [carriers]);

//     const handleInputChange = (carrierName, serviceName, weight, value) => {
//         setFormState(prevState => ({
//             ...prevState,
//             [carrierName]: {
//                 ...prevState[carrierName],
//                 [serviceName]: {
//                     ...prevState[carrierName][serviceName],
//                     [weight]: value
//                 }
//             }
//         }));
//     };

//     const handleDiscountChange = (carrierName, value) => {
//         setFormState(prevState => ({
//             ...prevState,
//             [carrierName]: {
//                 ...prevState[carrierName],
//                 discount: value
//             }
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         console.log('Updated Charges:', formState);
//         // Handle form submission to update the charges in the backend
//         try {
//             await postCarrierCharges(formState);
//             toast.success(`Fulfilment charges updated successfuly`);

//         } catch (error) {
//             //console.error('Error updating charges:', error);
//             toast.error(`Can't update charges. | ${error.message}`);
//         }
//     };

//     return (
//         <div>

//             {/* <section className="flex  items-start mb-5">
//                 <h1 className="text-lg mr-20">Edit Storage CBM</h1>
//                 <Button type="submit">Save Changes </Button>
//             </section>
//             <section>
//                 <Input
//                     type="number"
//                     value={formState[carrier.name]?.[service.name]?.[weight] || ''}
//                     onChange={(e) => handleInputChange(carrier.name, service.name, weight, e.target.value)}
//                 />
//             </section> */}

//             <form onSubmit={handleSubmit} className="mt-10">
//                 <section className="flex  items-start mb-5">
//                     <h1 className="text-lg mr-20">Edit Fulfilment Charges</h1>
//                     <Button type="submit">Update</Button>
//                 </section>
//                 <section>
//                     <Table className="border border-slate-300 border-collapse"  >
//                         <TableHeader className="bg-black " >
//                             <TableRow>
//                                 <TableHead className="border font-bold text-white">Service</TableHead>
//                                 {weights.map(weight => (
//                                     <TableHead className="border font-bold text-white" key={weight}>{weight}g</TableHead>
//                                 ))}
//                             </TableRow>
//                         </TableHeader>
//                         <tbody>
//                             {carriers.map(carrier => (
//                                 <Fragment key={carrier.name}>
//                                     <TableRow className="m-5">
//                                         <TableCell colSpan={weights.length + 1} className=" font-bold text-center bg-zinc-300">
//                                             {carrier.name}
//                                         </TableCell>
//                                     </TableRow>
//                                     {carrier.services.map(service => (
//                                         <TableRow className="border" key={service.name}>
//                                             <TableCell className="font-bold">{service.name}</TableCell>
//                                             {weights.map(weight => (
//                                                 <TableCell className="border" key={weight}>
//                                                     <Input
//                                                         type="number"
//                                                         value={formState[carrier.name]?.[service.name]?.[weight] || ''}
//                                                         onChange={(e) => handleInputChange(carrier.name, service.name, weight, e.target.value)}
//                                                     />
//                                                 </TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}

//                                     {carrier.name === "parcelforce" && (
//                                         <TableRow className="border">
//                                             <TableCell className="font-bold">Discount price</TableCell>
//                                             <TableCell colSpan={weights.length} className="border">
//                                                 <Input
//                                                     type="number"
//                                                     value={formState[carrier.name]?.discount || ''}
//                                                     onChange={(e) => handleDiscountChange(carrier.name, e.target.value)}
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     )}
//                                 </Fragment>


//                             ))}

//                         </tbody>
//                     </Table>
//                 </section>

//             </form>
//         </div>
//     );
// };

// export default FulfilmentForm;

"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { postCarrierCharges } from "@/lib/services/invoice.service";
import { ExitIcon } from "@radix-ui/react-icons";
import { Plus, Trash, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";


const FulfilmentForm = ({ carriers }) => {
    const [formState, setFormState] = useState({});
    const [newCarriers, setNewCarriers] = useState([]);
    const [weights, setWeights] = useState([]);

    useEffect(() => {
        const initialFormState = {};
        const weightsSet = new Set();

        carriers.forEach(carrier => {
            initialFormState[carrier.name] = { discount: carrier.discount || '' }; // Initialize discount field
            carrier.services.forEach(service => {
                initialFormState[carrier.name][service.name] = { ...service.charges };
                Object.keys(service.charges).forEach(weight => weightsSet.add(weight));
            });
        });

        setFormState(initialFormState);
        setWeights(Array.from(weightsSet).sort((a: any, b: any) => a - b));
    }, [carriers]);

    const handleInputChange = (carrierName, serviceName, weight, value) => {
        setFormState(prevState => ({
            ...prevState,
            [carrierName]: {
                ...prevState[carrierName],
                [serviceName]: {
                    ...prevState[carrierName][serviceName],
                    [weight]: value
                }
            }
        }));
    };

    const handleDiscountChange = (carrierName, value) => {
        setFormState(prevState => ({
            ...prevState,
            [carrierName]: {
                ...prevState[carrierName],
                discount: value
            }
        }));
    };

    const handleAddCarrier = () => {
        setNewCarriers([...newCarriers, { name: "", services: [{ name: "", charges: {} }] }]);
    };

    const handleCarrierNameChange = (index, value) => {
        const updatedCarriers = [...newCarriers];
        updatedCarriers[index].name = value;
        setNewCarriers(updatedCarriers);
    };

    const handleAddService = (carrierIndex) => {
        const updatedCarriers = [...newCarriers];
        updatedCarriers[carrierIndex].services.push({ name: "", charges: {} });
        setNewCarriers(updatedCarriers);
    };

    const handleServiceNameChange = (carrierIndex, serviceIndex, value) => {
        const updatedCarriers = [...newCarriers];
        updatedCarriers[carrierIndex].services[serviceIndex].name = value;
        setNewCarriers(updatedCarriers);
    };

    const handleNewServiceChargeChange = (carrierIndex, serviceIndex, weight, value) => {
        const updatedCarriers = [...newCarriers];
        updatedCarriers[carrierIndex].services[serviceIndex].charges[weight] = value;
        setNewCarriers(updatedCarriers);
    };

    // New function to remove a service from the new carriers
    const handleRemoveService = (carrierIndex, serviceIndex) => {
        const updatedCarriers = [...newCarriers];
        updatedCarriers[carrierIndex].services.splice(serviceIndex, 1); // Remove the service
        setNewCarriers(updatedCarriers);
    };

    // New function to remove a carrier
    const handleRemoveCarrier = (carrierIndex) => {
        const updatedCarriers = newCarriers.filter((_, index) => index !== carrierIndex); // Remove the carrier
        setNewCarriers(updatedCarriers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Loading...")
        // Restructure new carriers
        const newCarriersFormatted = {};
        let missingData = false;
        newCarriers.forEach(carrier => {
            if (carrier.name) {
                newCarriersFormatted[carrier.name] = {
                    services: carrier.services.map(function (service) {
                        if (!service.name) {
                            missingData = true;
                        }
                        return ({
                            name: service.name,
                            charges: service.charges,
                        });
                    })
                };
            }
        });
        if (missingData) {
            toast.error(`Missing data for new carriers`, { id: toastId });
        } else {
            const updatedState = {
                ...formState,  // Includes existing carriers and services
                ...newCarriersFormatted  // Add new carriers in the correct format
            };
            console.log("updatedState", updatedState)
         
            try {
                await postCarrierCharges(updatedState);
                toast.success(`Fulfilment charges updated successfully`, { id: toastId });
                window.location.reload();
            } catch (error) {
                toast.error(`Can't update charges. | ${error.message}`, { id: toastId });
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mt-10">
                <section className="flex items-start mb-5">
                    <h1 className="text-lg mr-20">Edit Fulfilment Charges</h1>
                    <Button type="submit">Update</Button>
                </section>
                <section>
                    <Table className="border border-slate-300 border-collapse">
                        <TableHeader className="bg-black">
                            <TableRow>
                                <TableHead className="border font-bold text-white">Service</TableHead>
                                {weights.map(weight => (
                                    <TableHead className="border font-bold text-white" key={weight}>{weight}g</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <tbody>
                            {carriers.map(carrier => (
                                <Fragment key={carrier.name}>
                                    <TableRow className="m-5">
                                        <TableCell colSpan={weights.length + 1} className="font-bold text-center bg-zinc-300">
                                            {carrier.name}
                                        </TableCell>
                                    </TableRow>
                                    {carrier.services.map(service => (
                                        <TableRow className="border" key={service.name}>
                                            <TableCell className="font-bold">{service.name}</TableCell>
                                            {weights.map(weight => (
                                                <TableCell className="border" key={weight}>
                                                    <Input
                                                        type="number"
                                                        value={formState[carrier.name]?.[service.name]?.[weight] || ''}
                                                        onChange={(e) => handleInputChange(carrier.name, service.name, weight, e.target.value)}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </Fragment>
                            ))}

                            {/* Add New Carriers and Services */}
                            {newCarriers.map((carrier, carrierIndex) => (
                                <Fragment key={carrierIndex}>
                                    <TableRow className="m-5">
                                        <TableCell colSpan={weights.length + 1} className="font-bold text-center ">
                                        <div className="flex items-center">
                                            <Input
                                                type="text"
                                                placeholder="New Carrier Name"
                                                value={carrier.name}
                                                onChange={(e) => handleCarrierNameChange(carrierIndex, e.target.value)}
                                            />
                                            <X
                                                onClick={() => handleRemoveCarrier(carrierIndex)}
                                                className="text-red-500 cursor-pointer ml-2"
                                                size={20}
                                            />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {carrier.services.map((service, serviceIndex) => (
                                        <TableRow className="border" key={serviceIndex}>
                                            <TableCell className="font-bold">
                                                <div className="flex items-center">
                                                    <Input
                                                        type="text"
                                                        placeholder="Service Name"
                                                        value={service.name}
                                                        onChange={(e) => handleServiceNameChange(carrierIndex, serviceIndex, e.target.value)}
                                                        className="mr-2" // Add some margin to separate input and icon
                                                    />
                                                    <X
                                                        onClick={() => handleRemoveService(carrierIndex, serviceIndex)}
                                                        className="text-red-500 cursor-pointer"
                                                        size={20}
                                                    />
                                                </div>
                                            </TableCell>
                                            {weights.map(weight => (
                                                <TableCell className="border" key={weight}>
                                                    <Input
                                                        type="number"
                                                        // placeholder={`${weight}g Charge`}
                                                        value={service.charges[weight] || ''}
                                                        onChange={(e) => handleNewServiceChargeChange(carrierIndex, serviceIndex, weight, e.target.value)}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={weights.length + 1}>
                                            <Button variant="link" type="button" onClick={() => handleAddService(carrierIndex)}><Plus size={20} /><p>Add New Service</p></Button>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                            <TableRow >
                                <TableCell colSpan={weights.length + 1}>
                                    <Button variant="success" type="button" onClick={handleAddCarrier}> <Plus size={20} /> <p>Add New Carrier</p></Button>
                                </TableCell>
                            </TableRow>
                        </tbody>
                    </Table>
                </section>
            </form>
        </div>
    );
};

export default FulfilmentForm;

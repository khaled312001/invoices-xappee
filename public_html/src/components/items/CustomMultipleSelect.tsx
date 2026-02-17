// components/CustomMultipleSelect.tsx

import { useState } from 'react';
import { Label } from '../ui/label';
import { ChevronDown } from 'lucide-react';

interface Client {
    name: string;
}

interface CustomMultipleSelectProps {
    clients: Client[];
    selectedClients: string[];
    onSelectionChange: (selected: string[]) => void;
}

const CustomMultipleSelect: React.FC<CustomMultipleSelectProps> = ({
    clients,
    selectedClients,
    onSelectionChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (clientId: string) => {
        const updatedSelection = selectedClients.includes(clientId)
            ? selectedClients.filter(id => id !== clientId)
            : [...selectedClients, clientId];
        onSelectionChange(updatedSelection);
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative">
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-left flex items-center justify-between"
            >
                <Label>
                    {selectedClients?.length > 0
                        ? `Selected: ${selectedClients.length} client(s)`
                        : 'Select clients'}
                </Label>

                <ChevronDown size={15} />


            </button>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 border border-gray-300 rounded bg-white dark:bg-gray-800  shadow-lg max-h-60 overflow-y-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-sm w-full p-2 border-b border-gray-300 rounded-t"
                    />
                    <div>
                        {filteredClients.map(client => (
                            <div
                                key={client.name}
                                onClick={() => handleSelect(client.name)}
                                className={`text-sm p-2 cursor-pointer hover:bg-gray-100 ${selectedClients?.includes(client.name) ? 'bg-gray-200 dark:bg-gray-500' : ''}`}
                            >
                                {client.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomMultipleSelect;

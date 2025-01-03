import React, { useState } from 'react';

const CreateContainer = ({
     show,
     onClose,
     onSubmit,
 }: {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}) => {
    // State for the form fields.
    const [ports, setPorts] = useState([{ hostPort: '', containerPort: '' }]);
    const [envVars, setEnvVars] = useState([{ name: '', value: '' }]);
    const [name, setName] = useState('');
    const [imageName, setImageName] = useState('');

    // Functions to add and remove ports and environment variables
    const addPort = () => {
        setPorts([...ports, { hostPort: '', containerPort: '' }]);
    };

    // Function to add environment variables
    const addEnvVar = () => {
        setEnvVars([...envVars, { name: '', value: '' }]);
    };

    // Functions to handle changes in the form fields
    const handlePortChange = (index: number, field: 'hostPort' | 'containerPort', value: string) => {
        const updatedPorts = [...ports];
        updatedPorts[index][field] = value;
        setPorts(updatedPorts);
    };

    // Function to handle changes in the environment variables
    const handleEnvVarChange = (index: number, field: 'name' | 'value', value: string) => {
        const updatedVars = [...envVars];
        updatedVars[index][field] = value;
        setEnvVars(updatedVars);
    };

    // Functions to remove ports and environment variables
    const removePort = (index: number) => {
        setPorts(ports.filter((_, i) => i !== index));
    };

    // Function to remove environment variables
    const removeEnvVar = (index: number) => {
        setEnvVars(envVars.filter((_, i) => i !== index));
    };

    // Function to handle the form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            name,
            ports,
            envVars,
            imageName,
        };
        onSubmit(formData);
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${
                show ? '' : 'hidden'
            }`}
            style={{ zIndex: 9999 }}
        >
            <div className="bg-white text-gray-800 w-11/12 sm:w-10/12 md:w-4/12 p-8 rounded-lg max-h-[80vh] overflow-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Create Container</h2>
                    <button onClick={onClose} className="text-red-500 text-4xl">
                        &times;
                    </button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                            Name Container
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="p. Example: postgres-container-local"
                            className="mt-1 block w-full text-gray-700 italic text-left rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    {/* Ports Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Ports</label>
                        {ports.map((port, index) => (
                            <div key={index} className="flex gap-6 items-center mb-2">
                                <input
                                    type="text"
                                    placeholder="Host Port"
                                    value={port.hostPort}
                                    onChange={(e) => handlePortChange(index, 'hostPort', e.target.value)}
                                    className="mt-1 block w-full text-gray-700 italic rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Container Port"
                                    value={port.containerPort}
                                    onChange={(e) => handlePortChange(index, 'containerPort', e.target.value)}
                                    className="mt-1 block w-full text-gray-700 italic rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePort(index)}
                                    className="text-red-500 font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addPort}
                            className="text-blue-500 font-bold mt-2 hover:underline"
                        >
                            + Add Port
                        </button>
                    </div>
                    {/* Environment Variables Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Environment Variables</label>
                        {envVars.map((envVar, index) => (
                            <div key={index} className="flex gap-6 items-center mb-2">
                                <input
                                    type="text"
                                    placeholder="Variable Name"
                                    value={envVar.name}
                                    onChange={(e) => handleEnvVarChange(index, 'name', e.target.value)}
                                    className="mt-1 block w-full text-gray-700 italic rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Variable Value"
                                    value={envVar.value}
                                    onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                                    className="mt-1 block w-full text-gray-700 italic rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeEnvVar(index)}
                                    className="text-red-500 font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addEnvVar}
                            className="text-blue-500 font-bold mt-2 hover:underline"
                        >
                            + Add Variable
                        </button>
                    </div>
                    <div>
                        <label htmlFor="image-name" className="block text-sm font-medium text-gray-600">
                            Image Name
                        </label>
                        <input
                            type="text"
                            id="image-name"
                            value={imageName}
                            onChange={(e) => setImageName(e.target.value)}
                            placeholder="p. Example: postgres:latest"
                            className="mt-1 block w-full text-gray-700 italic text-left rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Crear
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateContainer;

"use client";

import axios from "axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

interface container {
    container_id: string;
    image: number;
    names: string;
    created: string;
    since_time: string;
    ports: string;
    status: string;
    command: string;
    timestamp: string;
}

const LogModal = ({ show, logs, onClose }: { show: boolean; logs: string; onClose: () => void }) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${show ? "" : "hidden"}`}
            style={{zIndex: 9999}}
        >
            <div className="bg-white text-gray-800 w-11/12 sm:w-10/12 md:w-full p-4 rounded-lg max-h-[80vh] overflow-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Container Logs</h2>
                    <button onClick={onClose} className="text-red-500 text-4xl">&times;</button>
                </div>
                <pre className="mt-4">{logs}</pre>
            </div>
        </div>
    );
};

const ContainerList = () => {
    const router = useRouter();
    const [error, setError] = useState('');

    const [AllContainers, setAllContainers] = useState<container[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<any | null>(null);

    const [logModalOpen, setLogModalOpen] = useState(false);
    const [containerLogsContent, setContainerLogsContent] = useState("");
    const [containerModalOpen, setContainerModalOpen] = useState(false);

    const goHome = () => {
        router.push("/dashboard");
    };

    useEffect(() => {
        fetchContainers();
        const interval = setInterval(() => {
            fetchContainers();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchContainers = async () => {
        await axios.get("/api/get-containers")
            .then((response) => {
                if (response.status === 200)
                    setAllContainers(response.data);
            })
            .catch((error) => { setError(`Error fetching verbs: ${error.message}`) })
    };

    const startContainer = async (containerId: string) => {
        await axios.post("/api/start-container", { containerId })
            .then((response) => {
                if (response.status === 200)
                    console.log(response.data);
            })
            .catch((error) => { setError(`Error starting container: ${error.message}`) })
    }

    const stopContainer = async (containerId: string) => {
        await axios.post("/api/stop-container", { containerId })
            .then((response) => {
                if (response.status === 200)
                    console.log(response.data);
            })
            .catch((error) => { setError(`Error stopping container: ${error.message}`) })
    }

    const containerLogs = async (containerId: string) => {
        try {
            const response = await axios.post("/api/logs-container", { containerId });
            const logsData = response.data[0];
            const logs = logsData.logs;
            setContainerLogsContent(logs);
            setLogModalOpen(true);
        } catch (error) {
            console.error("Error fetching container logs:", error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="overflow-x-auto">
                <div className="p-4">
                    <h1 className="text-2xl mb-4" onClick={goHome}>
                        <strong className="text-blue-500">Docker</strong> Containers
                    </h1>
                    <table
                        className="table-auto border-collapse border border-gray-300 w-2/3 text-sm text-center bg-white text-gray-800">
                        <thead>
                        <tr className="bg-blue-50">
                            <th className="border border-gray-300 px-4 py-2">Container ID</th>
                            <th className="border border-gray-300 px-4 py-2">Nombre</th>
                            <th className="border border-gray-300 px-4 py-2">Estado</th>
                            <th className="border border-gray-300 px-4 py-2">Acción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {AllContainers.map((container: any) => (
                            <tr key={container.container_id}>
                                <td className="border border-gray-300 px-4 py-2">{container.container_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{container.names}</td>
                                <td className="border border-gray-300 px-4 py-2">{container.status}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => {
                                            setSelectedContainer(container);
                                            setContainerModalOpen(true);
                                        }}
                                    >
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <LogModal
                        show={logModalOpen}
                        logs={containerLogsContent}
                        onClose={() => setLogModalOpen(false)}
                    />

                    {selectedContainer && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 text-gray-900">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Detalles del Contenedor</h2>
                                    <button
                                        onClick={() => setSelectedContainer(null)}
                                        className="text-red-500 hover:text-gray-900 text-4xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    <li><strong>Imagen:</strong> {selectedContainer.image}</li>
                                    <li><strong>Creado:</strong> {selectedContainer.created}</li>
                                    <li><strong>Última vez activo:</strong> {selectedContainer.since_time}</li>
                                    <li><strong>Puertos:</strong> {selectedContainer.ports || 'N/A'}</li>
                                    <li><strong>Comando:</strong> {selectedContainer.command}</li>
                                    <li><strong>Estado:</strong> {selectedContainer.status}</li>
                                    <li><strong>ID:</strong> {selectedContainer.container_id}</li>
                                    <li><strong>Timestamp:</strong> {selectedContainer.timestamp}</li>
                                </ul>
                                <div className="mt-6 flex gap-4">
                                    <button
                                        className={`px-4 py-2 rounded text-white ${
                                            selectedContainer.status === 'up'
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                        disabled={selectedContainer.status === 'up'}
                                        onClick={() => startContainer(selectedContainer.container_id)}
                                    >
                                        Start
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded text-white ${
                                            selectedContainer.status === 'exited'
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                        disabled={selectedContainer.status === 'exited'}
                                        onClick={() => stopContainer(selectedContainer.container_id)}
                                    >
                                        Stop
                                    </button>
                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => containerLogs(selectedContainer.container_id)}
                                    >
                                        Logs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContainerList;
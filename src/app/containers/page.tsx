"use client";

import axios from "axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Footer from "@/app/components/footer";
import {container} from "@/app/interfaces/interfaces";
import LogModal from "@/app/components/log-modal";
import CreateContainer from "@/app/components/create-container";
import StatsModal from "@/app/components/stats-modal";
import Swal from 'sweetalert2';

const ContainerList = () => {
    // Router.
    const router = useRouter();
    const [error, setError] = useState('');

    // State variables.
    const [AllContainers, setAllContainers] = useState<container[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<any | null>(null);

    const [logModalOpen, setLogModalOpen] = useState(false);
    const [containerLogsContent, setContainerLogsContent] = useState("");

    const [showContainerCreateModal, setShowContainerCreateModal] = useState(false);
    const [containerCreateData, setContainerCreateData] = useState(null);

    const [statsModalOpen, setStatsModalOpen] = useState(false);
    const [containerStatsContent, setContainerStatsContent] = useState("");

    // Function to go back to the home page.
    const goHome = () => {
        router.push("/dashboard");
    };

    // Fetch all containers.
    useEffect(() => {
        fetchContainers();
        const interval = setInterval(() => {
            fetchContainers();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Fetch all containers.
    const fetchContainers = async () => {
        await axios.get("/api/get-containers")
            .then((response) => {
                if (response.status === 200)
                    setAllContainers(response.data);
            })
            .catch((error) => {
                setError(`Error fetching verbs: ${error.message}`)
            })
    };

    // Start a container.
    const startContainer = async (containerId: string) => {
        await axios.post("/api/start-container", {containerId})
            .then((response) => {
                if (response.status === 200)
                    console.log(response.data);
            })
            .catch((error) => {
                setError(`Error starting container: ${error.message}`)
            })
    }

    // Stop a container.
    const stopContainer = async (containerId: string) => {
        await axios.post("/api/stop-container", {containerId})
            .then((response) => {
                if (response.status === 200)
                    console.log(response.data);
            })
            .catch((error) => {
                setError(`Error stopping container: ${error.message}`)
            })
    }

    // Fetch container logs.
    const containerLogs = async (containerId: string) => {
        try {
            const response = await axios.post("/api/logs-container", {containerId});
            const logsData = response.data[0];
            const logs = logsData.logs;
            setContainerLogsContent(logs);
            setLogModalOpen(true);
        } catch (error) {
            console.error("Error fetching container logs:", error);
        }
    }

    // Fetch container stats.
    const containerStats = async (containerId: string) => {
        try {
            const response = await axios.post("/api/stats-container", {containerId});
            const statsData = response.data[0];
            setContainerStatsContent(statsData);
            setStatsModalOpen(true);
        } catch (error) {
            console.error("Error fetching container stats:", error);
        }
    }

    // Create Container Modal Handlers - Open.
    const handleContainerCreateOpenModal = () => {
        setShowContainerCreateModal(true);
    };

    // Create Container Modal Handlers - Close.
    const handleContainerCreateCloseModal = () => {
        setShowContainerCreateModal(false);
    };

    // Create Container Modal Handlers - Submit.
    const handleContainerCreateSubmitModal = async (data: any) => {
        setContainerCreateData(data);
        await axios.post("/api/create-container", data)
            .then((response) => {
                if (response.status === 200) {
                    setShowContainerCreateModal(false);
                }
            })
            .catch((error) => {
                console.error("Error creating container:", error);
            });
    };

    const confirmRemoveContainer = async (containerId: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        });

        if (result.isConfirmed) {
            const response = await axios.post("/api/remove-container", {containerId});
            console.log(response);
            if (response.data.httpStatus === "200") {
                Swal.fire(
                    'Deleted!',
                    'Your container has been deleted.',
                    'success'
                );
            } else {
                Swal.fire(
                    'Error!',
                    'There was an error deleting the container.',
                    'error'
                );
            }
        }
    }

    return (
        <div className="flex h-screen">
            <div className="w-11/12 sm:w-8/12 md:w-1/2 p-2 m-2">

                {/* Create Container */}
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl" onClick={goHome}>
                        <strong className="text-blue-500">Docker</strong> Containers
                    </h1>
                    <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                        onClick={handleContainerCreateOpenModal}
                    >
                        Create Container
                    </button>
                </div>

                {/* Table Containers */}
                <table
                    className="table-auto border-collapse border border-gray-300 w-full text-sm text-center bg-white text-gray-800">
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
                                    onClick={() => setSelectedContainer(container)}
                                >
                                    Details
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Log Modal */}
                <LogModal
                    show={logModalOpen}
                    logs={containerLogsContent}
                    onClose={() => setLogModalOpen(false)}
                />

                {/* Create Container Modal */}
                <CreateContainer
                    show={showContainerCreateModal}
                    onClose={handleContainerCreateCloseModal}
                    onSubmit={handleContainerCreateSubmitModal}
                />

                {/* Stats Modal */}
                <StatsModal
                    show={statsModalOpen}
                    stats={containerStatsContent}
                    onClose={() => setStatsModalOpen(false)}
                />

                {/* Selected Container Modal */}
                {selectedContainer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-2/2 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Detalles del Contenedor</h2>
                                <button
                                    onClick={() => setSelectedContainer(null)}
                                    className="text-red-500 hover:text-gray-900 text-4xl"
                                >
                                    &times;
                                </button>
                            </div>
                            {/* Content */}
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
                            {/* Buttons */}
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
                                <button
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => containerStats(selectedContainer.container_id)}
                                >
                                    Stats
                                </button>
                                <button
                                    className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => confirmRemoveContainer(selectedContainer.container_id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Formulario a la derecha */}
            {/*<div className="w-1/4 p-4 text-white">*/}
            {/*<h2 className="text-lg font-bold mb-4">Crear Contenedor</h2>*/}
            {/*<form className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-400"
                        >
                            Nombre Contenedor
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="postgres-container-local"
                            className="mt-1 block w-full text-gray-700 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-6">
                        <div>
                            <label
                                htmlFor="puerto-host"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Puerto Host
                            </label>
                            <input
                                type="text"
                                id="puerto-host"
                                placeholder="5432"
                                className="mt-1 block w-full text-gray-700 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="puerto-contenedor"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Puerto Contenedor
                            </label>
                            <input
                                type="text"
                                id="puerto-contenedor"
                                placeholder="5432"
                                className="mt-1 block w-full text-gray-700 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div>
                            <label
                                htmlFor="name-variable"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Nombre Variable
                            </label>
                            <input
                                type="text"
                                id="name-variable"
                                placeholder="POSTGRES_PASSWORD"
                                className="mt-1 block w-full text-gray-700 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="value-variable"
                                className="block text-sm font-medium text-gray-400"
                            >
                                Valor Variable
                            </label>
                            <input
                                type="text"
                                id="value-variable"
                                placeholder="password"
                                className="mt-1 block w-full text-gray-700 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Crear
                    </button>
                </form>*/}
            {/*}</div>*/}
            <Footer/>
        </div>
    );
}

export default ContainerList;
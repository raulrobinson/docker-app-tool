const CreateContainer = ({ show, data, onClose }: { show: boolean; data: string; onClose: () => void; }) => {
    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${show ? "" : "hidden"}`}
            style={{zIndex: 9999}}
        >
            <div
                className="bg-white text-gray-800 w-11/12 sm:w-10/12 md:w-4/12 p-4 rounded-lg max-h-[80vh] overflow-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Crear Contenedor</h2>
                    <button
                        onClick={onClose}
                        className="text-red-500 text-4xl"
                    >
                        &times;
                    </button>
                </div>
                <pre className="mt-4">{data}</pre>
            </div>
        </div>
    );
};

export default CreateContainer;
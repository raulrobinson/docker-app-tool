const StatsModal = ({
    show,
    stats,
    onClose,
}: {
    show: boolean;
    stats: Record<string, any> | string;
    onClose: () => void;
}) => {
    const formattedStats = typeof stats === "string" ? stats : JSON.stringify(stats, null, 2);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${show ? "" : "hidden"}`}
            style={{ zIndex: 9999 }}
        >
            <div className="bg-white text-gray-800 w-11/12 sm:w-10/12 md:w-1/2 p-4 rounded-lg max-h-[100vh] overflow-auto">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Container Stats</h2>
                    <button onClick={onClose} className="text-red-500 text-4xl">
                        &times;
                    </button>
                </div>
                <pre className="mt-4 whitespace-pre-wrap break-words">
                    {formattedStats}
                </pre>
            </div>
        </div>
    );
};

export default StatsModal;

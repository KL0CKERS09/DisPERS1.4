import { IoClose } from "react-icons/io5";

export default function AnnouncementModal({ announcement, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full relative">
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
                    onClick={onClose}
                >
                    <IoClose size={24} />
                </button>
                <h2 className="text-2xl font-bold text-orange-600 mb-2">{announcement.title}</h2>
                <div className="flex justify-between">
                    <p className="text-sm text-gray-500 mb-4">{new Date(announcement.createdAt).toLocaleDateString()}</p>
                    <span className={`inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full mb-4`}>
                    {announcement.type}
                </span>
                </div>
                
                <p className="text-gray-700">{announcement.description}</p>
                <div className="mt-6 text-right">
                    <button
                        className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

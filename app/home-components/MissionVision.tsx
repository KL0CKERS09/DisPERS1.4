import { FaLayerGroup, FaMapMarkerAlt } from "react-icons/fa";

const MissionVision = () => {
    return (
        <section className="py-20 ">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 px-8 py-[5em] rounded-2xl shadow-md text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-orange-100 p-4 rounded-full">
                            <FaLayerGroup className="text-orange-500 text-2xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Mission</h2>
                    <p className="text-gray-700">
                        To empower Barangay Bagong Silangan with an efficient, responsive, and
                        technology-driven alert system that delivers timely updates, critical
                        information, and announcements to every resident.
                    </p>
                </div>

                <div className="bg-gray-50 px-8 py-[5em] rounded-2xl shadow-md text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-orange-100 p-4 rounded-full">
                            <FaMapMarkerAlt className="text-orange-500 text-2xl" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-orange-500 mb-4">Vision</h2>
                    <p className="text-gray-700">
                        To empower Barangay Bagong Silangan with an efficient, responsive, and
                        technology-driven alert system that delivers timely updates, critical
                        information, and announcements to every resident.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionVision;

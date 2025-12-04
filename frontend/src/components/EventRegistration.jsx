import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EventRegistration = ({ event, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        regNo: '',
        needsAccommodation: false
    });
    const [error, setError] = useState('');
    const { user } = useAuth();
    const backendUrl = 'http://localhost:3000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Bạn cần đăng nhập để đăng ký sự kiện');
                return;
            }

            // Gửi thông tin đăng ký
            const res = await axios.post(
                `${backendUrl}/api/events/register`,
                {
                    eventId: event._id,
                    name: formData.name,
                    regNo: formData.regNo,
                    needsAccommodation: formData.needsAccommodation
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.status === 200) {
                setStep(2);
            }
        } catch (err) {
            console.error(err);
            setError('Không thể đăng ký. Vui lòng thử lại!');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Đăng ký tham gia sự kiện</h2>
                        <p className="mb-4 text-gray-700 font-medium">{event.title}</p>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium">Họ và tên</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block font-medium">Mã số sinh viên</label>
                                <input
                                    type="text"
                                    name="regNo"
                                    value={formData.regNo}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="needsAccommodation"
                                    checked={formData.needsAccommodation}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label>Yêu cầu chỗ ở</label>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                                >
                                    Xác nhận đăng ký
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-green-600 mb-4">
                            ✅ Đăng ký thành công!
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Bạn đã đăng ký tham gia sự kiện <strong>{event.title}</strong>.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventRegistration;

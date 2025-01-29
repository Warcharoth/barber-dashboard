import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Check, Scissors, ChevronLeft, ChevronRight, Plus, Pencil, Trash2, User, X, LogOut } from 'lucide-react';
import { useToast } from './ToastContext';
import Loader from './Loader';
const StatCard = ({ title, value, Icon, color }) => {
    const colorMap = {
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center">
                <div className={`rounded-full p-3 ${colorMap[color]}`}>
                    <Icon size={24} />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                </div>
            </div>
        </div>
    );
};

const BookingRow = ({ booking, onEditClick, selectedDate, setBookingToConfirm, setIsConfirmModalOpen, setBookingToDelete,
    setIsDeleteModalOpen, currentUser }) => {
    const canManageBooking = currentUser.role === 'Super Admin' ||
        booking.barber.toLowerCase() === currentUser.username.toLowerCase();
    const statusStyles = {
        waiting: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
    };

    return (
        <tr className="border-b border-gray-200">
            <td className="py-3 px-4">{booking.time}</td>
            <td className="py-3 px-4">{booking.client}</td>
            <td className="py-3 px-4">{booking.service}</td>
            <td className="py-3 px-4">{booking.barber}</td>
            <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                    {booking.status === 'waiting' ? 'In Attesa' : 'Approvata'}
                </span>
            </td>
            <td className="py-3 px-4">
                <div className="flex gap-2">
                    {booking.status === 'waiting' && canManageBooking && (
                        <button
                            onClick={() => {
                                setBookingToConfirm(booking);
                                setIsConfirmModalOpen(true);
                            }}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                        >
                            <Check size={16} />
                        </button>
                    )}
                    {canManageBooking && (
                        <>
                            <button
                                onClick={() => onEditClick(booking)}
                                className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    setBookingToDelete(booking);
                                    setIsDeleteModalOpen(true);
                                }}
                                className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{ background: 'rgb(66 139 192 / 22%)', backdropFilter: 'blur(8px)' }} className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

const BookingModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
    const [formData, setFormData] = useState({
        client: '',
        service: '',
        barber: currentUser.role === 'Super Admin' ? '' : currentUser.username,
        date: new Date().toISOString().split('T')[0],
        time: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            client: '',
            service: '',
            barber: '',
            date: new Date().toISOString().split('T')[0],
            time: ''
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Nuova Prenotazione</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                    Inserisci i dettagli della nuova prenotazione
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                            Nome Cliente
                        </label>
                        <input
                            type="text"
                            id="client"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mario Rossi"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                            Servizio
                        </label>
                        <select
                            id="service"
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleziona un servizio</option>
                            <option value="Taglio">Taglio</option>
                            <option value="Barba">Barba</option>
                            <option value="Taglio-Barba">Taglio + Barba</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="barber" className="block text-sm font-medium text-gray-700">
                            Barbiere
                        </label>
                        <select
                            id="barber"
                            value={formData.barber}
                            onChange={(e) => setFormData({ ...formData, barber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={currentUser.role !== 'Super Admin'}
                        >
                            <option value="">Seleziona un barbiere</option>
                            {currentUser.role === 'Super Admin' ? (
                                <>
                                    <option value="Salvatore">Salvatore</option>
                                    <option value="Emanuele">Emanuele</option>
                                </>
                            ) : (
                                <option value={currentUser.username}>{currentUser.username}</option>
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Data
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                Orario
                            </label>
                            <input
                                type="time"
                                id="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Salva Prenotazione
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

const EditBookingModal = ({ isOpen, onClose, onSubmit, booking, currentUser }) => {
    const [formData, setFormData] = useState({
        client: '',
        service: '',
        barber: currentUser.role === 'Super Admin' ? '' : currentUser.username,
        date: new Date().toISOString().split('T')[0],
        time: ''
    });

    useEffect(() => {
        if (booking) {
            setFormData({
                client: booking.client || '',
                service: booking.service || '',
                barber: currentUser.role === 'Super Admin' ? (booking.barber || '') : currentUser.username,
                date: booking.date || new Date().toISOString().split('T')[0],
                time: booking.time || ''
            });
        }
    }, [booking, currentUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(booking.id, formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div>
                <h2 className="text-lg font-semibold text-gray-800">Modifica Prenotazione</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4">
                    Modifica i dettagli della prenotazione
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                            Nome Cliente
                        </label>
                        <input
                            type="text"
                            id="client"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Mario Rossi"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                            Servizio
                        </label>
                        <select
                            id="service"
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleziona un servizio</option>
                            <option value="Taglio">Taglio</option>
                            <option value="Barba">Barba</option>
                            <option value="Taglio-Barba">Taglio + Barba</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="barber" className="block text-sm font-medium text-gray-700">
                            Barbiere
                        </label>
                        <select
                            id="barber"
                            value={formData.barber}
                            onChange={(e) => setFormData({ ...formData, barber: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={currentUser.role !== 'Super Admin'}
                        >
                            <option value="">Seleziona un barbiere</option>
                            {currentUser.role === 'Super Admin' ? (
                                <>
                                    <option value="Salvatore">Salvatore</option>
                                    <option value="Emanuele">Emanuele</option>
                                </>
                            ) : (
                                <option value={currentUser.username}>{currentUser.username}</option>
                            )}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                                Data
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                                Orario
                            </label>
                            <input
                                type="time"
                                id="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Salva Modifiche
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

const ConfirmModal = ({ isOpen, onClose, booking, onConfirm }) => {
    if (!booking) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Conferma Appuntamento</h2>
                <p className="text-gray-600 mb-6">
                    Confermare l'appuntamento del cliente {booking.client} alle ore {booking.time} per il servizio {booking.service}?
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(booking.id);
                            onClose();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Conferma
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const DeleteModal = ({ isOpen, onClose, booking, onConfirm }) => {
    if (!booking) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Elimina Prenotazione</h2>
                <p className="text-gray-600 mb-6">
                    Sei sicuro di voler eliminare la prenotazione di {booking.client} delle ore {booking.time}?
                </p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={() => {
                            onConfirm(booking.id);
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const Dashboard = ({ currentUser }) => {
    const { addToast } = useToast();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([
        { id: 1, time: '09:00', client: 'Mario Rossi', service: 'Taglio + Barba', barber: 'Salvatore', status: 'waiting' },
        { id: 2, time: '10:00', client: 'Luigi Bianchi', service: 'Taglio', barber: 'Emanuele', status: 'approved' },
        { id: 3, time: '11:30', client: 'Giuseppe Verdi', service: 'Barba', barber: 'Salvatore', status: 'waiting' },
    ]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [bookingToConfirm, setBookingToConfirm] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredBookings = useMemo(() => {
        if (currentUser.role === 'Super Admin') {
            return bookings;
        }
        return bookings.filter(booking =>
            booking.barber.toLowerCase() === currentUser.username.toLowerCase()
        );
    }, [bookings, currentUser]);

    // Aggiungi questa funzione
    const handleDeleteBooking = (bookingId) => {
        const bookingToDelete = bookings.find(b => b.id === bookingId);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        addToast(`Prenotazione per ${bookingToDelete.client} eliminata con successo`);

    };

    const loadBookingsData = async (date) => {
        setIsLoading(true);
        // Simuliamo una chiamata API
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Qui potresti fare una vera chiamata API per caricare i dati del nuovo giorno
        setIsLoading(false);
    };

    // Aggiungi questa funzione nel componente Dashboard
    const handleConfirmBooking = (bookingId) => {
        const bookingToConfirm = bookings.find(b => b.id === bookingId);
        setBookings(bookings.map(booking =>
            booking.id === bookingId
                ? { ...booking, status: 'approved' }
                : booking
        ));
        addToast(`Prenotazione per ${bookingToConfirm.client} confermata con successo`);

    };

    const handleEditBooking = (bookingId, formData) => {
        setBookings(bookings.map(booking =>
            booking.id === bookingId
                ? { ...booking, ...formData, status: booking.status }
                : booking
        ));
        addToast(`Prenotazione modificata con successo`);
    };

    const handlePrevDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() - 1);
        const newDate = currentDate.toISOString().split('T')[0];
        setSelectedDate(newDate);
        loadBookingsData(newDate);
    };

    const handleNextDay = () => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + 1);
        const newDate = currentDate.toISOString().split('T')[0];
        setSelectedDate(newDate);
        loadBookingsData(newDate);
    };

    const handleAddBooking = (formData) => {
        const newBooking = {
            id: bookings.length + 1,
            time: formData.time,
            client: formData.client,
            service: formData.service,
            barber: formData.barber,
            status: 'waiting'  // Cambiato da 'approved' a 'waiting'
        };
        setBookings([...bookings, newBooking]);
        setIsModalOpen(false);
        addToast(`Prenotazione per ${formData.client} aggiunta con successo`);
    };

    const calculateStats = () => {
        const totalBookings = filteredBookings.length;
        const waitingBookings = filteredBookings.filter(b => b.status === 'waiting').length;
        const confirmedBookings = filteredBookings.filter(b => b.status === 'approved').length;

        return [
            { id: 1, title: 'Prenotazioni Oggi', value: totalBookings.toString(), Icon: Calendar, color: 'blue' },
            { id: 2, title: 'In Attesa', value: waitingBookings.toString(), Icon: Clock, color: 'yellow' },
            { id: 3, title: 'Confermate', value: confirmedBookings.toString(), Icon: Check, color: 'green' },
        ];
    };

    const STATS = calculateStats();

    return (
        <div className="min-h-screen bg-gray-50">
            {isLoading && <Loader />}
            <nav className="bg-white shadow">
                <div className="px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Scissors size={24} className="text-gray-700" />
                        <h1 className="ml-2 text-xl font-semibold text-gray-800">Barba e Cuoio Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-4">
    <div className="text-right">
        <p className="text-sm text-gray-600">
            Bentornato <span className="font-semibold">{currentUser.username.toUpperCase()}</span>!
        </p>
        <p className="text-xs text-gray-500">
            {currentUser.role === 'Super Admin' ? 'Super Admin' : 'User'}
        </p>
    </div>
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
        <User size={30} className="text-blue-600" />
    </div>
    <button 
        onClick={() => window.location.href = '/login'}
        className="p-2 hover:bg-gray-100 rounded-full"
        title="Logout"
    >
        <LogOut size={24} className="text-gray-600" />
    </button>
</div>
                </div>
            </nav>

            <div className="px-4 py-6">
                <div className="grid gap-4 md:grid-cols-4 mb-6">
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Prenotazioni</h2>
                                    <p className="text-sm text-gray-500">Seleziona una data per visualizzare le prenotazioni</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={handlePrevDay} className="p-2 hover:bg-gray-100 rounded">
                                        <ChevronLeft size={20} className="text-gray-600" />
                                    </button>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-4 py-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button onClick={handleNextDay} className="p-2 hover:bg-gray-100 rounded">
                                        <ChevronRight size={20} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">Nuova Prenotazione</h2>
                                    <p className="text-sm text-gray-500">Aggiungi manualmente</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Aggiungi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-6">
                    {STATS.map(stat => (
                        <StatCard key={stat.id} {...stat} />
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Orario</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Cliente</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Servizio</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Barbiere</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Stato</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(booking => (
                                    <BookingRow
                                        key={booking.id}
                                        booking={booking}
                                        selectedDate={selectedDate}
                                        onEditClick={(booking) => {
                                            setSelectedBooking(booking);
                                            setIsEditModalOpen(true);
                                        }}
                                        setBookingToConfirm={setBookingToConfirm}
                                        setIsConfirmModalOpen={setIsConfirmModalOpen}
                                        setBookingToDelete={setBookingToDelete}
                                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                                        currentUser={currentUser}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddBooking}
                currentUser={currentUser}
            />

            <EditBookingModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedBooking(null);
                }}
                onSubmit={handleEditBooking}
                booking={selectedBooking}
                currentUser={currentUser}
            />
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setBookingToConfirm(null);
                }}
                booking={bookingToConfirm}
                onConfirm={handleConfirmBooking}
            />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setBookingToDelete(null);
                }}
                booking={bookingToDelete}
                onConfirm={handleDeleteBooking}
            />
        </div>
    );
};

export default Dashboard;
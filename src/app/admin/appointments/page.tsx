'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  additionalNotes?: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API call
      // Simulated data for now
      const mockAppointments: Appointment[] = [
        {
          id: '1',
          clientName: 'Sarah Johnson',
          clientEmail: 'sarah@example.com',
          clientPhone: '+1234567890',
          serviceType: 'Maquillaje de Novia',
          appointmentDate: '2024-01-15',
          appointmentTime: '10:00',
          status: 'CONFIRMED',
          additionalNotes: 'Outdoor wedding, natural look preferred',
          createdAt: '2024-01-10T10:00:00Z',
        },
        {
          id: '2',
          clientName: 'Maria García',
          clientEmail: 'maria@example.com',
          clientPhone: '+1234567891',
          serviceType: 'Maquillaje de Evento',
          appointmentDate: '2024-01-16',
          appointmentTime: '14:30',
          status: 'PENDING',
          additionalNotes: 'Corporate event, professional look',
          createdAt: '2024-01-11T15:30:00Z',
        },
        {
          id: '3',
          clientName: 'Jennifer Lee',
          clientEmail: 'jennifer@example.com',
          clientPhone: '+1234567892',
          serviceType: 'Maquillaje de Sesión de Fotos',
          appointmentDate: '2024-01-18',
          appointmentTime: '09:00',
          status: 'CONFIRMED',
          additionalNotes: 'Fashion photography, bold colors',
          createdAt: '2024-01-12T09:15:00Z',
        },
        {
          id: '4',
          clientName: 'Emma Wilson',
          clientEmail: 'emma@example.com',
          clientPhone: '+1234567893',
          serviceType: 'Consulta de Maquillaje',
          appointmentDate: '2024-01-20',
          appointmentTime: '11:00',
          status: 'PENDING',
          createdAt: '2024-01-13T14:20:00Z',
        },
      ];

      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (
    id: string,
    newStatus: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  ) => {
    try {
      // TODO: Implement actual API call
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
      );
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && appointment.status === 'PENDING') ||
      (filter === 'confirmed' && appointment.status === 'CONFIRMED') ||
      (filter === 'completed' && appointment.status === 'COMPLETED') ||
      (filter === 'cancelled' && appointment.status === 'CANCELLED');
    const matchesSearch =
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Appointments</h1>
        <p className='text-gray-600'>Manage all client appointments</p>
      </div>

      {/* Filters and Search */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({appointments.filter((a) => a.status === 'PENDING').length}
            )
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'confirmed'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmed (
            {appointments.filter((a) => a.status === 'CONFIRMED').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed (
            {appointments.filter((a) => a.status === 'COMPLETED').length})
          </button>
        </div>

        <div className='w-full sm:w-auto'>
          <input
            type='text'
            placeholder='Search appointments...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Client Information
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Service
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date & Time
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {appointment.clientName}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {appointment.clientEmail}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {appointment.clientPhone}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>
                      {appointment.serviceType}
                    </div>
                    {appointment.additionalNotes && (
                      <div
                        className='text-sm text-gray-500 max-w-xs truncate'
                        title={appointment.additionalNotes}
                      >
                        {appointment.additionalNotes}
                      </div>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {appointment.appointmentTime}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex space-x-2'>
                      {appointment.status === 'PENDING' && (
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, 'CONFIRMED')
                          }
                          className='text-green-600 hover:text-green-900'
                        >
                          Confirm
                        </button>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <button
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, 'COMPLETED')
                          }
                          className='text-blue-600 hover:text-blue-900'
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, 'CANCELLED')
                        }
                        className='text-red-600 hover:text-red-900'
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className='text-center py-12'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            <h3 className='mt-2 text-sm font-medium text-gray-900'>
              No appointments found
            </h3>
            <p className='mt-1 text-sm text-gray-500'>
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No appointments have been scheduled yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow-sm border text-center'>
          <div className='text-2xl font-bold text-gray-900'>
            {appointments.filter((a) => a.status === 'PENDING').length}
          </div>
          <div className='text-sm text-gray-600'>Pending Approval</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm border text-center'>
          <div className='text-2xl font-bold text-green-600'>
            {appointments.filter((a) => a.status === 'CONFIRMED').length}
          </div>
          <div className='text-sm text-gray-600'>Confirmed</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm border text-center'>
          <div className='text-2xl font-bold text-blue-600'>
            {appointments.filter((a) => a.status === 'COMPLETED').length}
          </div>
          <div className='text-sm text-gray-600'>Completed</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm border text-center'>
          <div className='text-2xl font-bold text-red-600'>
            {appointments.filter((a) => a.status === 'CANCELLED').length}
          </div>
          <div className='text-sm text-gray-600'>Cancelled</div>
        </div>
      </div>
    </div>
  );
}

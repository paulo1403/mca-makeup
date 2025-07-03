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

interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  todayAppointments: number;
  thisWeekAppointments: number;
  thisMonthRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // Simulated data for now
      const mockStats: DashboardStats = {
        totalAppointments: 127,
        pendingAppointments: 8,
        confirmedAppointments: 15,
        todayAppointments: 3,
        thisWeekAppointments: 12,
        thisMonthRevenue: 2850,
      };

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
          createdAt: '2024-01-11T15:30:00Z',
        },
      ];

      setStats(mockStats);
      setRecentAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600'>Overview of your makeup business</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-blue-600'
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
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Appointments
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.totalAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-yellow-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pending</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.pendingAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Confirmed</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.confirmedAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Today</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.todayAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-indigo-600'
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
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>This Week</p>
                <p className='text-2xl font-semibold text-gray-900'>
                  {stats.thisWeekAppointments}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                  <svg
                    className='w-4 h-4 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
                    />
                  </svg>
                </div>
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Monthly Revenue
                </p>
                <p className='text-2xl font-semibold text-gray-900'>
                  ${stats.thisMonthRevenue}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-6 py-4 border-b'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Recent Appointments
          </h2>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Client
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
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {appointment.clientName}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {appointment.clientEmail}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {appointment.serviceType}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}{' '}
                    at {appointment.appointmentTime}
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
                    <button className='text-indigo-600 hover:text-indigo-900 mr-4'>
                      Edit
                    </button>
                    <button className='text-red-600 hover:text-red-900'>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Quick Actions
          </h3>
          <div className='space-y-3'>
            <a
              href='/admin/appointments'
              className='block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'
            >
              View All Appointments
            </a>
            <a
              href='/admin/availability'
              className='block w-full bg-gray-600 text-white text-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors'
            >
              Manage Availability
            </a>
            <button className='block w-full bg-green-600 text-white text-center px-4 py-2 rounded-md hover:bg-green-700 transition-colors'>
              Export Reports
            </button>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            This Week
          </h3>
          <div className='text-sm text-gray-600'>
            <p className='mb-2'>Monday: 3 appointments</p>
            <p className='mb-2'>Tuesday: 2 appointments</p>
            <p className='mb-2'>Wednesday: 4 appointments</p>
            <p className='mb-2'>Thursday: 1 appointment</p>
            <p className='mb-2'>Friday: 2 appointments</p>
            <p className='text-gray-400'>Weekend: No appointments</p>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Popular Services
          </h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Bridal Makeup</span>
              <span className='text-sm font-medium'>45%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Event Makeup</span>
              <span className='text-sm font-medium'>30%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Photo Shoot</span>
              <span className='text-sm font-medium'>15%</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600'>Consultation</span>
              <span className='text-sm font-medium'>10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TimeSlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface SpecialDate {
  id: string;
  date: string;
  isAvailable: boolean;
  customHours?: {
    startTime: string;
    endTime: string;
  };
  note?: string;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function AvailabilityPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddSpecialDate, setShowAddSpecialDate] = useState(false);

  // Form states
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
  });

  const [newSpecialDate, setNewSpecialDate] = useState({
    date: '',
    isAvailable: false,
    startTime: '09:00',
    endTime: '17:00',
    note: '',
  });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      // TODO: Implement actual API calls
      // Simulated data for now
      const mockTimeSlots: TimeSlot[] = [
        {
          id: '1',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          isActive: true,
        }, // Monday
        {
          id: '2',
          dayOfWeek: 2,
          startTime: '09:00',
          endTime: '17:00',
          isActive: true,
        }, // Tuesday
        {
          id: '3',
          dayOfWeek: 3,
          startTime: '09:00',
          endTime: '17:00',
          isActive: true,
        }, // Wednesday
        {
          id: '4',
          dayOfWeek: 4,
          startTime: '09:00',
          endTime: '17:00',
          isActive: true,
        }, // Thursday
        {
          id: '5',
          dayOfWeek: 5,
          startTime: '09:00',
          endTime: '15:00',
          isActive: true,
        }, // Friday
        {
          id: '6',
          dayOfWeek: 6,
          startTime: '10:00',
          endTime: '14:00',
          isActive: false,
        }, // Saturday (inactive)
        {
          id: '7',
          dayOfWeek: 0,
          startTime: '10:00',
          endTime: '14:00',
          isActive: false,
        }, // Sunday (inactive)
      ];

      const mockSpecialDates: SpecialDate[] = [
        {
          id: '1',
          date: '2024-01-25',
          isAvailable: false,
          note: 'Personal vacation day',
        },
        {
          id: '2',
          date: '2024-02-14',
          isAvailable: true,
          customHours: { startTime: '07:00', endTime: '20:00' },
          note: "Valentine's Day - Extended hours",
        },
      ];

      setTimeSlots(mockTimeSlots);
      setSpecialDates(mockSpecialDates);
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = async () => {
    try {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        dayOfWeek: newSlot.dayOfWeek,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        isActive: true,
      };

      setTimeSlots((prev) => [...prev, slot]);
      setShowAddSlot(false);
      setNewSlot({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const toggleTimeSlot = async (id: string) => {
    try {
      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
        )
      );
    } catch (error) {
      console.error('Error toggling time slot:', error);
    }
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  const addSpecialDate = async () => {
    try {
      const specialDate: SpecialDate = {
        id: Date.now().toString(),
        date: newSpecialDate.date,
        isAvailable: newSpecialDate.isAvailable,
        customHours: newSpecialDate.isAvailable
          ? {
              startTime: newSpecialDate.startTime,
              endTime: newSpecialDate.endTime,
            }
          : undefined,
        note: newSpecialDate.note || undefined,
      };

      setSpecialDates((prev) => [...prev, specialDate]);
      setShowAddSpecialDate(false);
      setNewSpecialDate({
        date: '',
        isAvailable: false,
        startTime: '09:00',
        endTime: '17:00',
        note: '',
      });
    } catch (error) {
      console.error('Error adding special date:', error);
    }
  };

  const deleteSpecialDate = async (id: string) => {
    try {
      setSpecialDates((prev) => prev.filter((date) => date.id !== id));
    } catch (error) {
      console.error('Error deleting special date:', error);
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
        <h1 className='text-2xl font-bold text-gray-900'>
          Availability Management
        </h1>
        <p className='text-gray-600'>
          Manage your regular schedule and special dates
        </p>
      </div>

      {/* Regular Schedule */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-6 py-4 border-b flex justify-between items-center'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Regular Weekly Schedule
          </h2>
          <button
            onClick={() => setShowAddSlot(true)}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Add Time Slot
          </button>
        </div>

        <div className='p-6'>
          <div className='grid gap-4'>
            {DAYS_OF_WEEK.map((day, index) => {
              const daySlots = timeSlots.filter(
                (slot) => slot.dayOfWeek === index
              );
              return (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{day}</h3>
                    <div className='mt-1 space-y-1'>
                      {daySlots.length > 0 ? (
                        daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className='flex items-center space-x-4'
                          >
                            <span
                              className={`text-sm ${
                                slot.isActive
                                  ? 'text-gray-700'
                                  : 'text-gray-400'
                              }`}
                            >
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <div className='flex space-x-2'>
                              <button
                                onClick={() => toggleTimeSlot(slot.id)}
                                className={`text-xs px-2 py-1 rounded ${
                                  slot.isActive
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {slot.isActive ? 'Active' : 'Inactive'}
                              </button>
                              <button
                                onClick={() => deleteTimeSlot(slot.id)}
                                className='text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200'
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className='text-sm text-gray-400'>
                          No availability set
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showAddSlot && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Add Time Slot
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Day of Week
                </label>
                <select
                  value={newSlot.dayOfWeek}
                  onChange={(e) =>
                    setNewSlot((prev) => ({
                      ...prev,
                      dayOfWeek: parseInt(e.target.value),
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Start Time
                  </label>
                  <input
                    type='time'
                    value={newSlot.startTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    End Time
                  </label>
                  <input
                    type='time'
                    value={newSlot.endTime}
                    onChange={(e) =>
                      setNewSlot((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>
            </div>
            <div className='flex space-x-3 mt-6'>
              <button
                onClick={addTimeSlot}
                className='flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                Add Slot
              </button>
              <button
                onClick={() => setShowAddSlot(false)}
                className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Dates */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='px-6 py-4 border-b flex justify-between items-center'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Special Dates & Exceptions
          </h2>
          <button
            onClick={() => setShowAddSpecialDate(true)}
            className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
          >
            Add Special Date
          </button>
        </div>

        <div className='p-6'>
          {specialDates.length > 0 ? (
            <div className='space-y-4'>
              {specialDates.map((date) => (
                <div key={date.id} className='p-4 border rounded-lg'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        {new Date(date.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </h3>
                      <div className='mt-1'>
                        {date.isAvailable ? (
                          <span className='text-sm text-green-700'>
                            Available: {date.customHours?.startTime} -{' '}
                            {date.customHours?.endTime}
                          </span>
                        ) : (
                          <span className='text-sm text-red-700'>
                            Not Available
                          </span>
                        )}
                      </div>
                      {date.note && (
                        <p className='text-sm text-gray-600 mt-1'>
                          {date.note}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteSpecialDate(date.id)}
                      className='text-red-600 hover:text-red-900'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No special dates set</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Special Date Modal */}
      {showAddSpecialDate && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Add Special Date
            </h3>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Date
                </label>
                <input
                  type='date'
                  value={newSpecialDate.date}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
              <div>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={newSpecialDate.isAvailable}
                    onChange={(e) =>
                      setNewSpecialDate((prev) => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                    className='mr-2'
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    Available on this date
                  </span>
                </label>
              </div>
              {newSpecialDate.isAvailable && (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Start Time
                    </label>
                    <input
                      type='time'
                      value={newSpecialDate.startTime}
                      onChange={(e) =>
                        setNewSpecialDate((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      End Time
                    </label>
                    <input
                      type='time'
                      value={newSpecialDate.endTime}
                      onChange={(e) =>
                        setNewSpecialDate((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>
                </div>
              )}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Note (optional)
                </label>
                <textarea
                  value={newSpecialDate.note}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='e.g., Holiday, Vacation, Extended hours...'
                />
              </div>
            </div>
            <div className='flex space-x-3 mt-6'>
              <button
                onClick={addSpecialDate}
                className='flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors'
              >
                Add Date
              </button>
              <button
                onClick={() => setShowAddSpecialDate(false)}
                className='flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

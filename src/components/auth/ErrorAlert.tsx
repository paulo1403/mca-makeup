'use client';

interface ErrorAlertProps {
  error: string | null;
}

export const ErrorAlert = ({ error }: ErrorAlertProps) => {
  if (!error) return null;

  return (
    <div className='bg-red-900/50 border border-red-500 rounded-lg p-4'>
      <div className='flex items-center space-x-3'>
        <div className='text-red-400'>
          <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
        <p className='text-red-300 text-sm'>{error}</p>
      </div>
    </div>
  );
};

"use client"
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import BookingSchema, { BookingData } from '@/lib/bookingSchema'
import StepIndicator from './booking/StepIndicator'
import Step1 from './booking/steps/Step1_PersonalInfo'
import Step2 from './booking/steps/Step2_ServiceSelection'
import Step3 from './booking/steps/Step3_Location'
import Step4 from './booking/steps/Step4_DateTime'
import Step5 from './booking/steps/Step5_Confirmation'

export default function BookingFlow() {
  const methods = useForm<BookingData>({ resolver: zodResolver(BookingSchema), defaultValues: { name: '', phone: '', email: '', selectedServices: [], locationType: 'HOME', date: undefined as unknown as Date, timeSlot: '', message: '', agreedToTerms: false } })
  const [currentStep, setCurrentStep] = useState(1)
  const total = 5

  const handleNext = async () => {
    const stepFields: Record<number, string[]> = {
      1: ['name', 'phone', 'email'],
      2: ['selectedServices'],
      3: ['locationType', 'district', 'address'],
      4: ['date', 'timeSlot'],
      5: ['agreedToTerms'],
    }
    const fields = stepFields[currentStep] || []
  const valid = await methods.trigger(fields as any)
    if (valid) setCurrentStep((s) => Math.min(total, s + 1))
  }

  const handlePrev = () => setCurrentStep((s) => Math.max(1, s - 1))

  return (
    <FormProvider {...methods}>
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <StepIndicator currentStep={currentStep} totalSteps={total} />
              <div className="mt-6 bg-card p-6 rounded-lg">
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
                {currentStep === 4 && <Step4 />}
                {currentStep === 5 && <Step5 />}

                <div className="flex items-center justify-between mt-6">
                  <div>
                    {currentStep > 1 && (
                      <button type="button" onClick={handlePrev} className="px-4 py-2 border rounded">Anterior</button>
                    )}
                  </div>
                  <div>
                    {currentStep < total ? (
                      <button type="button" onClick={handleNext} className="px-6 py-3 bg-accent-primary text-white rounded">Siguiente</button>
                    ) : (
                      <button type="button" onClick={methods.handleSubmit((data) => console.log('submit', data))} className="px-6 py-3 bg-accent-primary text-white rounded">Enviar</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="p-6 bg-card rounded-lg">
                <h4 className="font-playfair text-lg mb-2">Resumen</h4>
                <div className="text-sm text-gray-600">Aquí va un resumen condensado de la reserva.</div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </FormProvider>
  )
}

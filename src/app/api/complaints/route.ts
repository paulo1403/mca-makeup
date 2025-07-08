import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerDni,
      customerEmail,
      complaintType,
      complaintDetail,
      complaintNumber,
      submissionDate,
    } = body;

    // Validaciones básicas
    if (!customerName || !customerDni || !customerEmail || !complaintType || !complaintDetail) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Por ahora, simulamos el registro exitoso
    // En producción, aquí guardarías en la base de datos
    console.log('Queja/Reclamo registrado:', {
      complaintNumber,
      customerName,
      customerEmail,
      complaintType,
      submissionDate,
    });

    // También podrías enviar por email
    // await sendEmailNotification(body);
    
    return NextResponse.json({
      success: true,
      complaintNumber,
      message: 'Queja/reclamo registrado exitosamente',
    });

  } catch (error) {
    console.error('Error al crear queja/reclamo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const complaintNumber = searchParams.get('number');

    if (!complaintNumber) {
      return NextResponse.json(
        { error: 'Número de reclamo requerido' },
        { status: 400 }
      );
    }

    // Por ahora simulamos una respuesta
    // En producción consultarías la base de datos
    const complaint = {
      complaintNumber,
      submissionDate: new Date().toISOString(),
      complaintType: 'RECLAMO',
      status: 'PENDING',
      responseDate: null,
      response: null,
      customerName: 'Cliente Demo',
      serviceType: 'Maquillaje Demo',
    };

    return NextResponse.json({ complaint });

  } catch (error) {
    console.error('Error al consultar queja/reclamo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

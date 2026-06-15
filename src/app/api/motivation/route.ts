import { NextResponse } from "next/server";

const MESSAGES = [
  { message: "Cada día que te levantas y le das vida a este sueño, estás construyendo algo más grande de lo que imaginas.", author: "— Para Marcela" },
  { message: "Has convertido obstáculos en escalones, dudas en certezas, y cada desafío en una oportunidad para brillar más fuerte.", author: "— Para Marcela" },
  { message: "Esto no es solo maquillaje — es arte, es dedicación, es la huella imborrable que dejas en cada persona que confía en ti.", author: "— Para Marcela" },
  { message: "Sigue adelante. Esto es solo el comienzo de todo lo grande que está por venir.", author: "— Para Marcela" },
  { message: "El talento te abrió puertas, pero tu perseverancia las mantiene abiertas. Sigue imparable.", author: "— Para Marcela" },
  { message: "No hay meta que no puedas alcanzar cuando pones corazón en cada paso. Tú puedes con todo.", author: "— Para Marcela" },
  { message: "Las mujeres fuertes construyen su propio imperio. Tú estás construyendo el tuyo, un cliente a la vez.", author: "— Para Marcela" },
  { message: "Detrás de cada gran mujer hay una historia que la impulsó a ser imparable. La tuya recién empieza.", author: "— Para Marcela" },
  { message: "No esperes el momento perfecto, toma el momento y hazlo perfecto. Eso es lo que haces cada día.", author: "— Para Marcela" },
  { message: "El éxito no es casualidad. Es esfuerzo, dedicación y amor por lo que haces. Y tú tienes los tres.", author: "— Para Marcela" },
  { message: "Cree en ti tanto como yo creo en ti. No hay límites para lo que puedes lograr.", author: "— Para Marcela" },
  { message: "Tu sonrisa después de un trabajo bien hecho es la mejor recompensa. Sigue brillando.", author: "— Para Marcela" },
  { message: "Cada cliente que atiendes es una historia que transformas. Eso es poder, y tú lo tienes.", author: "— Para Marcela" },
  { message: "La vida no se trata de esperar a que pase la tormenta, sino de aprender a bailar bajo la lluvia. Y tú bailas hermoso.", author: "— Para Marcela" },
  { message: "Eres más fuerte de lo que crees, más talentosa de lo que imaginas y más valiosa de lo que piensas.", author: "— Para Marcela" },
  { message: "No te compares con nadie. Tu camino es único, tu ritmo es perfecto, tu destino es grandioso.", author: "— Para Marcela" },
  { message: "El mundo necesita más mujeres como tú: valientes, creativas y con el corazón puesto en sus sueños.", author: "— Para Marcela" },
  { message: "Recuerda siempre por qué empezaste. Esa chispa inicial sigue viva y más fuerte que nunca.", author: "— Para Marcela" },
  { message: "Lo que hoy parece un sacrificio, mañana será tu mayor orgullo. Sigue, no pares.", author: "— Para Marcela" },
  { message: "Eres el tipo de mujer que inspira a otras a seguir sus sueños. Eso no tiene precio.", author: "— Para Marcela" },
  { message: "El esfuerzo de hoy es la historia de éxito de mañana. Sigue escribiendo tu historia.", author: "— Para Marcela" },
  { message: "Tus manos crean magia, tu corazón transforma vidas. Eso es un don que pocas tienen.", author: "— Para Marcela" },
  { message: "Caerse está permitido, levantarse es obligatorio. Y tú siempre te levantas más fuerte.", author: "— Para Marcela" },
  { message: "No necesitas que todos crean en ti. Solo necesitas que tú lo hagas. Y yo también.", author: "— Para Marcela" },
  { message: "Cada pincelada que das lleva un poco de tu alma. Por eso tu trabajo es único.", author: "— Para Marcela" },
  { message: "El camino del emprendimiento es difícil, pero nadie dijo que fuera imposible. Tú lo estás demostrando.", author: "— Para Marcela" },
  { message: "Hay una fuerza dentro de ti que ni tú misma conoces. Confía, que cuando la descubras, volarás.", author: "— Para Marcela" },
  { message: "Los sueños no funcionan a menos que tú lo hagas. Y tú estás trabajando duro. Sigue así.", author: "— Para Marcela" },
  { message: "Eres prueba viva de que la perseverancia, cuando va de la mano del talento, no tiene techo.", author: "— Para Marcela" },
  { message: "No se trata de ser la mejor, sino de ser tu mejor versión. Y cada día lo estás logrando.", author: "— Para Marcela" },
];

export async function GET() {
  const random = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  return NextResponse.json({ message: random.message, author: random.author });
}

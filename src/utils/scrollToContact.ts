/**
 * Función helper para hacer scroll al formulario de contacto con offset correcto
 */
export const scrollToContact = () => {
  const element = document.querySelector("#contacto");
  if (element) {
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 80;
    const isMobile = window.innerWidth < 768;
    const extraMargin = isMobile ? 60 : 30;
    
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - extraMargin;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};
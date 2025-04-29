function initHeader() {
  const menuMobile = document.querySelector('.menu-mobile');
  const menu       = document.querySelector('.menu');
  const header     = document.querySelector('.cabecalho');
  const links      = document.querySelectorAll('.menu a');
  if (!menuMobile || !menu) return;

  menuMobile.addEventListener('click', () => {
    menuMobile.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  links.forEach(a => a.addEventListener('click', () => {
    if (menu.classList.contains('active')) {
      menuMobile.classList.remove('active');
      menu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }));

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

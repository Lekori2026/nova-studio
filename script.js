const buttons = document.querySelectorAll('button');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    button.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(0.98)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 180,
        easing: 'ease-out'
      }
    );
  });
});

const heroVisual = document.querySelector('.hero-visual');
const windowCard = document.querySelector('.window');

if (heroVisual && windowCard) {
  heroVisual.addEventListener('mousemove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    const rotateY = x * 12;
    const rotateX = y * -10;

    windowCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    windowCard.style.transform = 'perspective(1200px) rotateY(-12deg) rotateX(6deg)';
  });
}

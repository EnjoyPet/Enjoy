// Scrolling
let scrolling = document.querySelectorAll(
  '.petfriendly__grid, .shopinfo__grid, .adoptme__grid'
);

window.onscroll = () => {
  scrolling.forEach((sl) => {
    let top = window.scrollY;
    let offset = sl.offsetTop - 500;
    let height = sl.offsetHeight;

    if (top >= offset && top < offset + height) {
      sl.classList.add('sl-active');
    } else {
      sl.classList.remove('sl-active');
    }
  });
};


let slideIndex = 0;
showHeroSlides();

function showHeroSlides() {
  let slides = document.getElementsByClassName("slide");
  if (slides.length > 0) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showHeroSlides, 4000); 
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".card-slideshow").forEach(slideshow => {
    let slides = slideshow.querySelectorAll(".card-slide");
    let index = 0;

    if (slides.length > 0) {
      slides[index].classList.add("active");

      setInterval(() => {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");
      }, 3000); 
    }
  });
});

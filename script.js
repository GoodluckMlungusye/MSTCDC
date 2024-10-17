// Toggle Hamburger Menu on Mobile
function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("show");
}

// Hero Section Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".slider img");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Show the first slide initially
showSlide(currentSlide);

// Slide every 3 seconds
setInterval(nextSlide, 3000);

// Fetch Courses API and display them
const itemList = document.getElementById("item-list");
const categoryButtonsContainer = document.getElementById("category-buttons");
const categorySkeletons = document.getElementById("category-skeleton");
const productSkeletons = document.getElementById("product-skeletons");
let courses = [];
let categories = [];

// Show skeletons while fetching data
categorySkeletons.style.display = "flex";
productSkeletons.style.display = "flex";

// Fetch all courses
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    courses = data;
    displayCourses(courses);
    productSkeletons.style.display = "none";
  })
  .catch((error) => console.error("Error fetching the API:", error));

// Fetch categories and display category buttons
fetch("https://fakestoreapi.com/products/categories")
  .then((response) => response.json())
  .then((data) => {
    categories = data;
    createCategoryButtons(categories);
    categorySkeletons.style.display = "none";
  })
  .catch((error) => console.error("Error fetching categories:", error));

// Function to create category buttons
function createCategoryButtons(categories) {
  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.classList.add("active");
  allButton.addEventListener("click", () => filterProductsByCategory("all"));
  categoryButtonsContainer.appendChild(allButton);

  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);
    categoryButton.addEventListener("click", () =>
      filterProductsByCategory(category)
    );
    categoryButtonsContainer.appendChild(categoryButton);
  });
}

// Function to filter courses by category
function filterProductsByCategory(category) {
  const allButtons = document.querySelectorAll(".category-buttons button");
  allButtons.forEach((button) => button.classList.remove("active"));

  // Add 'active' class to the clicked button
  const clickedButton = Array.from(allButtons).find(
    (button) =>
      button.textContent.toLowerCase() === category.toLowerCase() ||
      (category === "all" && button.textContent === "All")
  );
  clickedButton.classList.add("active");

  if (category === "all") {
    displayCourses(courses);
  } else {
    productSkeletons.style.display = "flex";
    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then((response) => response.json())
      .then((data) => {
        displayCourses(data);
        productSkeletons.style.display = "none";
      })
      .catch((error) =>
        console.error("Error fetching products by category:", error)
      );
  }
}

// Function to display courses
function displayCourses(items) {
  itemList.innerHTML = "";
  items.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");

    itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h5>${item.title}</h5>
            <p>Added on: 12th Jan 2024</p>
            <button>Read More</button>
        `;
    itemList.appendChild(itemCard);
  });
}

// Search bar functionality
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCourses = courses.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  displayCourses(filteredCourses);
});

// Count Up Functionality
function countUp(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const incrementTime = Math.floor(duration / target);
  let count = 0;

  const timer = setInterval(() => {
    count++;
    element.innerText = count;
    if (count >= target) {
      clearInterval(timer);
      element.innerText = target;
    }
  }, incrementTime);
}

// Intersection Observer to trigger count up when in view
const statsSection = document.getElementById("stats");
const countUpElements = document.querySelectorAll(".count-up");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countUpElements.forEach((element) => countUp(element));
      observer.unobserve(entry.target);
    }
  });
});

observer.observe(statsSection);

// Sliding Testimonials
let currentIndex = 0;
const track = document
  .getElementById("testimonial-slider")
  .querySelector(".testimonial-track");
const testimonials = document.querySelectorAll(".testimonial-card");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

function getVisibleSlides() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1024) {
    return 3;
  } else if (screenWidth >= 768) {
    return 2;
  } else {
    return 1;
  }
}

function updateSlidePosition() {
  const visibleSlides = getVisibleSlides();
  const slideWidth = testimonials[0].clientWidth + 20;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function moveToNextSlide() {
  const visibleSlides = getVisibleSlides();
  const totalTestimonials = testimonials.length;

  if (currentIndex < totalTestimonials - visibleSlides) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateSlidePosition();
}

function moveToPrevSlide() {
  const visibleSlides = getVisibleSlides();
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = testimonials.length - visibleSlides;
  }
  updateSlidePosition();
}

// Event listeners for buttons
nextButton.addEventListener("click", moveToNextSlide);
prevButton.addEventListener("click", moveToPrevSlide);

// Resize event listener for responsive adjustments
window.addEventListener("resize", updateSlidePosition);

// Initial setup
updateSlidePosition();

// Get the button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Show or hide the button based on scroll position
window.onscroll = function () {
  if (
    document.body.scrollTop > 200 ||
    document.documentElement.scrollTop > 200
  ) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

// Scroll to the top when the button is clicked
scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

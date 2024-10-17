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

// Fetch Items from Fake API and display them
const itemList = document.getElementById("item-list");
const categoryButtonsContainer = document.getElementById("category-buttons");
const categorySkeletons = document.getElementById("category-skeleton");
const productSkeletons = document.getElementById("product-skeletons");
let products = []; // Store all products
let categories = []; // Store categories

// Show skeletons while fetching data
categorySkeletons.style.display = "flex"; // Show category skeletons
productSkeletons.style.display = "flex"; // Show product skeletons

// Fetch all products
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    displayProducts(products);
    productSkeletons.style.display = "none"; // Hide product skeletons after loading
  })
  .catch((error) => console.error("Error fetching the API:", error));

// Fetch categories and display category buttons
fetch("https://fakestoreapi.com/products/categories")
  .then((response) => response.json())
  .then((data) => {
    categories = data;
    createCategoryButtons(categories);
    categorySkeletons.style.display = "none"; // Hide category skeletons after loading
  })
  .catch((error) => console.error("Error fetching categories:", error));

// Function to create category buttons
function createCategoryButtons(categories) {
  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.classList.add("active"); // "All" is active by default
  allButton.addEventListener("click", () => filterProductsByCategory("all"));
  categoryButtonsContainer.appendChild(allButton);

  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.textContent =
      category.charAt(0).toUpperCase() + category.slice(1); // Capitalize first letter
    categoryButton.addEventListener("click", () =>
      filterProductsByCategory(category)
    );
    categoryButtonsContainer.appendChild(categoryButton);
  });
}

// Function to filter products by category
function filterProductsByCategory(category) {
  // Remove 'active' class from all buttons
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
    displayProducts(products); // Show all products if 'All' is clicked
  } else {
    // Show product skeletons while fetching filtered products
    productSkeletons.style.display = "flex";
    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then((response) => response.json())
      .then((data) => {
        displayProducts(data); // Display filtered products by category
        productSkeletons.style.display = "none"; // Hide product skeletons after loading
      })
      .catch((error) =>
        console.error("Error fetching products by category:", error)
      );
  }
}

// Function to display products
function displayProducts(items) {
  itemList.innerHTML = ""; // Clear the item list
  items.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");

    itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>${item.description.slice(0, 100)}...</p>
            <button>Learn More</button>
        `;
    itemList.appendChild(itemCard);
  });
}

// Search bar functionality
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts); // Display the filtered products
});

// Count Up Functionality
function countUp(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000; // Duration in milliseconds
  const incrementTime = Math.floor(duration / target);
  let count = 0;

  const timer = setInterval(() => {
    count++;
    element.innerText = count;
    if (count >= target) {
      clearInterval(timer);
      element.innerText = target; // Ensure we end on the target number
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
      observer.unobserve(entry.target); // Stop observing after count up
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
  // Determine how many testimonials to show based on screen size
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1024) {
    return 3; // Show 3 testimonials per view on large screens
  } else if (screenWidth >= 768) {
    return 2; // Show 2 testimonials per view on medium screens
  } else {
    return 1; // Show 1 testimonial per view on small screens
  }
}

function updateSlidePosition() {
  const visibleSlides = getVisibleSlides();
  const slideWidth = testimonials[0].clientWidth + 20; // Including margin
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function moveToNextSlide() {
  const visibleSlides = getVisibleSlides();
  const totalTestimonials = testimonials.length;

  if (currentIndex < totalTestimonials - visibleSlides) {
    currentIndex++;
  } else {
    currentIndex = 0; // Loop back to the beginning
  }
  updateSlidePosition();
}

function moveToPrevSlide() {
  const visibleSlides = getVisibleSlides();
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = testimonials.length - visibleSlides; // Loop to the end
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
    scrollToTopBtn.style.display = "block"; // Show the button
  } else {
    scrollToTopBtn.style.display = "none"; // Hide the button
  }
};

// Scroll to the top when the button is clicked
scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to top
});

// Define constants for Users and Countries
const TOTAL_USERS = 200;
const TOTAL_COUNTRIES = 178;

// Get elements to update their data-targets
const coursesCountElement = document.getElementById("courses-count");
const usersCountElement = document.getElementById("users-count");
const countriesCountElement = document.getElementById("countries-count");

// Set Users and Countries data-targets from constants
usersCountElement.setAttribute("data-target", TOTAL_USERS);
countriesCountElement.setAttribute("data-target", TOTAL_COUNTRIES);

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
let allCourses = [];
let coursesWithDate = [];
let categories = [];

// Show skeletons while fetching data
categorySkeletons.style.display = "flex";
productSkeletons.style.display = "flex";

// Fetch all courses from the old API
fetch("https://lms.mstcdc.ac.tz/webservice/rest/server.php?wstoken=dbac8af81c4e9ba1b6e20ecff981134f&wsfunction=core_course_search_courses&moodlewsrestformat=json&criterianame=search&criteriavalue=")
  .then((response) => response.json())
  .then((data) => {
    allCourses = data.courses; 
    const totalCourses = data.total; 
    coursesCountElement.setAttribute("data-target", totalCourses); 
    countUpElements.forEach((element) => countUp(element)); 
    displayCourses(allCourses); 
    productSkeletons.style.display = "none";
  })
  .catch((error) => console.error("Error fetching the courses API:", error));

// Fetch courses with timecreated from the new API
fetch("https://lms.mstcdc.ac.tz/webservice/rest/server.php?wstoken=dbac8af81c4e9ba1b6e20ecff981134f&wsfunction=core_course_get_courses&moodlewsrestformat=json")
  .then((response) => response.json())
  .then((data) => {
    const coursesWithTimeCreated = data; // Get courses with timecreated

    // Create a map for timecreated based on course ID
    const timeCreatedMap = {};
    coursesWithTimeCreated.forEach(course => {
      timeCreatedMap[course.id] = course.timecreated;
    });

    // Merge timecreated into allCourses
    coursesWithDate = allCourses.map(course => {
      return {
        ...course,
        timecreated: timeCreatedMap[course.id] || null // Add timecreated if available
      };
    });

    // Sort courses by timecreated (latest first)
    coursesWithDate.sort((a, b) => {
      return (b.timecreated || 0) - (a.timecreated || 0); // Handle null cases
    });

    // Display merged courses
    displayCourses(coursesWithDate); 
    productSkeletons.style.display = "none"; 
  })
  .catch((error) => console.error("Error fetching courses with timecreated:", error));

// Fetch categories and display category buttons
fetch("https://lms.mstcdc.ac.tz/webservice/rest/server.php?wstoken=dbac8af81c4e9ba1b6e20ecff981134f&wsfunction=core_course_get_categories&moodlewsrestformat=json")
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

  allButton.addEventListener("click", () => {
    displayCourses(coursesWithDate); 
    updateActiveButton(allButton); 
  });

  categoryButtonsContainer.appendChild(allButton);

  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.textContent =
      category.name.charAt(0).toUpperCase() + category.name.slice(1);
    
    categoryButton.addEventListener("click", () => {
      filterCoursesByCategory(category.id);
      updateActiveButton(categoryButton); 
    });

    categoryButtonsContainer.appendChild(categoryButton);
  });
}

// Function to update the active button state
function updateActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".category-buttons button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  // Add 'active' class to the clicked button
  activeButton.classList.add("active");
}

// Function to filter courses by category ID
function filterCoursesByCategory(categoryId) {
  const filteredCourses = coursesWithDate.filter(course => course.categoryid === categoryId);
  displayCourses(filteredCourses); // Display filtered courses
}

// Function to display courses
function displayCourses(items) {
  itemList.innerHTML = ""; 
  if (items.length === 0) {
    itemList.innerHTML = "<p>No courses found in this category.</p>";
    return;
  }

  items.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");

    // Check if the course image is available, if not use a default image
    const courseImage = item.courseimage ? item.courseimage : 'assets/default.jpg';

    // Format the created date
    const createdDate = item.timecreated ? new Date(item.timecreated * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Unknown';

    itemCard.innerHTML = `
      <img src="${courseImage}" alt="${item.displayname}">
      <h5>${item.displayname}</h5>
      <p>Added on: ${createdDate}</p> <!-- Use timecreated here -->
      <button onclick="location.href='https://lms.mstcdc.ac.tz/course/view.php?id=${item.id}'">Read More</button>
    `;
    itemList.appendChild(itemCard);
  });
}

// Search bar functionality
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredCourses = coursesWithDate.filter((course) =>
    course.title.toLowerCase().includes(searchTerm)
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

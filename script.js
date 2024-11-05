// Define constants for Users and Countries
const TOTAL_USERS = 200;
const TOTAL_COUNTRIES = 126;

// Define the video URL 
const videoUrl = "https://www.youtube.com/watch?v=Dz121Oq4J6I";

// Define the images for the slider
const slidesData = [
  { src: "./assets/h1.jpg", alt: "Slide 1" },
  { src: "./assets/h2.jpg", alt: "Slide 2" },
  { src: "./assets/h3.jpg", alt: "Slide 3" },
  { src: "./assets/h4.jpg", alt: "Slide 4" },
  { src: "./assets/h5.jpg", alt: "Slide 5" },
  { src: "./assets/h6.jpg", alt: "Slide 6" },
  { src: "./assets/h7.jpg", alt: "Slide 7" }
];

// Define featured categories and the number of courses to display for each
const featuredCategories = {
  "Master of Leadership and Governance": 4,
  "SPA II Programmes": 2,
  "BA in Leadership and Governance": 2,
  "GIZ EnACT Program": 5,
  "Professional Courses": 2,
};

// Testimonials array
const testimonialsData = [
  {
    text: "MS TCDC Learning Center has transformed my learning experience. I can't recommend it enough.",
    name: "John Doe",
    jobTitle: "Business Analyst",
    image: "./assets/testimonials/t1.jpeg",
  },
  {
    text: "Amazing platform! I've gained so much knowledge and confidence in my field.",
    name: "Jane Smith",
    jobTitle: "Marketing Manager",
    image: "./assets/testimonials/t2.jpeg",
  },
  {
    text: "Highly recommend MS TCDC Learning Center. The staff and instructors are excellent!",
    name: "Sam Wilson",
    jobTitle: "Software Developer",
    image: "./assets/testimonials/t3.jpeg",
  },
  {
    text: "Incredible learning environment and superb support! Helped me grow in my career.",
    name: "Alice Brown",
    jobTitle: "HR Specialist",
    image: "./assets/testimonials/t4.jpeg",
  },
  {
    text: "The courses are well-structured, and the instructors are highly professional.",
    name: "Michael Lee",
    jobTitle: "Data Scientist",
    image: "./assets/testimonials/t5.jpeg",
  },
];

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

// Function to initialize the slider
function initializeSlider() {
  const sliderContainer = document.querySelector(".slider");
  
  // Create and append img elements for each slide in slidesData
  slidesData.forEach((slide, index) => {
    const img = document.createElement("img");
    img.src = slide.src;
    img.alt = slide.alt || `Slide ${index + 1}`;
    img.classList.add("slide");
    sliderContainer.appendChild(img);
  });

  // Start the slider functionality
  startSlider();
}

// Slider variables and logic
let currentSlide = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".slider .slide");
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  const slides = document.querySelectorAll(".slider .slide");
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Start the slider by showing the first slide and setting up the interval
function startSlider() {
  const slides = document.querySelectorAll(".slider .slide");
  
  if (slides.length > 0) {
    showSlide(currentSlide); // Show the first slide

    // Automatically transition slides every 3 seconds
    setInterval(nextSlide, 3000);
  }
}

// Initialize the slider when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeSlider);

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

// Function to display the courses once all data is fetched
function loadCoursesAndCategories() {
  // Fetch all courses and categories using Promise.all to synchronize the data fetching
  Promise.all([
    // Fetch courses from the old API
    fetch(
      "https://lms.mstcdc.ac.tz/webservice/rest/server.php?wstoken=dbac8af81c4e9ba1b6e20ecff981134f&wsfunction=core_course_search_courses&moodlewsrestformat=json&criterianame=search&criteriavalue="
    ).then((response) => response.json()),

    // Fetch courses with timecreated from the new API
    fetch(
      "https://lms.mstcdc.ac.tz/webservice/rest/server.php?wstoken=dbac8af81c4e9ba1b6e20ecff981134f&wsfunction=core_course_get_courses&moodlewsrestformat=json"
    ).then((response) => response.json()),

    // Fetch categories
    fetch(
      "https://lms.mstcdc.ac.tz/webservice/rest/server.php?wstoken=dbac8af81c4e9ba1b6e20ecff981134f&wsfunction=core_course_get_categories&moodlewsrestformat=json"
    ).then((response) => response.json()),
  ])
    .then(([oldCoursesData, coursesWithTimeCreated, categoriesData]) => {
      // Process old courses
      allCourses = oldCoursesData.courses;
      const totalCourses = oldCoursesData.total;
      coursesCountElement.setAttribute("data-target", totalCourses);
      countUpElements.forEach((element) => countUp(element));

      // Process courses with timecreated
      const timeCreatedMap = {};
      coursesWithTimeCreated.forEach((course) => {
        timeCreatedMap[course.id] = course.timecreated;
      });

      // Merge timecreated into allCourses
      coursesWithDate = allCourses.map((course) => ({
        ...course,
        timecreated: timeCreatedMap[course.id] || null,
      }));

      // Sort courses by timecreated (latest first)
      coursesWithDate.sort(
        (a, b) => (b.timecreated || 0) - (a.timecreated || 0)
      );

      // Process categories
      categories = categoriesData.filter(courseCategory => courseCategory.name !== "Academic Program");


      // Display featured courses by category
      createCategoryButtons(categories);
      displayCourses(getFeaturedCourses());
      categorySkeletons.style.display = "none";
      productSkeletons.style.display = "none";
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Function to get featured courses by category and random selection
function getFeaturedCourses() {
  let featuredCourses = [];

  // Loop through each featured category and pick random courses
  for (const [categoryName, count] of Object.entries(featuredCategories)) {
    // Find the category ID for the current category name
    const category = categories.find((cat) => cat.name === categoryName);

    if (category) {
      // Filter courses in this category
      const coursesInCategory = coursesWithDate.filter(
        (course) => course.categoryid === category.id
      );

      // Randomly select the specified number of courses
      const selectedCourses = coursesInCategory
        .sort(() => 0.5 - Math.random()) // Shuffle the array randomly
        .slice(0, count); // Take the required number of courses

      featuredCourses = featuredCourses.concat(selectedCourses);
    }
  }
  return featuredCourses;
}

// Function to create category buttons
function createCategoryButtons(categories) {
  const featuredButton = document.createElement("button");
  featuredButton.textContent = "Featured Courses";
  featuredButton.classList.add("active");

  featuredButton.addEventListener("click", () => {
    displayCourses(getFeaturedCourses());
    updateActiveButton(featuredButton);
  });

  categoryButtonsContainer.appendChild(featuredButton);

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
  const filteredCourses = coursesWithDate.filter(
    (course) => course.categoryid === categoryId
  );
  displayCourses(filteredCourses);
}

// Function to display courses
function displayCourses(items) {
  itemList.innerHTML = "";
  if (items.length === 0) {
    itemList.innerHTML = "<p>No courses found in this category.</p>";
    return;
  }

  const january2024 = new Date("2024-01-01").getTime() / 1000; // Timestamp for January 1, 2024

  items.forEach((item) => {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item-card");

    // Check if the course image is available, if not use a default image
    const courseImage = item.courseimage
      ? item.courseimage
      : "assets/default.jpg";

    // Format the created date
    const createdDate = item.timecreated
      ? new Date(item.timecreated * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown";

    // Check if the course is "new" (added from January 2024 onwards)
    const isNew = item.timecreated >= january2024;

    // Construct the HTML for the course item
    itemCard.innerHTML = `
      ${isNew ? '<div class="new-badge">New</div>' : ""}
      <img src="${courseImage}" alt="${item.fullname}">
      <h3>${item.fullname}</h3>
      <p class="created-date">Added on ${createdDate}</p>
    `;
      // Create the "View Course" button
  const viewButton = document.createElement("button");
  viewButton.textContent = "Read More";
  viewButton.classList.add("view-button");

  // Add click event to navigate to the course URL
  viewButton.addEventListener("click", () => {
    window.location.href = `https://lms.mstcdc.ac.tz/course/view.php?id=${item.id}`;
  });

  // Append the button to the itemCard
  itemCard.appendChild(viewButton);
    itemList.appendChild(itemCard);
  });
}

// Load all courses and categories once the page is ready
document.addEventListener("DOMContentLoaded", loadCoursesAndCategories);

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

// Function to convert different YouTube URL formats to an embeddable URL
function getEmbedUrl(url) {
  const urlObj = new URL(url);
  let videoId = "";
  
  if (urlObj.hostname.includes("youtu.be")) {
    videoId = urlObj.pathname.slice(1); // For short links like youtu.be/VIDEO_ID
  } else if (urlObj.hostname.includes("youtube.com")) {
    videoId = urlObj.searchParams.get("v"); // For full links like youtube.com/watch?v=VIDEO_ID
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

// Set the video iframe src after converting the URL
document.addEventListener("DOMContentLoaded", function () {
  const iframe = document.getElementById("videoIframe");
  iframe.src = getEmbedUrl(videoUrl);
});

// Function to display testimonials dynamically
function displayTestimonials(testimonials) {
  const testimonialTrack = document.querySelector(".testimonial-track");

  testimonialTrack.innerHTML = "";

  testimonials.forEach((testimonial) => {
    const testimonialCard = document.createElement("div");
    testimonialCard.classList.add("testimonial-card");

    testimonialCard.innerHTML = `
      <p class="testimonial-text">"${testimonial.text}"</p>
      <div class="client-info">
        <img src="${testimonial.image}" alt="${testimonial.name}" class="client-photo" />
        <div>
          <h4>${testimonial.name}</h4>
          <p>${testimonial.jobTitle}</p>
        </div>
      </div>
    `;

    testimonialTrack.appendChild(testimonialCard);
  });
}

// Call function to display testimonials
displayTestimonials(testimonialsData);

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
  const slideWidth =
    document.querySelector(".testimonial-card").clientWidth + 20;
  track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function moveToNextSlide() {
  const visibleSlides = getVisibleSlides();
  const totalTestimonials = testimonialsData.length;

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
    currentIndex = testimonialsData.length - visibleSlides;
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

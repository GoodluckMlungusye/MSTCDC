// Toggle Hamburger Menu on Mobile
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('show');
}

// Hero Section Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slider img');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
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
const itemList = document.getElementById('item-list');
let products = []; // Store products data for searching

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        products = data;
        displayProducts(products);
    })
    .catch(error => console.error('Error fetching the API:', error));

// Function to display products
function displayProducts(items) {
    itemList.innerHTML = ''; // Clear the item list
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        
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
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
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
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUpElements.forEach(element => countUp(element));
            observer.unobserve(entry.target); // Stop observing after count up
        }
    });
});

observer.observe(statsSection);

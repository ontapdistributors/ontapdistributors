document.addEventListener('DOMContentLoaded', function() {

    // ---- Single Page Application (SPA) Navigation Logic ---- //
    const navLinks = document.querySelectorAll('.nav-links a, .footer-links a, .btn[data-page]');
    const pages = document.querySelectorAll('.page');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    const handleNavClick = (e) => {
        e.preventDefault();
        const targetPage = e.currentTarget.getAttribute('data-page');

        if (!targetPage) return;

        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));

        // Show target page
        const newPage = document.getElementById(targetPage);
        if (newPage) {
            newPage.classList.add('active');
        }

        // Update active nav link styling
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('data-page') === targetPage) {
                link.classList.add('active');
            }
        });

        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }

        // Scroll to the top of the page
        window.scrollTo(0, 0);
    };

    navLinks.forEach(link => link.addEventListener('click', handleNavClick));

    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // ---- Age Verification ---- //
    const ageModal = document.getElementById("age-verification");
    const ageYes = document.getElementById("age-yes");
    const ageNo = document.getElementById("age-no");

    if (!localStorage.getItem("ageVerified")) {
        document.body.style.overflow = "hidden"; // prevent scrolling
        ageModal.style.display = "flex";
    }

    ageYes.addEventListener("click", () => {
        localStorage.setItem("ageVerified", "true");
        ageModal.style.opacity = "1";
        ageModal.style.transition = "opacity 0.5s ease";
        ageModal.style.opacity = "0";
        setTimeout(() => {
            ageModal.style.display = "none";
            document.body.style.overflow = "auto";
        }, 500);
    });

    ageNo.addEventListener("click", () => {
        window.location.href = "https://www.google.com";
    });

    // ---- Gallery & Lightbox Logic ---- //
    const galleryPage = document.getElementById('gallery');
    if (galleryPage) {
        // ---- Carousel Logic ---- //
        const slide = galleryPage.querySelector(".carousel-slide");
        const images = galleryPage.querySelectorAll(".carousel-slide img");
        const prevBtn = galleryPage.querySelector(".prev");
        const nextBtn = galleryPage.querySelector(".next");
        const dotsContainer = galleryPage.querySelector(".carousel-dots");

        if (slide && images.length > 0) {
            let index = 0;
            let interval;

            // Create dots dynamically
            images.forEach((_, i) => {
                const dot = document.createElement("span");
                if (i === 0) dot.classList.add("active");
                dotsContainer.appendChild(dot);
            });
            const dots = dotsContainer.querySelectorAll("span");

            const updateCarousel = () => {
                const size = slide.clientWidth;
                slide.style.transform = `translateX(${-index * size}px)`;
                dots.forEach(dot => dot.classList.remove("active"));
                if(dots[index]) dots[index].classList.add("active");
            };

            const nextSlide = () => { index = (index + 1) % images.length; updateCarousel(); };
            const prevSlide = () => { index = (index - 1 + images.length) % images.length; updateCarousel(); };

            const startAuto = () => { interval = setInterval(nextSlide, 5000); };
            const stopAuto = () => { clearInterval(interval); };

            nextBtn.addEventListener("click", () => { nextSlide(); stopAuto(); startAuto(); });
            prevBtn.addEventListener("click", () => { prevSlide(); stopAuto(); startAuto(); });
            dots.forEach((dot, i) => {
                dot.addEventListener("click", () => { index = i; updateCarousel(); stopAuto(); startAuto(); });
            });

            window.addEventListener("resize", updateCarousel);
            updateCarousel();
            startAuto();
        }

        // ---- Lightbox Logic ---- //
        const galleryImages = galleryPage.querySelectorAll(".gallery-grid img");
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const closeBtn = lightbox.querySelector(".lightbox-close");
        const prevLightbox = lightbox.querySelector(".lightbox-prev");
        const nextLightbox = lightbox.querySelector(".lightbox-next");

        if (galleryImages.length > 0 && lightbox) {
            let currentImgIndex = 0;
            const imageSources = Array.from(galleryImages).map(img => img.src);

            const openLightbox = (index) => {
                lightbox.style.display = "flex";
                lightboxImg.src = imageSources[index];
                currentImgIndex = index;
            };

            const closeLightbox = () => { lightbox.style.display = "none"; };

            const showPrev = () => {
                currentImgIndex = (currentImgIndex - 1 + imageSources.length) % imageSources.length;
                lightboxImg.src = imageSources[currentImgIndex];
            };

            const showNext = () => {
                currentImgIndex = (currentImgIndex + 1) % imageSources.length;
                lightboxImg.src = imageSources[currentImgIndex];
            };

            galleryImages.forEach((img, i) => img.addEventListener("click", () => openLightbox(i)));

            closeBtn.addEventListener("click", closeLightbox);
            prevLightbox.addEventListener("click", showPrev);
            nextLightbox.addEventListener("click", showNext);

            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            document.addEventListener("keydown", (e) => {
                if (lightbox.style.display === "flex") {
                    if (e.key === "ArrowLeft") showPrev();
                    if (e.key === "ArrowRight") showNext();
                    if (e.key === "Escape") closeLightbox();
                }
            });
        }
    }
});
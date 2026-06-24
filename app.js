document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Comportamiento Sticky Header (.is-scrolled)
       ========================================================================== */
    const navbarContainer = document.getElementById('navbarContainer');

    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbarContainer.classList.add('is-scrolled');
        } else {
            navbarContainer.classList.remove('is-scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });


    /* ==========================================================================
       2. Menú Desplegable "Categorías"
       ========================================================================== */
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const dropdownList = document.getElementById('dropdownList');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    const toggleDropdown = (event) => {
        event.stopPropagation();
        const isOpen = dropdownList.classList.toggle('show');
        menuToggleBtn.setAttribute('aria-expanded', isOpen);
    };

    const closeDropdown = () => {
        if (dropdownList.classList.contains('show')) {
            dropdownList.classList.remove('show');
            menuToggleBtn.setAttribute('aria-expanded', 'false');
        }
    };

    menuToggleBtn.addEventListener('click', toggleDropdown);
    document.addEventListener('click', closeDropdown);


    /* ==========================================================================
       3. Lógica del Carrusel (Manual y Automático)
       ========================================================================== */
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = Array.from(carouselTrack.children);
    const nextBtn = document.getElementById('carouselNext');
    const prevBtn = document.getElementById('carouselPrev');
    let currentIndex = 0;
    let carouselInterval;

    const getSlideWidth = () => {
        const slideStyle = window.getComputedStyle(slides[0]);
        const slideWidth = slides[0].getBoundingClientRect().width;
        const slideGap = parseFloat(slideStyle.marginRight) || 12;
        return slideWidth + slideGap;
    };

    const moveCarousel = (index) => {
        const maxIndex = slides.length - 3; 
        
        if (index > maxIndex) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = maxIndex;
        } else {
            currentIndex = index;
        }

        carouselTrack.style.opacity = '0.4';
        
        setTimeout(() => {
            const amountToMove = getSlideWidth() * currentIndex;
            carouselTrack.style.transform = `translateX(-${amountToMove}px)`;
            carouselTrack.style.opacity = '1';
        }, 150); 
    };

    const nextSlide = () => moveCarousel(currentIndex + 1);
    const prevSlide = () => moveCarousel(currentIndex - 1);

    const startAutoPlay = () => {
        carouselInterval = setInterval(nextSlide, 4000);
    };

    const resetAutoPlay = () => {
        clearInterval(carouselInterval);
        startAutoPlay();
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    startAutoPlay();

    window.addEventListener('resize', () => moveCarousel(currentIndex));


    /* ==========================================================================
       4. Navegación por Pestañas y Scroll Suave Adaptativo
       ========================================================================== */
    const tabLinks = document.querySelectorAll('.tab-link');

    const smoothScrollToSection = (targetId) => {
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        const headerOffset = navbarContainer.offsetHeight;
        const tabsOffset = document.getElementById('tabsNavigation').offsetHeight;
        
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - (headerOffset + tabsOffset - 15);

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            smoothScrollToSection(targetId);

            tabLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
            smoothScrollToSection(targetId);
            
            tabLinks.forEach(tab => {
                if (tab.getAttribute('data-target') === targetId) {
                    tabLinks.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                }
            });

            closeDropdown();
        });
    });


    /* ==========================================================================
       5. Logotipo con Retorno al Inicio
       ========================================================================== */
    const logoLink = document.getElementById('logoLink');

    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        tabLinks.forEach(item => item.classList.remove('active'));
    });


    /* ==========================================================================
       6. Controladores de la Ventana Modal
       ========================================================================== */
    const modal = document.getElementById('productModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    const modalImg = document.getElementById('modalProductImg');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDesc = document.getElementById('modalProductDesc');

    // Función unificada para abrir modal con datos dinámicos
    const openModal = (title, desc, price, imgSrc) => {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalPrice.textContent = price;
        modalImg.src = imgSrc;
        modalImg.alt = title;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; 
    };

    /* ==========================================================================
       7. Tarjeta de Producto (<article>) Completamente Cliqueable
       ========================================================================== */
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            // Lectura de los atributos personalizados (data-*) definidos en el <article>
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const price = card.getAttribute('data-price');
            const imgSrc = card.getAttribute('data-img');

            openModal(title, desc, price, imgSrc);
        });
    });

    // Control individual sobre los botones "Detalles" internos
    const addCartButtons = document.querySelectorAll('.btn-add-cart');

    addCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Detiene la propagación para que el clic no active el listener del <article>
            event.stopPropagation();
            
            // Acción simulada del botón
            console.log("Producto agregado al carrito con éxito.");
        });
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
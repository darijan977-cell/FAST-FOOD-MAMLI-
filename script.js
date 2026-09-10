document.addEventListener("DOMContentLoaded", () => {
    // --- 1. SLIDER TRACK LOGIC ---
    const track = document.getElementById("sliderTrack");
    const dotsContainer = document.getElementById("dotsNav");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    let currentIndex = 0;
    const totalUniqueSlides = 8; 
    const stepPercentage = 11.1111;

    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalUniqueSlides; i++) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            if (i === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    const dots = document.querySelectorAll(".dot");

    // Initial Load Animations
    gsap.from(".navbar-dark", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });
    
    gsap.from(".slider-track .slide:first-child .text-line", { 
        y: 60, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)", delay: 0.2 
    });
    
    gsap.from(".slider-track .slide:first-child .product-image", { 
        scale: 0.5, rotation: -15, opacity: 0, duration: 1, ease: "elastic.out(1, 0.6)", delay: 0.4 
    });
    
    gsap.from(".slider-track .slide:first-child .price-stamp", { 
        scale: 0, rotation: 90, opacity: 0, duration: 0.8, ease: "back.out(1.5)", delay: 0.6 
    });

    function updateDots(index) {
        if (dots.length > 0) {
            dots.forEach(d => d.classList.remove("active"));
            dots[index % totalUniqueSlides].classList.add("active");
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        const shiftAmount = -(currentIndex * stepPercentage);
        
        updateDots(currentIndex);

        if (track) {
            gsap.to(track, {
                x: `${shiftAmount}%`,
                duration: 0.4, 
                ease: "power2.out",
                overwrite: "auto", 
                onComplete: () => {
                    if (currentIndex === totalUniqueSlides) {
                        currentIndex = 0;
                        gsap.set(track, { x: "0%" });
                    }
                }
            });
        }

        gsap.fromTo([".background-text", ".product-image", ".price-stamp"], 
            { scale: 0.8, opacity: 0, rotation: -5 },
            { 
                scale: 1, 
                opacity: 1, 
                rotation: 0,
                duration: 0.45, 
                stagger: 0.05, 
                ease: "back.out(1.4)", 
                overwrite: "auto" 
            }
        );
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex >= totalUniqueSlides) {
                currentIndex = 0;
                if (track) gsap.set(track, { x: "0%" });
            }
            goToSlide(currentIndex + 1);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex === 0) {
                currentIndex = totalUniqueSlides;
                const terminalPosition = -(currentIndex * stepPercentage);
                if (track) gsap.set(track, { x: `${terminalPosition}%` });
                setTimeout(() => goToSlide(totalUniqueSlides - 1), 10);
            } else {
                goToSlide(currentIndex - 1);
            }
        });
    }

    setInterval(() => {
        if (track && !gsap.isTweening(track) && nextBtn) {
            nextBtn.click();
        }
    }, 8000); 

    // --- 2. BURGER ASSEMBLY GSAP ENGINE ---
    gsap.registerPlugin(ScrollTrigger);

    const burgerTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".assembly-section", 
            start: "top 40%",             
            end: "bottom 10%", 
            scrub: 2.5,        
        }
    });

    burgerTimeline
        .fromTo(".layer-top-bun",   { y: -600, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0)
        .fromTo(".layer-lettuce",   { y: -450, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.05)
        .fromTo(".layer-patty",     { y: -300, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.1)
        .fromTo(".layer-cheese",    { y: -150, opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.15)
        .fromTo(".layer-tomatoes",  { y: 150,  opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.2)
        .fromTo(".layer-sauce",     { y: 300,  opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.25)
        .fromTo(".layer-bottom-bun",{ y: 450,  opacity: 0 }, { y: 0, opacity: 1, ease: "power1.out" }, 0.3)
        .to({}, { duration: 1.5 }); 

    // --- 3. GSAP SCROLLTRIGGER FLY-INS ---
    gsap.utils.toArray(".anim-left").forEach(item => {
        gsap.fromTo(item, 
            { x: -100, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.85, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 88%", 
                    toggleActions: "play none none none"
                }
            }
        );
    });

    gsap.utils.toArray(".anim-right").forEach(item => {
        gsap.fromTo(item, 
            { x: 100, opacity: 0 },
            { 
                x: 0, 
                opacity: 1, 
                duration: 0.85, 
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 88%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // --- 4. CATEGORY TABS (CARDS) LOGIC ---
    const catCards = document.querySelectorAll('.cat-card');
    const catSections = document.querySelectorAll('.menu-category-section');

    catCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active state from all cards and sections
            catCards.forEach(c => c.classList.remove('active'));
            catSections.forEach(s => s.classList.remove('active'));

            // Add active state to clicked card
            card.classList.add('active');

            // Show target section
            const targetId = card.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                ScrollTrigger.refresh(); // Recalculate scroll triggers for content setup
                
                // Add bounce animation to incoming category items
                gsap.fromTo(targetSection.querySelectorAll('.menu-item'),
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
                );
            }
        });
    });

    // --- 5. DYNAMIC LANGUAGE SWITCHING SYSTEM ---
    const langButtons = document.querySelectorAll(".lang-toggle-btn");

    langButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            langButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const targetLang = btn.getAttribute("data-target-lang");

            document.querySelectorAll("[data-en], [data-mk]").forEach(element => {
                const textToAssign = element.getAttribute(`data-${targetLang}`);
                if (textToAssign) {
                    element.innerHTML = textToAssign;
                }
            });
        });
    });

    // --- 6. DYNAMIC SCROLL SPY TRACKER & SMOOTH LINK CLICK HANDLER ---
    const sections = [
        { id: "home", linkId: "homeLink" },
        { id: "menu", linkId: "menuLink" },
        { id: "contact", linkId: "contactLink" }
    ];

    // Smooth Navigation Jump Scrolling Handler
    sections.forEach(({ id, linkId }) => {
        const linkElement = document.getElementById(linkId);
        
        if (linkElement) {
            linkElement.addEventListener("click", (e) => {
                e.preventDefault();
                
                if (id === "home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    const targetSection = document.getElementById(id);
                    if (targetSection) {
                        const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - 90;
                        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                }
            });
        }
    });

    // Active Scrollspy Highlight Trigger Loop
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px", // Trigger active state when section takes up the primary view window space
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active styling from all links
                document.querySelectorAll(".nav-center-capsule .nav-link").forEach(link => {
                    link.classList.remove("active");
                });

                // Set current item active matching the screen zone
                const matchingSection = sections.find(s => s.id === entry.target.id);
                if (matchingSection) {
                    const activeLink = document.getElementById(matchingSection.linkId);
                    if (activeLink) activeLink.classList.add("active");
                }
            }
        });
    }, observerOptions);

    // Watch your structural sections on the page layout
    const menuSec = document.getElementById("menu");
    const contactSec = document.getElementById("contact");
    
    if (menuSec) observer.observe(menuSec);
    if (contactSec) observer.observe(contactSec);

    // Fallback tracker for Home when scrolling all the way back to top page boundaries
    window.addEventListener("scroll", () => {
        if (window.scrollY < 200) {
            document.querySelectorAll(".nav-center-capsule .nav-link").forEach(link => link.classList.remove("active"));
            const homeBtn = document.getElementById("homeLink");
            if (homeBtn) homeBtn.classList.add("active");
        }
    });

    // --- 7. SCOOTER TRACK ANIMATION ---
    const trackSection = document.querySelector('.scooter-track-section');

    if (trackSection) {
        gsap.to(".scooter-animation-container", {
            x: () => trackSection.offsetWidth + 150, 
            duration: 10,                            
            ease: "none",
            repeat: -1,
            startAt: { x: -150 },                    
            onUpdate: function() {
                const currentX = gsap.getProperty(".scooter-animation-container", "x");
                const sectionWidth = trackSection.offsetWidth;
                
                // Keep line width synced with scooter
                const progressWidth = Math.min(sectionWidth, Math.max(0, currentX));
                gsap.set(".scooter-progress-fill", { width: progressWidth });
            }
        });
    }

    // Engine/Bumpy Road Vibration
    gsap.to(".scooter-guy", {
        y: -3,
        duration: 0.12,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
   // --- 8. CART & CHECKOUT LOGIC ---
    let cart = [];
    const overlay = document.getElementById("modalOverlay");
    const itemModal = document.getElementById("itemModal");
    const cartModal = document.getElementById("cartModal");
    const checkoutModal = document.getElementById("checkoutModal");
    const cartBadge = document.getElementById("mainCartBadge");
    
    let currentSelectedItem = null;
    let currentBasePrice = 0; // Tracks price before extras are added

    function openModal(modal) {
        overlay.classList.add("active");
        modal.classList.add("active");
    }

    function closeAllModals() {
        overlay.classList.remove("active");
        document.querySelectorAll(".modal-box").forEach(m => m.classList.remove("active"));
    }

    overlay.addEventListener("click", closeAllModals);
    document.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click", closeAllModals));

    // Handle Checkbox Price Updates Live
    document.querySelectorAll(".item-addon").forEach(cb => {
        cb.addEventListener("change", () => {
            let extraPrice = 0;
            document.querySelectorAll(".item-addon:checked").forEach(checkedCb => {
                extraPrice += parseInt(checkedCb.getAttribute("data-addon-price"));
            });
            const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";
            document.getElementById("modalItemPrice").innerText = `${currentBasePrice + extraPrice} ${isMk ? 'ден.' : 'den.'}`;
        });
    });

   // Listeners for Menu Items
    document.querySelectorAll(".menu-item").forEach(item => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            const img = item.querySelector(".plate-img").src;
            const titleMk = item.querySelector("h3").getAttribute("data-mk");
            const titleEn = item.querySelector("h3").getAttribute("data-en");
            
            const descEl = item.querySelector(".ingredients");
            const descMk = descEl ? descEl.getAttribute("data-mk") : "";
            const descEn = descEl ? descEl.getAttribute("data-en") : "";
            
            const priceText = item.querySelector(".item-price").innerText;
            currentBasePrice = parseInt(priceText.match(/\d+/)[0]);

            currentSelectedItem = { titleMk, titleEn, descMk, descEn, basePrice: currentBasePrice, img };

            const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";
            
            // --- DYNAMIC ADD-ON LOGIC START ---
            const catId = item.closest('.menu-category-section').id;
            const optionsWrap = document.getElementById("modalOptionsWrap");
            
            // Target the specific option labels based on their data attributes
            const optFries = document.querySelector('input[data-addon-en="Extra Fries"]').closest('.custom-checkbox');
            const optSalad = document.querySelector('input[data-addon-en="Salad"]').closest('.custom-checkbox');
            const optKetchup = document.querySelector('input[data-addon-en="Ketchup"]').closest('.custom-checkbox');
            const optMayo = document.querySelector('input[data-addon-en="Mayo"]').closest('.custom-checkbox');
            
            // 1. Reset all options to visible by default
            optionsWrap.style.display = "block";
            optFries.style.display = "flex";
            optSalad.style.display = "flex";
            optKetchup.style.display = "flex";
            optMayo.style.display = "flex";

            // 2. Hide specific options based on the item's category
            if (catId === 'cat-drinks') {
                // Drinks get no options wrapper at all
                optionsWrap.style.display = "none";
            } else if (catId === 'cat-burgers') {
                // Burgers already come with fries
                optFries.style.display = "none";
            } else if (catId === 'cat-fries') {
                // Fries don't need extra fries or salad
                optFries.style.display = "none";
                optSalad.style.display = "none";
            }
            // --- DYNAMIC ADD-ON LOGIC END ---

            // Uncheck all boxes when opening a new item
            document.querySelectorAll(".item-addon").forEach(cb => cb.checked = false);

            document.getElementById("modalItemImg").src = img;
            document.getElementById("modalItemTitle").innerText = isMk ? titleMk : titleEn;
            document.getElementById("modalItemDesc").innerText = isMk ? descMk : descEn;
            document.getElementById("modalItemPrice").innerText = `${currentBasePrice} ${isMk ? 'ден.' : 'den.'}`;
            document.getElementById("qtyInput").value = 1;

            openModal(itemModal);
        });
    });

    document.getElementById("qtyBtnMinus").addEventListener("click", () => {
        let val = parseInt(document.getElementById("qtyInput").value);
        if (val > 1) document.getElementById("qtyInput").value = val - 1;
    });
    
    document.getElementById("qtyBtnPlus").addEventListener("click", () => {
        let val = parseInt(document.getElementById("qtyInput").value);
        if (val < 20) document.getElementById("qtyInput").value = val + 1;
    });

    // Add to Cart Action
    document.getElementById("btnAddToCart").addEventListener("click", () => {
        const qty = parseInt(document.getElementById("qtyInput").value);
        if(currentSelectedItem) {
            
            // Gather selected options
            let selectedOptions = [];
            let totalExtrasPrice = 0;
            document.querySelectorAll(".item-addon:checked").forEach(cb => {
                const p = parseInt(cb.getAttribute("data-addon-price"));
                selectedOptions.push({
                    nameMk: cb.getAttribute("data-addon-mk"),
                    nameEn: cb.getAttribute("data-addon-en"),
                    price: p
                });
                totalExtrasPrice += p;
            });

            const finalUnitPrice = currentBasePrice + totalExtrasPrice;
            
            // Create a unique key so items with different options don't combine
            const optionsKey = selectedOptions.map(o => o.nameEn).sort().join('-');
            const uniqueCartId = currentSelectedItem.titleEn + '|' + optionsKey;

            const cartItem = {
                ...currentSelectedItem,
                price: finalUnitPrice,
                options: selectedOptions,
                cartId: uniqueCartId,
                qty: qty
            };

            const existingItemIndex = cart.findIndex(c => c.cartId === uniqueCartId);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty += qty;
            } else {
                cart.push(cartItem);
            }
            
            updateCartBadge();
            closeAllModals();
            gsap.fromTo(".cart-icon", { scale: 1.5 }, { scale: 1, duration: 0.5, ease: "bounce.out" });
        }
    });

    function updateCartBadge() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        if (totalItems > 0) {
            cartBadge.style.display = "flex";
            cartBadge.innerText = totalItems;
        } else {
            cartBadge.style.display = "none";
        }
    }

    document.querySelector(".cart-wrapper").addEventListener("click", () => {
        renderCart();
        openModal(cartModal);
    });

    function renderCart() {
        const list = document.getElementById("cartItemsList");
        list.innerHTML = "";
        let total = 0;
        const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";

        if (cart.length === 0) {
            list.innerHTML = `<p style="text-align:center; font-weight: 800; color:#b0a8a5; padding: 20px;">${isMk ? 'Кошничката е празна.' : 'Your cart is empty.'}</p>`;
            document.getElementById("btnCheckout").style.display = "none";
        } else {
            document.getElementById("btnCheckout").style.display = "block";
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                const title = isMk ? item.titleMk : item.titleEn;
                const currency = isMk ? 'ден.' : 'den.';
                
                // Format the extras text underneath the title
                const extrasText = item.options.length > 0 
                    ? `<div style="font-size: 0.8rem; color: #E05320; margin-top: 4px;">+ ${item.options.map(o => isMk ? o.nameMk : o.nameEn).join(', ')}</div>` 
                    : '';
                
                const el = document.createElement("div");
                el.className = "cart-item";
                el.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${title} (x${item.qty})</h4>
                        ${extrasText}
                        <p style="margin-top: 4px;">${item.price} ${currency} / ${isMk ? 'парче' : 'ea'}</p>
                    </div>
                    <div class="cart-item-price">${item.price * item.qty} ${currency}</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
                `;
                list.appendChild(el);
            });
        }
        document.getElementById("cartTotalValue").innerText = `${total} ${isMk ? 'ден.' : 'den.'}`;
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        updateCartBadge();
        renderCart();
    };

   // --- 9. ORDER HISTORY ARRAYS ---
    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

    document.getElementById("btnCheckout").addEventListener("click", () => {
        if(cart.length === 0) return;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '#MML-';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        document.getElementById("quickCodeDisplay").innerText = code;
        
        // 1. Capture current local system timestamp
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString();
        
        // 2. Map and capture detailed array objects of all items inside the receipt receipt list
        const orderItems = cart.map(item => ({
            titleMk: item.titleMk,
            titleEn: item.titleEn,
            qty: item.qty,
            price: item.price,
            options: item.options.map(o => ({ nameMk: o.nameMk, nameEn: o.nameEn }))
        }));
        
        // 3. Compute final bill sum total 
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        // Save order receipt metadata package into persistent browser local storage state
        orderHistory.push({ 
            code: code, 
            date: timeNow, 
            items: orderItems, 
            total: totalPrice 
        });
        localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

        cart = [];
        updateCartBadge();
        closeAllModals();
        setTimeout(() => openModal(checkoutModal), 300);
    });

    document.getElementById("btnFinishOrder").addEventListener("click", closeAllModals);

    // --- 10. ORDER HISTORY MODAL TRIGGER ---
    const historyBtn = document.getElementById("naracajSegaBtn");
    const historyModal = document.getElementById("historyModal");

    if (historyBtn && historyModal) {
        historyBtn.setAttribute("data-en", "Order History");
        historyBtn.setAttribute("data-mk", "Историја на нарачки");
        
        historyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            renderHistory();
            openModal(historyModal);
        });
    }

    function renderHistory() {
        const list = document.getElementById("historyCodesList");
        if (!list) return;
        list.innerHTML = "";
        
        const activeLangBtn = document.querySelector(".lang-toggle-btn.active");
        const isMk = activeLangBtn ? activeLangBtn.getAttribute("data-target-lang") === "mk" : true;

        if (orderHistory.length === 0) {
            list.innerHTML = `<p style="text-align:center; font-weight: 800; color:#b0a8a5; padding: 20px;">${isMk ? 'Немате претходни нарачки.' : 'No previous orders found.'}</p>`;
        } else {
            // Render codes from newest to oldest order
            [...orderHistory].reverse().forEach(order => {
                const el = document.createElement("div");
                el.className = "history-container";
                
                const currency = isMk ? 'ден.' : 'den.';

                // Build out inline html listing string blocks for order detail variants
                let itemsHtml = '';
                if (order.items && order.items.length > 0) {
                    order.items.forEach(item => {
                        const itemTitle = isMk ? item.titleMk : item.titleEn;
                        const extrasText = item.options && item.options.length > 0 
                            ? `<div class="history-item-extras">+ ${item.options.map(o => isMk ? o.nameMk : o.nameEn).join(', ')}</div>` 
                            : '';
                        itemsHtml += `
                            <div class="history-detail-row">
                                <div class="detail-left">
                                    <span class="detail-name">${itemTitle} <small>x${item.qty}</small></span>
                                    ${extrasText}
                                </div>
                                <span class="detail-price">${item.price * item.qty} ${currency}</span>
                            </div>
                        `;
                    });
                } else {
                    itemsHtml = `<div style="text-align:center; color:#999; font-size:0.85rem; padding:5px 0;">${isMk ? 'Нема детални информации.' : 'No receipt details available.'}</div>`;
                }

                // Append Accordion structural items wrapper configuration blueprints
                el.innerHTML = `
                    <div class="history-item-header">
                        <div class="history-meta">
                            <span class="history-code">${order.code}</span>
                            <span class="history-date">${order.date}</span>
                        </div>
                        <div class="history-total-side">
                            <span class="history-total-amt">${order.total || 0} ${currency}</span>
                            <span class="history-arrow">▼</span>
                        </div>
                    </div>
                    <div class="history-item-details">
                        <div class="history-details-inner">
                            ${itemsHtml}
                        </div>
                    </div>
                `;

                // Add falling slide click event listener element loop
                const header = el.querySelector(".history-item-header");
                header.addEventListener("click", () => {
                    el.classList.toggle("open");
                });

                list.appendChild(el);
            });
        }
    }
    // --- 11. TICKET SCANNER LOGIC ---
    const openTicketScanner = document.getElementById("openTicketScanner");
    const ticketModal = document.getElementById("ticketModal");
    const btnCheckTicket = document.getElementById("btnCheckTicket");
    const ticketInput = document.getElementById("ticketInput");
    const ticketResultBox = document.getElementById("ticketResultBox");

    // 1. Stop jumping to top and open the modal instead
    if (openTicketScanner && ticketModal) {
        openTicketScanner.addEventListener("click", (e) => {
            e.preventDefault(); 
            ticketInput.value = ""; // Clear old typing
            ticketResultBox.style.display = "none"; // Hide old results
            openModal(ticketModal);
        });
    }

    // 2. The actual search logic when they click "Check Code" inside the modal
    if (btnCheckTicket) {
        btnCheckTicket.addEventListener("click", (e) => {
            e.preventDefault();

            if (!ticketInput || !ticketResultBox) return;

            let query = ticketInput.value.trim().toUpperCase();
            if (!query) return;

            // Auto-fix if they forgot the #MML- part
            if (!query.startsWith("#MML-")) {
                if (query.startsWith("MML-")) query = "#" + query;
                else query = "#MML-" + query;
            }

            ticketResultBox.style.display = "block";
            ticketResultBox.innerHTML = "<p style='text-align:center;'>Се пребарува...</p>";

            const localHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
            const foundOrder = localHistory.find(order => order.code.toUpperCase() === query);

            if (!foundOrder) {
                ticketResultBox.innerHTML = `
                    <div style="color: #d32f2f; text-align: center; font-weight: bold;">
                        ❌ Кодот не е пронајден! <br> <small>Проверете дали е точно внесен.</small>
                    </div>`;
                return;
            }

            // Build out the receipt visuals if found
            let itemsListHtml = "";
            foundOrder.items.forEach(item => {
                const extras = item.options.length > 0 ? `<div style="color:#E05320; font-size:0.8rem; font-weight:800;">+ ${item.options.map(o => o.nameMk).join(', ')}</div>` : '';
                itemsListHtml += `
                    <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #ccc; font-size:0.95rem;">
                        <div>
                            <strong style="color: var(--brand-brown);">${item.titleMk}</strong> 
                            <span style="color:#E05320; font-weight:900; margin-left: 5px;">x${item.qty}</span>
                            ${extras}
                        </div>
                        <span style="font-weight:900; color:var(--brand-brown);">${item.price * item.qty} ден.</span>
                    </div>
                `;
            });

            ticketResultBox.innerHTML = `
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--brand-brown); padding-bottom:10px; margin-bottom:10px;">
                        <div>
                            <span style="font-family:monospace; font-size:1.4rem; font-weight:900; color:var(--brand-orange);">${foundOrder.code}</span>
                            <div style="font-size:0.8rem; color:#888; font-weight:700;">${foundOrder.date}</div>
                        </div>
                        <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 6px; font-weight: 800; font-size: 0.8rem;">ВАЛИДЕН</span>
                    </div>
                    <div style="margin-bottom: 15px;">${itemsListHtml}</div>
                    <div style="background: rgba(74, 26, 4, 0.05); padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 900; color: var(--brand-brown); font-size: 1.1rem;">ВКУПНО:</span>
                        <span style="font-weight: 900; color: var(--brand-orange); font-size: 1.3rem;">${foundOrder.total} ден.</span>
                    </div>
                </div>
            `;
        });
    }
    // --- MOBILE MENU DROPDOWN LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const rightActions = document.querySelector('.nav-right-actions');
    const navMenu = document.querySelector('.nav-center-capsule');
    
    // Create the mobile hamburger button dynamically
    const burgerIcon = document.createElement('button');
    burgerIcon.className = 'mobile-burger-btn';
    burgerIcon.innerHTML = '☰';
    
    // Insert the button into the header (before the language toggle)
    if (rightActions) {
        rightActions.insertBefore(burgerIcon, rightActions.firstChild);
    }

    // Toggle the dropdown menu when the hamburger icon is clicked
    burgerIcon.addEventListener('click', () => {
        navMenu.classList.toggle('mobile-active');
    });

    // Close the dropdown menu automatically when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-active');
        });
    });
});
});

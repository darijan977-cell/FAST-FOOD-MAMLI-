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
        if(modal) {
            overlay.classList.add("active");
            modal.classList.add("active");
        }
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
            currentSelectedItem = {
                titleMk: item.querySelector("h3").getAttribute("data-mk") || item.querySelector("h3").innerText,
                titleEn: item.querySelector("h3").getAttribute("data-en") || item.querySelector("h3").innerText,
                priceText: item.querySelector(".item-price").innerText,
                imgSrc: item.querySelector(".plate-img").src,
                descMk: item.querySelector(".ingredients").getAttribute("data-mk") || item.querySelector(".ingredients").innerText,
                descEn: item.querySelector(".ingredients").getAttribute("data-en") || item.querySelector(".ingredients").innerText
            };
            
            // Extract base price - grab the first number sequence
            const match = currentSelectedItem.priceText.match(/\d+/);
            currentBasePrice = match ? parseInt(match[0]) : 0;

            // --- ADDONS FILTERING LOGIC ---
            const addonsAttr = item.getAttribute("data-addons");
            const addonsList = addonsAttr ? addonsAttr.split(",") : ["none"];
            const optionsWrap = document.getElementById("modalOptionsWrap");
            
            if (addonsList.includes("none")) {
                // Hide addons completely for items like Drinks
                optionsWrap.style.display = "none";
            } else {
                // Show only the specific addons assigned to this item
                optionsWrap.style.display = ""; 
                document.querySelectorAll(".custom-checkbox").forEach(label => {
                    const addonId = label.getAttribute("data-addon-id");
                    if (addonsList.includes(addonId)) {
                        label.style.display = ""; 
                    } else {
                        label.style.display = "none";
                    }
                });
            }
            // ------------------------------

            document.getElementById("modalItemImg").src = currentSelectedItem.imgSrc;
            
            const titleEl = document.getElementById("modalItemTitle");
            titleEl.innerText = currentSelectedItem.titleMk;
            titleEl.setAttribute("data-mk", currentSelectedItem.titleMk);
            titleEl.setAttribute("data-en", currentSelectedItem.titleEn);
            
            const descEl = document.getElementById("modalItemDesc");
            descEl.innerText = currentSelectedItem.descMk;
            descEl.setAttribute("data-mk", currentSelectedItem.descMk);
            descEl.setAttribute("data-en", currentSelectedItem.descEn);

            const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";
            document.getElementById("modalItemPrice").innerText = `${currentBasePrice} ${isMk ? 'ден.' : 'den.'}`;
            
            document.getElementById("qtyInput").value = 1;
            document.querySelectorAll(".item-addon").forEach(cb => cb.checked = false);

            openModal(itemModal);
        });
    });

    // Cart Quantity Controls
    document.getElementById("qtyBtnMinus").addEventListener("click", () => {
        let q = parseInt(document.getElementById("qtyInput").value);
        if (q > 1) document.getElementById("qtyInput").value = q - 1;
    });
    
    document.getElementById("qtyBtnPlus").addEventListener("click", () => {
        let q = parseInt(document.getElementById("qtyInput").value);
        if (q < 20) document.getElementById("qtyInput").value = q + 1;
    });

    // Add to Cart Action
    document.getElementById("btnAddToCart").addEventListener("click", () => {
        let qty = parseInt(document.getElementById("qtyInput").value);
        let extraPrice = 0;
        let extrasMk = [];
        let extrasEn = [];
        
        document.querySelectorAll(".item-addon:checked").forEach(cb => {
            extraPrice += parseInt(cb.getAttribute("data-addon-price"));
            extrasMk.push(cb.getAttribute("data-addon-mk"));
            extrasEn.push(cb.getAttribute("data-addon-en"));
        });

        let unitPrice = currentBasePrice + extraPrice;
        let finalPrice = unitPrice * qty;
        
        cart.push({
            titleMk: currentSelectedItem.titleMk,
            titleEn: currentSelectedItem.titleEn,
            qty: qty,
            unitPrice: unitPrice,
            price: finalPrice,
            extrasMk: extrasMk.join(", "),
            extrasEn: extrasEn.join(", ")
        });
        
        updateCartUI();
        closeAllModals();
    });

    function updateCartUI() {
        const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";
        
        if (cart.length > 0) {
            cartBadge.style.display = "flex";
            cartBadge.innerText = cart.length;
        } else {
            cartBadge.style.display = "none";
        }
        
        const list = document.getElementById("cartItemsList");
        list.innerHTML = "";
        let total = 0;
        
        cart.forEach((cItem, index) => {
            total += cItem.price;
            
            let li = document.createElement("div");
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.marginBottom = "15px";
            li.style.borderBottom = "1px solid #eee";
            li.style.paddingBottom = "10px";
            
            let title = isMk ? cItem.titleMk : cItem.titleEn;
            let ext = isMk ? cItem.extrasMk : cItem.extrasEn;
            let extHtml = ext ? `<br><small style="color:gray;">+ ${ext}</small>` : "";
            
            li.innerHTML = `
                <div style="flex: 1;">
                    <strong style="color: var(--brand-brown);">${cItem.qty}x ${title}</strong>${extHtml}
                </div>
                <div style="font-weight: 900; color: var(--brand-orange);">
                    ${cItem.price} ${isMk ? 'ден.' : 'den.'}
                    <button class="remove-item" data-index="${index}" style="margin-left:15px; color:red; border:none; background:none; font-size: 1.2rem; cursor:pointer;">&times;</button>
                </div>
            `;
            list.appendChild(li);
        });
        
        document.getElementById("cartTotalValue").innerText = `${total} ${isMk ? 'ден.' : 'den.'}`;
        
        document.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", (e) => {
                let idx = e.target.getAttribute("data-index");
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    document.querySelector(".cart-wrapper").addEventListener("click", () => {
        updateCartUI();
        openModal(cartModal);
    });

    // --- 9. CHECKOUT & ORDER HISTORY (WITHOUT CODE GENERATION) ---
    let orderHistory = JSON.parse(localStorage.getItem("mamliOrderHistory")) || [];

    document.getElementById("btnCheckout").addEventListener("click", () => {
        if (cart.length === 0) return;
        
        let total = 0;
        cart.forEach(i => total += i.price);
        
        const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";
        
        // Save to History (Items only, no code logic)
        let newOrder = {
            date: new Date().toLocaleString(),
            items: cart,
            total: total
        };
        
        orderHistory.push(newOrder);
        localStorage.setItem("mamliOrderHistory", JSON.stringify(orderHistory));
        
        // Update Checkout Modal to strictly show Total Price instead of generating a code
        document.getElementById("quickCodeDisplay").innerHTML = `<span style="font-size: 0.8rem; color: #555; display: block; margin-bottom: 5px;">${isMk ? 'ВКУПНО ЗА НАПЛАТА:' : 'TOTAL DUE:'}</span>${total} ${isMk ? 'ден.' : 'den.'}`;
        
        cart = []; // Empty cart
        updateCartUI();
        closeAllModals();
        openModal(checkoutModal);
    });

    document.getElementById("btnFinishOrder").addEventListener("click", closeAllModals);

    // Order History Display Logic
    const naracajSegaBtn = document.getElementById("naracajSegaBtn");
    if (naracajSegaBtn) {
        naracajSegaBtn.addEventListener("click", () => {
            const historyList = document.getElementById("historyCodesList");
            historyList.innerHTML = "";
            const isMk = document.querySelector(".lang-toggle-btn.active").getAttribute("data-target-lang") === "mk";
            
            if (orderHistory.length === 0) {
                historyList.innerHTML = `<p style="text-align: center; padding: 20px; color: #888;">${isMk ? 'Немате претходни нарачки.' : 'No previous orders.'}</p>`;
            } else {
                // Reverse array to show newest orders first
                [...orderHistory].reverse().forEach(order => {
                    let div = document.createElement("div");
                    div.style.background = "#fff";
                    div.style.padding = "15px";
                    div.style.marginBottom = "10px";
                    div.style.borderRadius = "8px";
                    div.style.border = "2px solid #eee";
                    
                    let itemsHtml = order.items.map(i => {
                        let title = isMk ? i.titleMk : i.titleEn;
                        let ext = isMk ? i.extrasMk : i.extrasEn;
                        let extText = ext ? ` (+${ext})` : "";
                        return `<b>${i.qty}x</b> ${title}${extText}`;
                    }).join("<br>");
                    
                    div.innerHTML = `
                        <div style="font-size:0.8rem; color:gray; border-bottom: 1px dashed #ccc; padding-bottom: 5px; margin-bottom: 10px;">${order.date}</div>
                        <div style="font-size:0.95rem; margin-bottom:10px; line-height: 1.4;">${itemsHtml}</div>
                        <div style="color:var(--brand-orange); font-weight:900; text-align: right; font-size: 1.1rem;">${isMk ? 'Вкупно' : 'Total'}: ${order.total} ${isMk ? 'ден.' : 'den.'}</div>
                    `;
                    historyList.appendChild(div);
                    
                });
            }
            
            openModal(document.getElementById("historyModal"));
        });
    }
// Footer History Button Logic (Triggers same popup modal)
const footerHistoryBtn = document.getElementById("footerHistoryBtn") || document.querySelector(".footer-history-btn");

if (footerHistoryBtn) {
    footerHistoryBtn.addEventListener("click", (e) => {
        e.preventDefault(); 
        const mainHistoryBtn = document.getElementById("naracajSegaBtn");
        if (mainHistoryBtn) {
            mainHistoryBtn.click(); // Triggers the exact same modal logic as PC
        }
    });
}
}); // End of DOMContentLoaded

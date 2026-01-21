document.addEventListener("DOMContentLoaded", function () {

    /* AOS Init */
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            once: true,
            easing: "ease-out-cubic"
        });
    }

    /* Animated Counters */
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        const target = +counter.dataset.target;
        let count = 0;
        const increment = Math.ceil(target / 80);

        const updateCounter = () => {
            count += increment;
            if (count < target) {
                counter.textContent = count;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + "+";
            }
        };

        updateCounter();
    });

});

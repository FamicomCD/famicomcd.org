        let lastScrollTop = 0;

        window.addEventListener('scroll', function() {
            const topElement = document.getElementById('nav');
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollTop === 0) {
                topElement.style.top = '0';
            } else if (currentScrollTop > lastScrollTop) {
                topElement.style.top = '-100px';
            } else {
                topElement.style.top = '0';
            }

            lastScrollTop = currentScrollTop;
        });
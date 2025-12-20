/*
 * Copyright (c) 2024 NusaTheme
 * Author: NusaTheme
 * This file is made for CURRENT TEMPLATE
*/
function MoraTheme() {
  "use strict";

  window.addEventListener('load', function () {
    cleanWPClasses();
    platformDetection();
    initLenis();
    initSplittingElement();
    preloader();
    stickyHeader();
    pageCursor();
    initPageNav();
    initBackToTop();
    ninjaForm();
    initDotCanvas();
  });
  window.addEventListener('resize', function () {
    platformDetection();
  })
  window.addEventListener('scroll', function () {
    stickyHeader();
  })

  function platformDetection() {
    const html = document.querySelector('html');
    var mobileTest;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || window.innerWidth < 992) {
      mobileTest = true;
      html.classList.add("mobile");
    }
    else {
      mobileTest = false;
      html.classList.remove("mobile");
    }
  }
  function blogCardSetAnimationDelay() {
    const wpTemplate = document.querySelectorAll('.wp-block-post-template');
    wpTemplate.forEach((container, containerIndex) => {
      const blogCards = container.querySelectorAll('.blog-card');
      if (blogCards.length > 0) {
        if (blogCards[0].dataset.aosDelay) {
          blogCards.forEach((card, i) => {
            card.dataset.aosDelay = i * parseInt(card.dataset.aosDelay);
            card.dataset.aosAnchor = `.wp-container-core-post-template-is-layout-${containerIndex + 1}`;
          })
        }

      }
    })
  }
  function initAos() {
    blogCardSetAnimationDelay();
    AOS.init({
      once: true,
      duration: 1000
    });

  }

  function initSplittingElement() {
    const elements = document.querySelectorAll('.splitting-char');
    elements.forEach(el => {
      if (el.dataset.aosDuration) {
        el.style.setProperty('--char-transition-duration', `${el.dataset.aosDuration}ms`);
      }
      if (el.dataset.aosDelay) {
        el.style.setProperty('--char-transition-delay', `${el.dataset.aosDelay}ms`);
      }
    });
    Splitting();
  }

  function initDotCanvas() {
    const dotsCanvas = document.querySelectorAll(".dots-canvas");
    dotsCanvas.forEach(canvas => {
      dotCanvasAnimation(canvas);
    })
  }

  function dotCanvasAnimation(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const dots = [];
    const speed = 0.5;
    const maxFPS = 30;
    const maxNumDots = 13;
    let lastFrameTime = 0;

    for (let i = 0; i < maxNumDots; i++) {
      const angle = Math.random() * Math.PI * 2;
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        opacity: Math.random(),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }

    function drawDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${dot.opacity})`;
        ctx.fill();
      });
    }

    function animateDots(timestamp) {
      if (timestamp - lastFrameTime < 1000 / maxFPS) {
        requestAnimationFrame(animateDots);
        return;
      }
      lastFrameTime = timestamp;

      dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x <= 0 || dot.x >= canvas.width) dot.vx *= -1;
        if (dot.y <= 0 || dot.y >= canvas.height) dot.vy *= -1;
      });

      drawDots();
      requestAnimationFrame(animateDots);
    }

    animateDots(0);

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  function cleanWPClasses() {
    const wpLayoutClasses = [
      'is-layout-constrained',
      'is-layout-flow',
      'is-layout-flex',
      'is-layout-grid'
    ];

    const containers = document.querySelectorAll('.container, .row, section, .th-container, .swiper-slide, .swiper-wrapper .swiper');
    containers.forEach(c => {
      c.classList.remove(...wpLayoutClasses);
    });
  }

  function initTyped() {
    const texts = document.querySelectorAll('.typed-strings span');
    if (texts.length > 0) {
      var typed = new Typed('.typed', {
        strings: Array.from(texts).map(text => text.innerHTML),
        typeSpeed: 100,
        backDelay: 1000,
        loop: true,
        contentType: 'html', // or text
        // defaults to false for infinite loop
        loopCount: false,
      });
    }
  }

  function debounce(func, timeout = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => func.apply(this, args), timeout);
    };
  }

  function initPageNav() {
    const onePageNavInstance = Object.create(SiteMenuOnePageLink);
    onePageNavInstance.render();
  }

  var SiteMenuOnePageLink = {
    config: {
      sections: [],
      currentClassName: 'active',
      linkSelector: 'a[href*="#"]',
      scrollOffset: 80
    },

    render: function () {
      const links = document.querySelectorAll(this.config.linkSelector);
      const self = this;
      links.forEach(link => {
        if (self.isValidSelector(link.getAttribute('href'))) {
          self.config.sections.push(document.querySelector(link.getAttribute('href')));
          link.addEventListener('click', function (e) {
            e.preventDefault();
            const destinationId = e.currentTarget.getAttribute('href');
            if (destinationId) {
              const destination = document.querySelector(destinationId);
              if (destination) {
                if (lenis) {
                  lenis.scrollTo(destination.offsetTop);
                } else {
                  window.scrollTo({
                    top: destination.offsetTop,
                    left: 0,
                    behavior: "smooth",
                  });
                }
              }
            }
          });
        }
      });
      this.getCurrentSection();
      window.addEventListener('scroll', debounce(this.handleWindowOnScrolled.bind(this), 300));
    },

    isValidSelector: function (selector) {
      try {
        document.querySelector(selector)
      }
      catch {
        return false
      }
      return true
    },

    handleWindowOnScrolled: function () {
      this.getCurrentSection();
    },

    getCurrentSection: function () {
      const winH = window.innerHeight;
      this.config.sections.forEach(section => {
        if (section) {
          const sectionY = section.getBoundingClientRect().y;
          const sectionH = section.getBoundingClientRect().height;
          if (sectionY < winH && Math.abs(sectionY) < sectionH) {
            if (sectionY < this.config.scrollOffset + 1) {
              this.setActiveMenuLink(section.getAttribute('id'));
            }
          }
        }
      });
    },

    setActiveMenuLink: function (sectionId) {
      const currentActiveLink = document.querySelector(`.site-menu a.active`);
      if (currentActiveLink) {
        currentActiveLink.classList.remove('active');
      }
      const nextcurrentLink = document.querySelector(`a[href*="#${sectionId}"]`);
      if (nextcurrentLink) {
        nextcurrentLink.classList.add('active');
      }
    }
  }

  function initBackToTop() {
    const backToTopInstance = Object.create(BackToTop);
    backToTopInstance.config = {
      button: document.querySelector('.back-to-top')
    }
    backToTopInstance.init();

  }

  var BackToTop = {
    config: {
      button: undefined,
      path: undefined,
    },
    init: function () {
      if (!this.config.button) return;
      const progressWrap = this.config.button.querySelector('.progress-wrap');
      this.config.path = progressWrap.querySelector('path');

      this.config.button.addEventListener('click', function (e) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo('main');
        }
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      })

      this.updateProgress();
      window.addEventListener('scroll', debounce(this.updateProgress.bind(this), 100));
    },

    updateProgress: function () {
      const body = document.body;
      const html = document.documentElement;
      const documentH = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight) - window.innerHeight;
      const windowScrollY = window.scrollY;

      const buttonWrap = this.config.button.closest('.back-to-top-wrapper');
      if ((windowScrollY / documentH) > 0.2) {
        buttonWrap.classList.add('active');
        setTimeout(() => {
          this.config.button.classList.add('active');
        }, 100)

        const pathLength = this.config.path.getTotalLength();
        this.config.path.style.strokeDasharray = pathLength + ' ' + pathLength;
        const progress = pathLength - (windowScrollY * (pathLength / documentH));
        this.config.path.style.strokeDashoffset = progress;
      } else {
        this.config.button.classList.remove('active');
        setTimeout(() => {
          buttonWrap.classList.remove('active');
        }, 300)
      }

    }

  }

  function ninjaForm() {
    const fieldContainers = document.querySelectorAll('.nf-field-container.w-half');
    fieldContainers.forEach(container => {
      const nfField = container.closest('nf-field');
      if (nfField) {
        nfField.classList.add('w-half');
      }
    })

  }

  function pageCursor() {
    const cursors = document.querySelectorAll('.mouse-cursor');
    const cursorTargetSelectors = ['a', '.cursor-pointer', 'button', '.project-box'];
    const cursorTargets = document.querySelectorAll(cursorTargetSelectors.join(','));
    if (cursors.length === 2) {
      const cursorInner = document.querySelector('.cursor-inner');
      const cursorOuter = document.querySelector('.cursor-outer');

      window.addEventListener('mousemove', function (event) {
        cursorInner.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
        cursorOuter.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      });

      cursorTargets.forEach(target => {
        target.addEventListener('mouseenter', function () {
          cursorInner.classList.add('cursor-hover');
          cursorOuter.classList.add('cursor-hover');
        });

        target.addEventListener('mouseleave', function () {
          cursorInner.classList.remove('cursor-hover');
          cursorOuter.classList.remove('cursor-hover');
        });
      });
      cursorInner.style.visibility = 'visible';
      cursorOuter.style.visibility = 'visible';
    }
  }

  function preloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('preloaded');

        initAos();
        setTimeout(() => {
          preloader.classList.add('d-none');
          preloader.remove();
        }, 2000);
      }, 1000);
    } else {
      initAos();
    }
  }

  function stickyHeader() {
    if (document.querySelector('.site-header')) {
      if (window.scrollY > 0) {
        document.querySelector('.site-header').classList.add('body-scrolled');
      } else {
        document.querySelector('.site-header').classList.remove('body-scrolled');
      }
    }
  }

  var lastScrollPos = window.scrollY;
  var lenis;
  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      })

      function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf);
    }
  }
}
MoraTheme();
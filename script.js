/**
 * MANASA KULAL — PERSONAL PORTFOLIO JAVASCRIPT
 * Features:
 *  - Theme Toggle (Dark/Light) with localStorage persistence
 *  - Mobile Navigation Drawer & Hamburger Toggle
 *  - Active Section Intersection Observer
 *  - Interactive Project Deep-Dive Modals
 *  - Contact Form Real-Time Validation & Mailto Draft Generator
 *  - Toast Notification System
 *  - Scroll-to-Top and Sticky Header Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Theme Toggle (Dark / Light Mode)
  // =========================================================================
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  const STORAGE_KEY = 'manasa_portfolio_theme';

  // Determine initial theme
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');
  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(
        newTheme === 'dark' ? 'Switched to Dark Theme 🌙' : 'Switched to Light Theme ☀️',
        'theme'
      );
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
    }
  }

  // =========================================================================
  // 2. Sticky Navbar & Scroll Effects
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.pointerEvents = 'auto';
      } else {
        backToTopBtn.style.opacity = '0.7';
      }
    }
  }, { passive: true });

  // =========================================================================
  // 3. Mobile Navigation Menu
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      toggleMobileMenu(!isExpanded);
    });

    // Close mobile drawer when clicking any link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') &&
          !mobileDrawer.contains(e.target) &&
          !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
    if (!mobileDrawer || !mobileMenuBtn) return;
    if (open) {
      mobileDrawer.classList.add('open');
      mobileMenuBtn.classList.add('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
    } else {
      mobileDrawer.classList.remove('open');
      mobileMenuBtn.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  // =========================================================================
  // 4. Active Section Highlighting via IntersectionObserver
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Update desktop links
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // =========================================================================
  // 5. Project Modals (Deep Dives)
  // =========================================================================
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        openModal(targetModal);
      }
    });
  });

  modalBackdrops.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');

    // Close button click
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    // Backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Escape key closes open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalElement = document.querySelector('.modal-backdrop.open');
      if (openModalElement) {
        closeModal(openModalElement);
      }
    }
  });

  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // =========================================================================
  // 6. Resume Download Notifications
  // =========================================================================
  const resumeDownloadBtns = document.querySelectorAll('a[download]');
  resumeDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Downloading Manasa Kulal\'s Resume (PDF)... 📄', 'download');
    });
  });

  // =========================================================================
  // 7. Contact Form Validation & Direct Mailto Generator
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const subjectInput = document.getElementById('userSubject');
  const messageInput = document.getElementById('userMessage');

  // Real-time validation listeners
  if (nameInput) nameInput.addEventListener('input', () => validateName(nameInput));
  if (emailInput) emailInput.addEventListener('input', () => validateEmail(emailInput));
  if (subjectInput) subjectInput.addEventListener('input', () => validateSubject(subjectInput));
  if (messageInput) messageInput.addEventListener('input', () => validateMessage(messageInput));

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName(nameInput);
      const isEmailValid = validateEmail(emailInput);
      const isSubjectValid = validateSubject(subjectInput);
      const isMessageValid = validateMessage(messageInput);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showToast('Please correct the highlighted fields before sending.', 'warning');
        return;
      }

      // Collect sanitized inputs
      const senderName = nameInput.value.trim();
      const senderEmail = emailInput.value.trim();
      const subjectText = subjectInput.value.trim();
      const messageBody = messageInput.value.trim();

      // Recipient per requirements
      const recipientEmail = 'kulalmanasa93@gmail.com';

      // Build formatted mail draft
      const formattedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectText}`);
      const formattedBody = encodeURIComponent(
        `Hello Manasa,\n\n${messageBody}\n\n---\nSender Details:\nName: ${senderName}\nEmail: ${senderEmail}\nSent via Portfolio Website`
      );

      const mailtoUrl = `mailto:${recipientEmail}?subject=${formattedSubject}&body=${formattedBody}`;

      // Inform user and trigger mail client
      showToast(
        'Opening your default email app to draft your message to Manasa... ✉️',
        'success'
      );

      // Launch email client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      // Reset form fields
      setTimeout(() => {
        contactForm.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
          if (field) {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
              formGroup.classList.remove('has-success', 'has-error');
            }
          }
        });
      }, 1500);
    });
  }

  function validateName(input) {
    if (!input) return false;
    const value = input.value.trim();
    const isValid = value.length >= 2;
    toggleFieldState(input, isValid);
    return isValid;
  }

  function validateEmail(input) {
    if (!input) return false;
    const value = input.value.trim();
    // Standard RFC email pattern check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    toggleFieldState(input, isValid);
    return isValid;
  }

  function validateSubject(input) {
    if (!input) return false;
    const value = input.value.trim();
    const isValid = value.length >= 3;
    toggleFieldState(input, isValid);
    return isValid;
  }

  function validateMessage(input) {
    if (!input) return false;
    const value = input.value.trim();
    const isValid = value.length >= 10;
    toggleFieldState(input, isValid);
    return isValid;
  }

  function toggleFieldState(input, isValid) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    if (isValid) {
      formGroup.classList.remove('has-error');
      formGroup.classList.add('has-success');
    } else {
      formGroup.classList.remove('has-success');
      formGroup.classList.add('has-error');
    }
  }

  // =========================================================================
  // 8. Toast Notifications Helper
  // =========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'theme') icon = '🎨';
    if (type === 'download') icon = '📥';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-dismiss after 4.2 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode === container) {
          container.removeChild(toast);
        }
      }, 350);
    }, 4200);
  }

  // =========================================================================
  // 9. Current Year Auto-Population
  // =========================================================================
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

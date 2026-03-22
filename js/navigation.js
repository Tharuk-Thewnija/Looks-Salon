/**
 * Navigation Module
 * Handles the mobile drawer toggle and navbar scroll effects.
 */

export function initNavigation() {
  const nav = document.getElementById('mainNav');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const navDrawer = document.getElementById('navDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-links a');

  // Toggle Drawer
  const toggleDrawer = () => {
    navDrawer.classList.toggle('open');
    drawerOverlay.classList.toggle('open');
  };

  // Close Drawer
  const closeDrawer = () => {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
  };

  // Navbar scroll effect
  const handleScroll = () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }
  };

  // Event Listeners
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('scroll', handleScroll);

  // Initial check
  handleScroll();
}

/**
 * Accordion Module
 * Handles toggling accordion items.
 */

export function initAccordion() {
  const accordionItems = document.querySelectorAll('.acc-item');

  const toggleAccordion = (event) => {
    // Get the nearest acc-item from the target
    const item = event.currentTarget;
    const isOpen = item.classList.contains('open');

    // Close all other accordion items
    accordionItems.forEach(i => i.classList.remove('open'));

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
    }
  };

  // Event Listeners
  accordionItems.forEach(item => {
    // Usually only the header is clickable or the whole item
    // Here we use the whole item as in the original code
    item.addEventListener('click', toggleAccordion);
  });
}

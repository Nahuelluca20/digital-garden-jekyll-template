// Check for saved theme preference, otherwise use system preference
function getPreferredTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme to document
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Initialize theme
function initializeTheme() {
  const theme = getPreferredTheme();
  setTheme(theme);

  // Create theme toggle button
  const toggleButton = document.createElement('button');
  toggleButton.setAttribute('id', 'theme-toggle');
  toggleButton.setAttribute('aria-label', 'Toggle dark mode');
  toggleButton.innerHTML = theme === 'dark' ? '☀️' : '🌙';

  // Add toggle button to the page
  const nav = document.querySelector('nav');
  if (nav) {
    nav.appendChild(toggleButton);
  }

  // Add click event listener
  toggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toggleButton.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTheme); 
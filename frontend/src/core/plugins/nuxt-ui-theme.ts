// Konfigurasi untuk mengintegrasikan Nuxt UI dengan theme system yang sudah ada
export const createNuxtUIConfig = () => {
  return {
    // Default color scheme akan diambil dari data-bs-theme attribute
    primary: 'blue',
    gray: 'slate',
    
    // Strategy untuk mendeteksi dark mode
    colorMode: {
      preference: 'system', // default value
      fallback: 'light', // fallback value if not system preference found
      classSuffix: '', // optional, default is ''
      storageKey: 'kt_theme_mode_value', // sync dengan theme store yang sudah ada
      selector: 'html', // element yang akan ditambahkan class dark
      // Function untuk sync dengan existing theme system
      value: () => {
        // Ambil dari localStorage atau sistem theme yang sudah ada
        const stored = localStorage.getItem('kt_theme_mode_value');
        if (stored === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return stored || 'light';
      }
    },

    // CSS variables untuk integrasi dengan Bootstrap theme
    ui: {
      primary: 'rgb(var(--bs-primary-rgb))',
      gray: {
        50: 'rgb(var(--bs-gray-100-rgb))',
        100: 'rgb(var(--bs-gray-200-rgb))',
        200: 'rgb(var(--bs-gray-300-rgb))',
        300: 'rgb(var(--bs-gray-400-rgb))',
        400: 'rgb(var(--bs-gray-500-rgb))',
        500: 'rgb(var(--bs-gray-600-rgb))',
        600: 'rgb(var(--bs-gray-700-rgb))',
        700: 'rgb(var(--bs-gray-800-rgb))',
        800: 'rgb(var(--bs-gray-900-rgb))',
        900: 'rgb(var(--bs-gray-900-rgb))',
        950: 'rgb(var(--bs-gray-900-rgb))',
      }
    }
  };
};

// Theme sync helper untuk Nuxt UI
export const syncNuxtUITheme = () => {
  // Function untuk update dark class
  const updateDarkClass = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Observer untuk perubahan theme
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-bs-theme') {
        const theme = document.documentElement.getAttribute('data-bs-theme');
        
        if (theme === 'dark') {
          updateDarkClass(true);
        } else if (theme === 'light') {
          updateDarkClass(false);
        }
        
        // Dispatch custom event untuk notifikasi perubahan theme
        window.dispatchEvent(new CustomEvent('theme-changed', { 
          detail: { theme } 
        }));
      }
    });
  });

  // Start observing
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-bs-theme']
  });

  // Initial sync berdasarkan theme yang aktif
  const currentTheme = document.documentElement.getAttribute('data-bs-theme');
  if (currentTheme === 'dark') {
    updateDarkClass(true);
  } else {
    updateDarkClass(false);
  }

  // System theme detection untuk mode 'system'
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    const storedTheme = localStorage.getItem('kt_theme_mode_value');
    if (storedTheme === 'system') {
      updateDarkClass(e.matches);
      document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light');
    }
  };

  // Listen untuk perubahan system theme
  mediaQuery.addEventListener('change', handleSystemThemeChange);

  // Cleanup function
  const cleanup = () => {
    observer.disconnect();
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  };

  return { observer, cleanup };
};

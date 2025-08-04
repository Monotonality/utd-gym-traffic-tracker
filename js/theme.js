// UTD Gym Traffic Tracker - Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.updateThemeIcon();
    }

    setupEventListeners() {
        // Theme toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                    this.updateThemeIcon();
                }
            });
        }

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateThemeIcon();
        this.storeTheme();
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));
    }

    applyTheme() {
        const root = document.documentElement;
        
        if (this.currentTheme === 'dark') {
            root.classList.add('dark');
            document.body.classList.add('dark');
        } else {
            root.classList.remove('dark');
            document.body.classList.remove('dark');
        }

        // Update Chart.js theme if charts exist
        this.updateChartTheme();
    }

    updateChartTheme() {
        // Update existing charts to match theme
        if (window.chartManager) {
            window.chartManager.charts.forEach((chart, canvasId) => {
                const isDark = this.currentTheme === 'dark';
                
                // Update chart colors and styling
                if (chart.options && chart.options.scales) {
                    const textColor = isDark ? '#e5e7eb' : '#6b7280';
                    const gridColor = isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(156, 163, 175, 0.2)';
                    
                    // Update x-axis
                    if (chart.options.scales.x) {
                        chart.options.scales.x.ticks.color = textColor;
                        chart.options.scales.x.grid.color = gridColor;
                    }
                    
                    // Update y-axis
                    if (chart.options.scales.y) {
                        chart.options.scales.y.ticks.color = textColor;
                        chart.options.scales.y.grid.color = gridColor;
                    }
                }
                
                chart.update('none'); // Update without animation
            });
        }
    }

    updateThemeIcon() {
        if (this.themeIcon) {
            this.themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
        }
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('utd-gym-theme');
        } catch (e) {
            console.warn('Could not access localStorage for theme preference');
            return null;
        }
    }

    storeTheme() {
        try {
            localStorage.setItem('utd-gym-theme', this.currentTheme);
        } catch (e) {
            console.warn('Could not store theme preference in localStorage');
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme();
            this.updateThemeIcon();
            this.storeTheme();
        }
    }

    // Check if dark mode is active
    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    // Get theme-aware colors
    getThemeColors() {
        return this.currentTheme === 'dark' ? {
            primary: '#3b82f6',
            secondary: '#6b7280',
            background: '#111827',
            surface: '#1f2937',
            text: '#f9fafb',
            textSecondary: '#d1d5db',
            border: '#374151',
            accent: '#60a5fa'
        } : {
            primary: '#3b82f6',
            secondary: '#6b7280',
            background: '#f9fafb',
            surface: '#ffffff',
            text: '#111827',
            textSecondary: '#6b7280',
            border: '#e5e7eb',
            accent: '#2563eb'
        };
    }

    // Apply theme to custom elements
    applyThemeToElement(element, themeType = 'surface') {
        const colors = this.getThemeColors();
        
        switch (themeType) {
            case 'background':
                element.style.backgroundColor = colors.background;
                element.style.color = colors.text;
                break;
            case 'surface':
                element.style.backgroundColor = colors.surface;
                element.style.color = colors.text;
                element.style.borderColor = colors.border;
                break;
            case 'primary':
                element.style.backgroundColor = colors.primary;
                element.style.color = '#ffffff';
                break;
            case 'text':
                element.style.color = colors.text;
                break;
            case 'textSecondary':
                element.style.color = colors.textSecondary;
                break;
        }
    }

    // Create theme-aware CSS variables
    createThemeVariables() {
        const colors = this.getThemeColors();
        const root = document.documentElement;
        
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }

    // Initialize theme variables
    initThemeVariables() {
        this.createThemeVariables();
        
        // Recreate variables when theme changes
        window.addEventListener('themeChanged', () => {
            this.createThemeVariables();
        });
    }

    // Get theme preference from user's system
    getUserThemePreference() {
        // Check localStorage first
        const stored = this.getStoredTheme();
        if (stored) {
            return stored;
        }
        
        // Fall back to system preference
        return this.getSystemTheme();
    }

    // Reset theme to system preference
    resetToSystemTheme() {
        this.currentTheme = this.getSystemTheme();
        this.applyTheme();
        this.updateThemeIcon();
        localStorage.removeItem('utd-gym-theme');
    }

    // Check if user has explicitly set a theme
    hasExplicitTheme() {
        return this.getStoredTheme() !== null;
    }

    // Get theme transition duration
    getTransitionDuration() {
        return '0.2s';
    }

    // Apply smooth theme transition
    applyThemeWithTransition() {
        const root = document.documentElement;
        root.style.transition = `background-color ${this.getTransitionDuration()} ease, color ${this.getTransitionDuration()} ease`;
        
        this.applyTheme();
        
        // Remove transition after animation completes
        setTimeout(() => {
            root.style.transition = '';
        }, 200);
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Initialize theme variables
    if (window.themeManager) {
        window.themeManager.initThemeVariables();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} 
export function switchTheme(themeName) {
    const activeTheme = themeName || 'arcade';
    document.body.setAttribute('data-theme', activeTheme);
    
    // Sync semua dropdown selector tema (Main Roller & Admin Panel)
    const selectors = document.querySelectorAll('#theme-selector, #admin-theme-selector');
    selectors.forEach(select => {
        if (select.value !== activeTheme) {
            select.value = activeTheme;
        }
    });
}
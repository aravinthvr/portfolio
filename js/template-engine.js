/**
 * Simple HTML templating/component system for portfolio website
 */

class TemplateEngine {
    constructor() {
        this.componentCache = {};
    }

    /**
     * Load a component from file
     * @param {string} path - Path to the component file
     * @returns {Promise<string>} - The component HTML as string
     */
    async loadComponent(path) {
        if (this.componentCache[path]) {
            return this.componentCache[path];
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load component from ${path}`);
            }
            const html = await response.text();
            this.componentCache[path] = html;
            return html;
        } catch (error) {
            console.error(`Error loading component from ${path}:`, error);
            return '';
        }
    }

    /**
     * Insert a component into a container
     * @param {string} selector - CSS selector for container
     * @param {string} componentPath - Path to component file
     * @param {Object} data - Data to pass to component (optional)
     */
    async insertComponent(selector, componentPath, data = {}) {
        const container = document.querySelector(selector);
        if (!container) {
            console.error(`Container not found: ${selector}`);
            return;
        }

        let html = await this.loadComponent(componentPath);
        
        // Replace variables in the template
        if (data) {
            Object.keys(data).forEach(key => {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                html = html.replace(regex, data[key]);
            });
        }

        container.innerHTML = html;
        
        // Execute scripts in the component
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = script.textContent;
            script.parentNode.replaceChild(newScript, script);
        });
    }
}

// Export as global
window.templateEngine = new TemplateEngine();

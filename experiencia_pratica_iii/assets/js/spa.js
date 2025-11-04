const contentRoot = document.getElementById('content-root') || document.querySelector('main');
const pageCache = {};

const getCleanPath = (path) => {
    let cleanPath = path;

    if (path.startsWith('/')) {
        cleanPath = path.substring(1);
    }

    const pathParts = cleanPath.split('/');
    let fileName = pathParts[pathParts.length - 1] || 'index.html';
    
    if (!fileName.includes('.html') && fileName !== '') {
        fileName = 'index.html';
    }
    
    return fileName;
};

const loadContent = async (path) => {
    const url = getCleanPath(path);
    
    if (pageCache[url]) {
        return pageCache[url];
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('#content-root').innerHTML;
        
        pageCache[url] = mainContent;
        return mainContent;
    } catch (error) {
        console.error('Erro ao carregar o conteúdo da página:', url, error);
        return '<h2>Erro 404: Conteúdo não encontrado.</h2>';
    }
};

const renderPage = async (path) => {
    const content = await loadContent(path);
    
    if (contentRoot) {
        contentRoot.innerHTML = content;
        
        const fileName = getCleanPath(path);
        
        if (fileName.includes('cadastro.html')) {
            window.applyMasks();
            window.setupFormValidation();
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const renderTemplate = (data) => {
    return `
        <div class="alert alert-success">
            <h3>${data.title}</h3>
            <p>Status: ${data.status}</p>
        </div>
    `;
};

const setupRouting = () => {
    
    // CORREÇÃO: Usa Event Delegation no documento inteiro
    document.addEventListener('click', (e) => {
        // Verifica se o elemento clicado é um link e se o href termina em .html
        const link = e.target.closest('a[href$=".html"]');
        
        if (link) {
            const url = link.getAttribute('href');
            
            e.preventDefault();
            
            history.pushState(null, '', url);
            renderPage(url);
        }
    });

    window.addEventListener('popstate', () => {
        renderPage(location.pathname);
    });

    const templateSection = document.getElementById('conquistas');
    if (templateSection) {
        const templateData = { title: "Projeto Educação 2024", status: "Concluído com Sucesso" };
        const templateHTML = renderTemplate(templateData);
        templateSection.insertAdjacentHTML('beforeend', templateHTML);
    }
    
    renderPage(location.pathname);
};

export { setupRouting };
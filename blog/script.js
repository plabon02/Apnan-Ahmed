/* ===== Mobile menu toggle ===== */
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');
if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
    });
}

/* ===== Dropdown toggle (mobile) ===== */
document.querySelectorAll('.drop-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        const li = trigger.closest('.dropdown');
        if (window.innerWidth <= 760) {
            e.preventDefault();
            li.classList.toggle('open');
        }
    });
});

/* ===== Top search panel ===== */
const searchToggle = document.getElementById('searchToggle');
const searchPanel = document.getElementById('searchPanel');
const searchInput = document.getElementById('searchInput');
const searchClose = document.getElementById('searchClose');
if (searchToggle && searchPanel && searchInput) {
    searchToggle.addEventListener('click', () => {
        searchPanel.classList.toggle('open');
        if (searchPanel.classList.contains('open')) {
            searchInput.focus();
            const sideEl = document.getElementById('sideSearch');
            if (sideEl) sideEl.value = '';
            runSearch('');
        }
    });
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchPanel.classList.remove('open');
        });
    }
    searchInput.addEventListener('input', (e) => {
        runSearch(e.target.value);
    });
}

/* ===== Search + category/language filter + pagination ===== */
const posts = Array.from(document.querySelectorAll('.oi-post'));
const paginationEl = document.getElementById('pagination');
const pageSize = paginationEl ? (parseInt(paginationEl.dataset.posts, 10) || 4) : 4;
let activeSearch = '';

function runSearch(query) {
    activeSearch = query.trim().toLowerCase();
    render();
}

function visiblePosts() {
    const h = location.hash;
    const cat = h.match(/#cat-(\w+)/);
    const lang = h.match(/#lang-(\w+)/);
    return posts.filter(p => {
        const okC = !cat || p.dataset.cat === cat[1];
        const okL = !lang || p.dataset.lang === lang[1];
        const hay = (p.textContent + ' ' + p.className).toLowerCase();
        const okS = activeSearch === '' || hay.indexOf(activeSearch) !== -1;
        return okC && okL && okS;
    });
}

function currentPage(total) {
    const m = location.hash.match(/#p=(\d+)/);
    let p = m ? parseInt(m[1], 10) : 1;
    if (p < 1) p = 1;
    if (p > total) p = total;
    return p;
}

function render() {
    const list = visiblePosts();
    const total = Math.max(1, Math.ceil(list.length / pageSize));
    const page = currentPage(total);
    const onPage = new Set(list.slice((page - 1) * pageSize, page * pageSize));

    posts.forEach(p => {
        const visible = list.indexOf(p) !== -1;
        p.style.display = visible ? '' : 'none';
        p.classList.toggle('paged-out', visible && !onPage.has(p));
    });

    buildPagination(total, page);

    const msgEl = document.getElementById('searchStatus');
    if (list.length === 0 && posts.length > 0) {
        let el = msgEl;
        if (!el) {
            el = document.createElement('p');
            el.id = 'searchStatus';
            el.style.cssText = 'text-align:center;color:var(--font-color);padding:1.5rem 0;';
            const listEl = document.querySelector('.posts-list');
            if (listEl) listEl.appendChild(el);
        }
        el.textContent = 'আপনার অনুসন্ধানে কোনো পোস্ট পাওয়া যায়নি।';
    } else if (msgEl) {
        msgEl.remove();
    }
}

function buildPagination(total, page) {
    if (!paginationEl) return;
    if (total <= 1) {
        paginationEl.innerHTML = '';
        return;
    }
    let h = '<ul class="pagination-list">';
    h += (page > 1)
        ? `<li><a href="#p=${page - 1}" aria-label="Previous"><i class='bx bx-chevron-left'></i></a></li>`
        : `<li class="disabled"><span><i class='bx bx-chevron-left'></i></span></li>`;
    for (let i = 1; i <= total; i++) {
        h += (i === page)
            ? `<li class="active"><span>${i}</span></li>`
            : `<li><a href="#p=${i}">${i}</a></li>`;
    }
    h += (page < total)
        ? `<li><a href="#p=${page + 1}" aria-label="Next"><i class='bx bx-chevron-right'></i></a></li>`
        : `<li class="disabled"><span><i class='bx bx-chevron-right'></i></span></li>`;
    h += '</ul>';
    paginationEl.innerHTML = h;
}

const sideSearch = document.getElementById('sideSearch');
if (sideSearch) {
    sideSearch.addEventListener('input', (e) => {
        runSearch(e.target.value);
    });
}

function applyFilter() {
    const h = location.hash;
    document.querySelectorAll('[data-cat], [data-lang]').forEach(a => {
        const target = a.getAttribute('href') || '';
        a.classList.toggle('active', target === h);
    });
    render();
}

window.addEventListener('hashchange', applyFilter);
applyFilter();

/* ===== Back to top ===== */
const toTop = document.getElementById('toTop');
if (toTop) {
    window.addEventListener('scroll', () => {
        toTop.classList.toggle('show', window.scrollY > 350);
    });
    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
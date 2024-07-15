/**
 * @author Elmahdi KORFED
 */

//--- for JS selection
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
// const _pathJSON = `./assets/json/cv.json`;
let _data;
let article_profil, mainNavLinks, div_recom, nbTotalRecommandations, bt_preview, bt_next, sp_pagination, pageHeight;
let numRecommandation = 0, currentPage = 0;
var intervalRecomm;

window.onload = _ => {
    console.log(`page loaded`);
    article_profil = $("#article_profil");
    mainNavLinks = $$("#nav_menu a");

    document.querySelectorAll('a[href^="#"]').forEach((anchor, _index) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            $(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            })
        });
    });



    div_recom = $("#div_recom");
    sp_pagination = $("#sp_pagination");
    nbTotalRecommandations = parseInt(div_recom.querySelectorAll('li').length);
    bt_preview = $("#bt_preview");
    bt_next = $("#bt_next");



    viewRecommandations();

    myStartFunction();

    div_recom.onmouseenter = () => myStopFunction();
    div_recom.onmouseleave = () => myStartFunction();

    bt_preview.onclick = () => {
        numRecommandation--;
        viewRecommandations();
    }

    bt_next.onclick = () => {
        numRecommandation++;
        viewRecommandations();
    }

    $(`#bt_viewMenu`).onclick = () => viewMenu();

    /*
    _loadData().then(d => {
        // header
        $(`#p_name`).innerHTML = `${d.about.firstname} ${d.about.lastname.toUpperCase()}`;
        $(`#p_job`).innerHTML = d.about.job_position;
        // aside
        $(`#img_bio`).src = d.about.photo;
        $(`#p_resume_title`).innerHTML = d.about.bio_web_title;
        $(`#p_resume`).innerHTML = d.about.bio_web;
        // aside links
        $(`#email_link`).href = `mailto:${d.about.contact.email}`;
        $(`#facebook_link`).href = d.about.contact.facebook;
        $(`#linkedin_link`).href = d.about.contact.linkedin;
        // aside download CV
        $(`#a_download_cv`).href = d.about.contact.resume;
        // aside footer
        $(`footer p`).innerHTML = d.about.footer;
        // portfolio
        $(`#ul_portfolio`).innerHTML = _renderULPortfolio();
    });
    */

    pageHeight = $(`#div_infos`).getBoundingClientRect().height;
    article_profil.onscroll = () => scrollView();
}

const viewMenu = _ => {
    const _main = $(`main`);
    const _menu = $(`#nav_menu`);
    if (_menu.classList.contains(`translateMenu`)) {
        _menu.classList.remove(`translateMenu`);
        _main.classList.remove(`translateMain`);
    }
    else {
        _menu.classList.add(`translateMenu`);
        _main.classList.add(`translateMain`);
    }
}

function myStopFunction() {
    clearInterval(intervalRecomm);
}

function myStartFunction() {
    intervalRecomm = setInterval(() => {
        numRecommandation++;
        viewRecommandations();
    }, 3000);

}


function reportWindowSize() {
    pageHeight = $(`#div_infos`).getBoundingClientRect().height;
    console.log(`new height !: ${pageHeight}`);
}

window.onresize = reportWindowSize;


const scrollView = event => {
    fromTop = article_profil.scrollY;
    if (currentPage != Math.round(article_profil.scrollTop / pageHeight)) {
        currentPage = Math.round(article_profil.scrollTop / pageHeight);
        renderActiveMenu(currentPage);
    }

    // mainNavLinks.forEach(link => {
    //     let section = document.querySelector(link.hash);
    //     if ((section.offsetTop <= fromTop) && (section.offsetTop + section.offsetHeight > fromTop)) link.classList.add("link_active");
    //     else link.classList.remove("link_active");
    // });
}

const renderActiveMenu = _pageSelected => {
    $(`#nav_menu`).querySelectorAll('a[href^="#"]').forEach((anchor, _index) => {
        if (_index === _pageSelected) anchor.classList.add(`link_active`);
        else {
            if (anchor.classList.contains(`link_active`)) {
                anchor.classList.remove(`link_active`);
            }
        }
    });

}
const viewRecommandations = _ => {
    if (numRecommandation < 0) numRecommandation = nbTotalRecommandations - 1;
    if (numRecommandation >= nbTotalRecommandations) numRecommandation = 0;


    let _li = div_recom.querySelectorAll('li');
    for (let i = 0; i < nbTotalRecommandations; i++) {
        if (numRecommandation == i) _li[i].classList.remove(`hidden`);
        else {
            if (!_li[i].classList.contains(`hidden`)) {
                _li[i].classList.add(`hidden`);
            }
        }
    }
    sp_pagination.innerText = `${(numRecommandation + 1)}/${(nbTotalRecommandations)}`;

}


/** 
 * @function _renderULPortfolio
 * @returns {string}
 */
let _renderULPortfolio = _ => {
    let _html = ``;
    for (const key in _data) _html += _renderLI(key);
    return _html;
}

/** 
 * @function _renderLI
 * @param {number} key 
 * @returns {string}
 */
let _renderLI = (key = null) => {
    return `
    <li id="li_${key}" class="animateUp" style="animation-delay:${key / 6}s">
    <a href="${_data[key].link}" target="_blank" rel="noreferrer noopener">
    <div class="div_portfolio">
    <img src="${_data[key].src}" alt="${_data[key].title}" onerror="this.onerror=null; this.src='./assets/images/notfound.jpg'">
    <p class="p_title">${_data[key].title}</p>
    <p class="p_des">${_data[key].description}</p>
    </div>
    </a>
    </li>`;
}

/**
 * @function _loadData
 * @returns {Promise} Promise object
let _loadData = _ => {
    return new Promise((resolve, reject) => {
        fetch(_pathJSON)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                return response.json();
            })
            .then(_json => {
                const _portfolioEntreprise = _json.portfolio[0].projects.filter(project => project.visible);
                const _portfolioPersonnal = _json.portfolio[1].projects.filter(project => project.visible);
                const _portfolioStartup = _json.portfolio[2].projects.filter(project => project.visible);
                const _portfolioGame = _json.portfolio[3].projects.filter(project => project.visible);
                const _portfolioFreelance = _json.portfolio[4].projects.filter(project => project.visible);
                const _portfolioUniversitaire = _json.portfolio[5].projects.filter(project => project.visible);

                _data = [
                    ..._portfolioEntreprise,
                    ..._portfolioStartup,
                    ..._portfolioPersonnal,
                    ..._portfolioGame,
                    ..._portfolioFreelance,
                    ..._portfolioUniversitaire
                ];
                resolve({
                    about: _json.about,
                    portfolio: _data
                });
            })
            .catch(error => {
                throw new Error(`HTTP error ${error}`);
            })
    });
}
 */
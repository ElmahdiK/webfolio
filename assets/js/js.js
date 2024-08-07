/**
 * @author Elmahdi KORFED
 */

//--- for JS selection
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
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
}

window.onresize = reportWindowSize;

const scrollView = event => {
    fromTop = article_profil.scrollY;
    if (currentPage != Math.round(article_profil.scrollTop / pageHeight)) {
        currentPage = Math.round(article_profil.scrollTop / pageHeight);
        renderActiveMenu(currentPage);
    }
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

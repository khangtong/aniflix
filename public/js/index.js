import { login, logout, signup } from './login.js';
import { updateSettings } from './updateSettings.js';
import { handleFavorites } from './handleFavorites';

// Handle log in, sign up
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logoutBtn = document.querySelector('.logout');

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email--login').value;
    const password = document.querySelector('#password--login').value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email--signup').value;
    const password = document.querySelector('#password--signup').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });

if (logoutBtn)
  logoutBtn.addEventListener('click', () => {
    logout();
  });

// Handle search
const searchForm = document.querySelector('.nav__search');
const searchInput = document.querySelector('.nav__search-input');

if (searchForm)
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    location.assign(`${location.origin}/search?s=${searchInput.value}`);
  });

// Handle update user data
const dataForm = document.querySelector('.setting-form');

if (dataForm)
  dataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

const passwordForm = document.querySelector('.password-change-form');

if (passwordForm)
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    updateSettings({ currentPassword, password, passwordConfirm }, 'password');
  });

// Handle add to favorites
const addFavBtn = document.querySelector('.handle-favorites__btn--add');
const removeFavBtn = document.querySelector('.handle-favorites__btn--remove');

if (addFavBtn)
  addFavBtn.addEventListener('click', () => {
    handleFavorites(document.body.dataset.id, 'add');
  });

if (removeFavBtn)
  removeFavBtn.addEventListener('click', () => {
    handleFavorites(document.body.dataset.id, 'remove');
  });

// Handle overlay
const overlay = document.querySelector('.overlay');

if (overlay)
  overlay.addEventListener('click', () => {
    document
      .querySelector('.login-container')
      .classList.remove('login-signup-container--active');
    document
      .querySelector('.signup-container')
      .classList.remove('login-signup-container--active');
    overlay.classList.remove('overlay--active');
    document.body.classList.remove('stop-scrolling');
  });

// Handle navbar
const navbarUser = document.querySelector('.navbar--user');

if (navbarUser) {
  navbarUser.addEventListener('click', (e) => {
    const navbarUserItem = e.target.closest('.navbar__item--user');
    if (navbarUserItem.classList.contains('navbar__item--user--login')) {
      const loginContainer = document.querySelector('.login-container');
      loginContainer.style = `top: calc(50% + ${window.visualViewport.pageTop}px);`;
      loginContainer.classList.add('login-signup-container--active');
      overlay.classList.add('overlay--active');
      document.body.classList.add('stop-scrolling');
    } else if (
      navbarUserItem.classList.contains('navbar__item--user--signup')
    ) {
      const signupContainer = document.querySelector('.signup-container');
      signupContainer.style = `top: calc(50% + ${window.visualViewport.pageTop}px);`;
      signupContainer.classList.add('login-signup-container--active');
      overlay.classList.add('overlay--active');
      document.body.classList.add('stop-scrolling');
    } else {
      if (
        !document
          .querySelector('.navbar__item--user__account')
          .classList.contains('navbar__item--user__account--active')
      ) {
        document
          .querySelector('.navbar__item--user__account')
          .classList.add('navbar__item--user__account--active');
      } else {
        document
          .querySelector('.navbar__item--user__account')
          .classList.remove('navbar__item--user__account--active');
      }
    }
  });

  navbarUser.addEventListener('mouseover', (e) => {
    const navbarUserItem =
      e.target.closest('.navbar__item--user.navbar__item--user--login') ||
      e.target.closest('.navbar__item--user.navbar__item--user--signup');
    navbarUserItem?.children[0].classList.add('fa-solid');
  });

  navbarUser.addEventListener('mouseout', (e) => {
    const navbarUserItem =
      e.target.closest('.navbar__item--user.navbar__item--user--login') ||
      e.target.closest('.navbar__item--user.navbar__item--user--signup');
    navbarUserItem?.children[0].classList.remove('fa-solid');
  });
}

// Handle filter
const filter = document.querySelector('.filter');

if (filter) {
  const filterBtn = document.querySelector('.filter-btn');

  filterBtn?.addEventListener('mouseover', () => {
    filterBtn.children[0].classList.add('fa-solid');
  });

  filterBtn?.addEventListener('mouseout', () => {
    filterBtn.children[0].classList.remove('fa-solid');
  });

  const filterListCategory = document.querySelector('.filter__list--category');
  const filterListCountry = document.querySelector('.filter__list--country');

  const filterItemCategoryArr = [...filterListCategory?.children];
  const filterItemCountryArr = [...filterListCountry?.children];

  const handleFilterItemAndReturnActiveCount = (filterItem) => {
    if (!filterItem.classList.contains('filter__item--active')) {
      filterItem.classList.add('filter__item--active');
      filterItem.children[0].classList.add('fa-solid');
    } else {
      filterItem.classList.remove('filter__item--active');
      filterItem.children[0].classList.remove('fa-solid');
    }
  };

  const getTypeFilterCount = () => {
    let typeFilterCount = 0;
    if (
      filterItemCategoryArr.some((el) =>
        el.classList.contains('filter__item--active')
      )
    )
      typeFilterCount++;
    if (
      filterItemCountryArr.some((el) =>
        el.classList.contains('filter__item--active')
      )
    )
      typeFilterCount++;

    return typeFilterCount;
  };

  filterListCategory.addEventListener('click', (e) => {
    const filterItem = e.target.closest('.filter__item');
    handleFilterItemAndReturnActiveCount(filterItem);
  });

  filterListCountry.addEventListener('click', (e) => {
    const filterItem = e.target.closest('.filter__item');
    handleFilterItemAndReturnActiveCount(filterItem);
  });

  filterBtn.addEventListener('click', () => {
    let params = '';
    const typeFilterCount = getTypeFilterCount();
    if (typeFilterCount > 0) {
      filterItemCategoryArr
        .filter((el) => el.classList.contains('filter__item--active'))
        .forEach((el, i) => {
          if (i == 0) params += `?category=${el.innerText.toLowerCase()}`;
          else params += `+${el.innerText.toLowerCase()}`;
        });
      filterItemCountryArr
        .filter((el) => el.classList.contains('filter__item--active'))
        .forEach((el, i) => {
          if (i == 0)
            params += `${
              typeFilterCount === 1 ? '?' : '&'
            }country=${el.innerText.toLowerCase()}`;
          else params += `+${el.innerText.toLowerCase()}`;
        });
      window.location.assign(params);
    } else window.location.assign('/');
  });
}

// Handle pagination
const pagination = document.querySelector('.pagination');

if (pagination) {
  pagination.addEventListener('click', (e) => {
    const paginationItem = e.target.closest('div');
    let url = new URL(window.location.href);

    if (paginationItem.classList.contains('pagination__current')) {
      url.searchParams.set('page', paginationItem.innerText);
      window.location.assign(url.toString());
    } else if (paginationItem.classList.contains('pagination__prev')) {
      url.searchParams.set(
        'page',
        (window.location.search?.includes('page')
          ? +window.location.search.slice(-1)
          : 1) - 1
      );
      window.location.assign(url.toString());
    } else {
      url.searchParams.set(
        'page',
        (window.location.search?.includes('page')
          ? +window.location.search.slice(-1)
          : 1) + 1
      );
      window.location.assign(url.toString());
    }
  });
}

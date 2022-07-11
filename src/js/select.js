const getSelect = (placeholder) => {
  const text = placeholder ?? 'Введите репозиторий'

  const selectDom = document.createDocumentFragment();

  const selectInputWrapper = document.createElement('div');
  selectInputWrapper.classList.add('sel__inp');

  const selectInput = document.createElement('input');
  selectInput.classList.add('input');
  selectInput.setAttribute('placeholder', text);
  selectInput.setAttribute('data-type', 'input');
  const icon = document.createElement('i');
  icon.classList.add('fa-solid');
  icon.classList.add('fa-chevron-down');
  icon.setAttribute('data-type', 'arrow');
  selectInputWrapper.appendChild(selectInput);
  selectInputWrapper.appendChild(icon);

  const selectDropdown = document.createElement('div');
  selectDropdown.classList.add('sel__dropdown');
  const ul = document.createElement('ul');
  ul.classList.add('sel__list');
  selectDropdown.appendChild(ul);

  selectDom.appendChild(selectInputWrapper);
  selectDom.appendChild(selectDropdown);

  return selectDom
}

function getAjaxData(data = []) {
  const itemFragment = document.createDocumentFragment();

  data.map((rep) => {
    const li = document.createElement('li')
    li.classList.add('sel__item')
    li.setAttribute('data-stars', rep.stargazers_count);
    li.setAttribute('data-link', rep.url);
    const avatarWrapper = document.createElement('div');
    const avatarImg = document.createElement('img');
    avatarWrapper.classList.add('sel__avatar');
    avatarImg.setAttribute('src', rep.owner.avatar_url);
    avatarImg.setAttribute('alt', 'avatar');
    avatarWrapper.appendChild(avatarImg);
    li.appendChild(avatarWrapper)
    const selectWrapper = document.createElement('div');
    selectWrapper.classList.add('sel__wrapper');
    const name = document.createElement('div');
    name.classList.add('sel__name');
    name.textContent = rep.name;
    const owner = document.createElement('div');
    owner.classList.add('sel__owner');
    owner.textContent = rep.owner.login;
    selectWrapper.appendChild(name);
    selectWrapper.appendChild(owner);
    li.appendChild(selectWrapper);
    itemFragment.appendChild(li)
  })

  return itemFragment
}

function addReposListItem(name, owner, starCount) {
  const itemFragment =document.createDocumentFragment();

  const listItem = document.createElement('div');
  listItem.classList.add('reposlist__item');
  const listItemInfo = document.createElement('div');
  listItemInfo.classList.add('reposlist__info');

  const itemname = document.createElement('div');
  itemname.classList.add('reposlist__name');
  const imgNameWrapper = document.createElement('div');
  const nameImg = document.createElement('img');
  nameImg.setAttribute('src', './src/img/person.svg');
  nameImg.setAttribute('alt', 'icon');
  const nameText = document.createElement('div');
  nameText.classList.add('name__text');
  nameText.textContent = `Name: ${name}`;
  imgNameWrapper.appendChild(nameImg);
  itemname.appendChild(imgNameWrapper);
  itemname.appendChild(nameText);

  const itemOwner = document.createElement('div');
  itemOwner.classList.add('reposlist__owner');
  const imgOwnerWrapper = document.createElement('div');
  const OwnerImg = document.createElement('img');
  OwnerImg.setAttribute('src', './src/img/owner.svg');
  OwnerImg.setAttribute('alt', 'icon');
  const OwnerText = document.createElement('div');
  OwnerText.classList.add('owner__text');
  OwnerText.textContent = `Owner: ${owner}`;
  imgOwnerWrapper.appendChild(OwnerImg);
  itemOwner.appendChild(imgOwnerWrapper);
  itemOwner.appendChild(OwnerText);

  const itemStars = document.createElement('div');
  itemStars.classList.add('reposlist__stars');
  const imgStarWrapper = document.createElement('div');
  imgStarWrapper.classList.add('reposlist__icon');
  const StarImg = document.createElement('img');
  StarImg.setAttribute('src', './src/img/star.svg');
  StarImg.setAttribute('alt', 'icon');
  const StarCount = document.createElement('div');
  StarCount.classList.add('reposlist__count');
  StarCount.textContent = `Stars: ${starCount}`;
  imgStarWrapper.appendChild(StarImg);
  itemStars.appendChild(imgStarWrapper);
  itemStars.appendChild(StarCount);

  const delWrapper = document.createElement('div');
  delWrapper.classList.add('reposlist__del');
  const delImg = document.createElement('img');
  delImg.setAttribute('src', './src/img/delete.svg');
  delImg.setAttribute('alt', 'cart');
  delWrapper.addEventListener('click', (e) => {
    e.target.closest('.reposlist__item').remove();
    document.querySelectorAll('.reposlist__item') ? document.querySelector('.reposlist').classList.remove('active') : null;
  })
  delWrapper.appendChild(delImg);

  listItemInfo.append(itemname);
  listItemInfo.append(itemOwner);
  listItemInfo.append(itemStars);

  listItem.appendChild(listItemInfo);
  listItem.appendChild(delWrapper);
  itemFragment.appendChild(listItem);

  return itemFragment;
}


class Select {
  constructor(element, options) {
    this.element = document.querySelector(element);
    this.options = options;
    this.render();
    this.setup();
  }

  render() {
    const { placeholder } = this.options;
    this.element.classList.add('sel')
    this.element.appendChild(getSelect(placeholder))
  }

  setup() {
    this.inputHandler = this.inputHandler.bind(this);
    this.clickInputHandler = this.clickInputHandler.bind(this);
    this.clickItemHandler = this.clickItemHandler.bind(this);
    this.element.querySelector('.sel__inp').addEventListener("click", this.clickInputHandler);
    document.addEventListener("keyup", this.debounce(this.inputHandler, this.options.ajaxWait));
    this.arrow = this.element.querySelector('[data-type="arrow"]');
  }

  open() {
    this.element.classList.add('open');
    this.arrow.classList.remove('fa-chevron-down');
    this.arrow.classList.add('fa-chevron-up');
  }

  close() {
    this.element.classList.remove('open');
    this.arrow.classList.remove('fa-chevron-up');
    this.arrow.classList.add('fa-chevron-down');
  }

  get isOpen() {
    return this.element.classList.contains('open')
  }

  toggleSel() {
    this.isOpen ? this.close() : this.open();
  }

  clearDropDown() {
    document.querySelector('.sel__list').innerHTML = '';
  }

  clickInputHandler(e) {
    const { type } = e.target.dataset;

    type ? this.toggleSel() : null;
  }

  clickItemHandler(e) {
    let item = e.target.closest('.sel__item');
    let name = item.querySelector('.sel__name').textContent;
    let owner = item.querySelector('.sel__owner').textContent;
    let starsCount = item.dataset.stars;
    document.querySelector('.reposlist__wrapper').appendChild(addReposListItem(name, owner, starsCount));
    this.close();
    document.querySelector('.reposlist').classList.add('active');
    document.querySelector('input').value = '';
    this.clearDropDown();
  }

  inputHandler(e) {
    e.target.value ? this.getrepos(e.target.value) : null;
  }

  debounce(fn, msec) {
    let timeout;
    return function () {
      const fnCall = () => fn.apply(this, arguments);

      clearTimeout(timeout)

      timeout = setTimeout(fnCall, msec)
    }
  }

  getrepos(value) {
    document.querySelector('ul').innerHTML = '';
    fetch(`https://api.github.com/search/repositories?q=${value} in:name&per_page=5`)
      .then(response => response.json())
      .then(data => {
        this.open();
        document.querySelector('ul').appendChild(getAjaxData(data.items));
      })
      .then(() => {
        document.querySelectorAll('.sel__item').forEach(item => {
          item.addEventListener('click', this.clickItemHandler);
        });
      })
  }

}

export default Select
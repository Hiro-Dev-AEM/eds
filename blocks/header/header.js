// aem.jsからgetMetadata関数、fragment.jsからloadFragment関数をインポート
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
// デスクトップ用の画面幅かどうかを判断するためのメディアクエリ
const isDesktop = window.matchMedia('(min-width: 900px)');

// Escapeキーが押されたときの挙動を定義する関数
function closeOnEscape(e) {
  if (e.code === 'Escape') { // Escapeキーが押されたとき
    const nav = document.getElementById('nav'); // nav要素を取得
    const navSections = nav.querySelector('.nav-sections'); // nav要素の子要素の.nav-sections要素を取得
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]'); // 展開されているナビゲーションセクションを取得。navSections要素の子要素で、aria-expanded属性がtrueの要素を取得
    if (navSectionExpanded && isDesktop.matches) {  // 展開されているナビゲーションセクションが存在し、デスクトップ用の画面幅の場合
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);  // すべてのナビゲーションセクションの展開/折りたたみを切り替え
      navSectionExpanded.focus(); // 展開されているナビゲーションセクションにフォーカスを移動
    } else if (!isDesktop.matches) {  // デスクトップ用の画面幅でない場合
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections); // ナビゲーションを展開/折りたたみ
      nav.querySelector('button').focus();  // ナビゲーションのハンバーガーボタンにフォーカスを移動
    }
  }
}
// ナビゲーションセクションの展開/折りたたみを切り替える関数 
function openOnKeydown(e) {
  const focused = document.activeElement; // フォーカスされている要素を取得
  const isNavDrop = focused.className === 'nav-drop'; // フォーカスされている要素が.nav-drop要素(ドロップダウン)かどうかを判断
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {  // フォーカスされている要素が.nav-drop要素(ドロップダウン)で、EnterキーまたはSpaceキーが押されたとき
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';  // フォーカスされている要素のaria-expanded属性の値を取得
    // eslint-disable-next-line no-use-before-define  
    toggleAllNavSections(focused.closest('.nav-sections')); // すべてのナビゲーションセクションの展開/折りたたみを切り替え
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true'); // フォーカスされている要素のaria-expanded属性の値を切り替え
  }
}
// ナビゲーションセクションの展開/折りたたみを切り替える関数
function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);  // フォーカスされている要素にkeydownイベントを追加
}

/**
 * Toggles all nav sections すべてのナビゲーションセクションの展開/折りたたみを切り替える関数
 * @param {Element} sections The container element セクションのコンテナ要素
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
// すべてのナビゲーションセクションの展開/折りたたみを切り替える関数
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {  // sections要素の子要素で、.default-content-wrapper > ul > li要素を取得
    section.setAttribute('aria-expanded', expanded);  // 取得した要素のaria-expanded属性の値を切り替え
  });
}

/**
 * Toggles the entire nav ナビゲーション全体の開閉を切り替える関数
 * @param {Element} nav The container element ナビゲーションのコンテナ要素
 * @param {Element} navSections The nav sections within the container element ナビゲーションセクションの要素
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null 強制的に展開する場合に使用するオプションのパラメータ
 */

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true'; // 強制的に展開する場合は、forceExpandedの値を反転させた値をexpandedに代入。そうでない場合は、nav要素のaria-expanded属性の値を取得
  const button = nav.querySelector('.nav-hamburger button'); // nav要素の子要素で、.nav-hamburger button要素を取得
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden'; // ナビゲーションが展開されているか、デスクトップ用の画面幅の場合は、body要素のoverflowY属性の値を空文字にする。そうでない場合は、hiddenにする
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true'); // nav要素のaria-expanded属性の値を切り替え
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true'); // すべてのナビゲーションセクションの展開/折りたたみを切り替え
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation'); // ナビゲーションが展開されているかどうかで、ハンバーガーボタンのaria-label属性の値を切り替え
  // enable nav dropdown keyboard accessibility
  // ナビゲーションのドロップダウンのキーボードアクセシビリティを有効にする
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) { // デスクトップ用の画面幅の場合
    navDrops.forEach((drop) => { // navDrops要素の子要素で、.nav-drop要素を取得
      if (!drop.hasAttribute('tabindex')) { // .nav-drop要素にtabindex属性が存在しない場合
        drop.setAttribute('role', 'button'); // .nav-drop要素にrole属性を追加
        drop.setAttribute('tabindex', 0); // .nav-drop要素にtabindex属性を追加
        drop.addEventListener('focus', focusNavSection); // .nav-drop要素にfocusイベントを追加
      }
    });
  } else { // デスクトップ用の画面幅でない場合
    navDrops.forEach((drop) => { // navDrops要素の子要素で、.nav-drop要素を取得
      drop.removeAttribute('role'); // .nav-drop要素からrole属性を削除
      drop.removeAttribute('tabindex'); // .nav-drop要素からtabindex属性を削除
      drop.removeEventListener('focus', focusNavSection); // .nav-drop要素からfocusイベントを削除
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) { // ナビゲーションが展開されていないか、デスクトップ用の画面幅の場合
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape); // Escapeキーが押されたときの挙動を定義
  } else { // ナビゲーションが展開されているか、デスクトップ用の画面幅でない場合
    window.removeEventListener('keydown', closeOnEscape); // Escapeキーが押されたときの挙動を削除
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) { // ヘッダーの装飾を行う関数
  // load nav as fragment 
  const navMeta = getMetadata('nav'); // ヘッダーのメタデータからnavのパスを取得
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav'; // navのパスが存在する場合は、navのパスを取得。そうでない場合は、/navを取得
  const fragment = await loadFragment(navPath); // navのパスを引数にして、loadFragment関数を実行。戻り値をfragmentに代入

  // decorate nav DOM
  const nav = document.createElement('nav'); // nav要素を作成
  nav.id = 'nav'; // nav要素にid属性を追加
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild); // fragment要素の最初の子要素が存在する場合は、nav要素に追加

  const classes = ['brand', 'sections', 'tools']; // クラス名を定義
  classes.forEach((c, i) => { // classes要素の各要素に対して、以下の処理を実行
    const section = nav.children[i]; // nav要素の子要素のうち、インデックス番号がiの要素を取得
    if (section) section.classList.add(`nav-${c}`); // 取得した要素に、nav-${c}クラスを追加
  });

  const navBrand = nav.querySelector('.nav-brand'); // nav要素の子要素で、.nav-brand要素を取得
  const brandLink = navBrand.querySelector('.button'); // navBrand要素の子要素で、.button要素を取得
  if (brandLink) { // brandLink要素が存在する場合
    brandLink.className = ''; // brandLink要素のクラス名を空文字にする
    brandLink.closest('.button-container').className = ''; // brandLink要素の最も近い.button-container要素のクラス名を空文字にする
  }

  const navSections = nav.querySelector('.nav-sections'); // nav要素の子要素で、.nav-sections要素を取得
  if (navSections) { // navSections要素が存在する場合
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => { // navSections要素の子要素で、.default-content-wrapper > ul > li要素を取得
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop'); // 取得した要素の子要素で、ul要素が存在する場合は、取得した要素にnav-dropクラスを追加
      navSection.addEventListener('click', () => {  // 取得した要素にclickイベントを追加
        if (isDesktop.matches) { // デスクトップ用の画面幅の場合
          const expanded = navSection.getAttribute('aria-expanded') === 'true'; // 取得した要素のaria-expanded属性の値を取得
          toggleAllNavSections(navSections); // すべてのナビゲーションセクションの展開/折りたたみを切り替え
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true'); // 取得した要素のaria-expanded属性の値を切り替え
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');// div要素を作成
  hamburger.classList.add('nav-hamburger');// div要素にnav-hamburgerクラスを追加
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation"> <!-- ナビゲーションを開くボタン -->
      <span class="nav-hamburger-icon"></span> <!-- ハンバーガーアイコン -->
    </button>`;// div要素の中身を定義
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));// div要素にclickイベントを追加
  nav.prepend(hamburger);// nav要素の先頭にdiv要素を追加
  nav.setAttribute('aria-expanded', 'false');// nav要素にaria-expanded属性を追加
  // prevent mobile nav behavior on window resize 
  toggleMenu(nav, navSections, isDesktop.matches);// ナビゲーションを展開/折りたたみ
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));// デスクトップ用の画面幅の変更を監視して、ナビゲーションを展開/折りたたみ

  const navWrapper = document.createElement('div');// div要素を作成
  navWrapper.className = 'nav-wrapper';// div要素にnav-wrapperクラスを追加
  navWrapper.append(nav);// div要素にnav要素を追加
  block.append(navWrapper);// block要素にdiv要素を追加
}

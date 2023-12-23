import { getMetadata } from '../../scripts/aem.js'; // aem.jsからgetMetadata関数をインポート
import { loadFragment } from '../fragment/fragment.js'; // fragment.jsからloadFragment関数をインポート

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) { // フッターの装飾を行う関数
  const footerMeta = getMetadata('footer'); // フッターのメタデータからfooterのパスを取得
  block.textContent = ''; // block要素のテキストを削除

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer'; // footerのパスが存在する場合は、footerのパスを取得。そうでない場合は、/footerを取得
  const fragment = await loadFragment(footerPath); // footerのパスを引数にして、loadFragment関数を実行。戻り値をfragmentに代入

  // decorate footer DOM
  const footer = document.createElement('div'); // div要素を作成
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild); // fragment要素の最初の子要素が存在する場合は、footer要素に追加

  block.append(footer); // block要素の末尾にfooter要素を追加
}

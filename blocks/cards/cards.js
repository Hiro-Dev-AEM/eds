/* aem.jsからcreateOptimizedPicture関数をインポート */
import { createOptimizedPicture } from '../../scripts/aem.js';

/* decorateという関数をエクスポート。この関数はHTMLブロックを引数として受け取る */
export default function decorate(block) {
  /* change to ul, li */
  /* 新しいul要素を作成 */
  const ul = document.createElement('ul');
  /* 引数で受け取ったブロックの子要素をループ処理 */
  [...block.children].forEach((row) => {
    /* 新しいli要素を作成 */
    const li = document.createElement('li');
    /* rowの最初の子要素がなくなるまで、その子要素をliに追加 */
    while (row.firstElementChild) li.append(row.firstElementChild);
    /* liの子要素をループ処理 */
    [...li.children].forEach((div) => {
      /* divの子要素が1つで、その子要素がpicture要素の場合、divのクラス名をcards-card-imageに変更 */
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      /* それ以外の場合はdivのクラス名をcards-card-bodyに変更 */
      else div.className = 'cards-card-body';
    });
    /* 作成したliをulに追加 */
    ul.append(li);
  });
  /* ul内のimg要素をループ処理、画像を最適化して、元のpicture要素と置き換える */
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  /* 元のブロックの内容をクリアして */
  block.textContent = '';
  /* 作成したulをブロックに追加 */
  block.append(ul);
}

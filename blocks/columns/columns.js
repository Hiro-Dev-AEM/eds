// decorateという関数をエクスポート。この関数はHTMLブロックを引数として受け取る
export default function decorate(block) {
  // blockの最初の子要素の子要素を配列として取得
  const cols = [...block.firstElementChild.children];
  // blockのクラス名にcolumns-2-colsなどのクラス名を追加
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  // blockの子要素をループ処理
  [...block.children].forEach((row) => {
    // rowの子要素をループ処理
    [...row.children].forEach((col) => {
      // colの子要素が1つで、その子要素がpicture要素の場合、colのクラス名をcolumns-img-colに変更
      const pic = col.querySelector('picture');
      // picture要素が存在する場合
      if (pic) {
        // colのクラス名をcolumns-img-colに変更
        const picWrapper = pic.closest('div');
        // div要素が存在し、その子要素がpicture要素のみの場合
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          // colのクラス名をcolumns-img-colに変更
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}

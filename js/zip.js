/* EgePluginBuilder - ZIP export module */
(function (global) {
  'use strict';
  async function download(files, folderName) {
    if (!global.JSZip) throw new Error('ZIP kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.');
    const zip = new global.JSZip();
    const safeFolder = String(folderName || 'ege-eklentisi').replace(/[^a-zA-Z0-9_-]+/g, '-');
    const folder = zip.folder(safeFolder);
    Object.entries(files).forEach(([path, content]) => {
      if (path.startsWith('/') || path.split('/').includes('..')) {
        throw new Error('Güvenli olmayan dosya yolu: ' + path);
      }
      folder.file(path, content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFolder + '.zip';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  global.EgeZip = { download };
})(window);

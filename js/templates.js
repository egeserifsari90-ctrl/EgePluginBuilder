/* EgePluginBuilder - proje şablonları */
(function (global) {
  'use strict';
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function base(data) {
    const name = escape(data.name), desc = escape(data.description);
    const id = String(data.id).toLowerCase().replace(/[^a-z0-9-]/g,'-');
    const files = {
      'index.html': `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><link rel="stylesheet" href="style.css"></head>
<body><main><h1>${name}</h1><p>${desc}</p><button id="action">Başlat</button><p id="result" aria-live="polite"></p></main><script src="app.js"></script></body></html>`,
      'style.css': 'body{font:16px system-ui;margin:0;padding:32px;background:#101827;color:#f1f5ff}main{max-width:680px;margin:auto}button{padding:10px 16px;border:0;border-radius:8px;background:#83a0ff;color:#101827;font-weight:700}',
      'app.js': "document.getElementById('action').addEventListener('click',()=>{document.getElementById('result').textContent='Merhaba! Eklentin çalışıyor.';});"
    };
    if (data.includeManifest) files['manifest.json'] = JSON.stringify({id,name:data.name,version:'1.0.0',description:data.description,format:'ege-plugin-project'},null,2);
    return files;
  }
  function popup(data) {
    const f=base(data);
    f['popup.html']=f['index.html'].replace('style.css','popup.css').replace('app.js','popup.js');
    delete f['index.html']; delete f['style.css']; delete f['app.js'];
    f['popup.css']='body{min-width:280px;padding:16px;font:14px system-ui;background:#101827;color:#fff}button{padding:8px 12px;border:0;border-radius:7px}';
    f['popup.js']="document.getElementById('action').addEventListener('click',()=>{document.getElementById('result').textContent='Popup çalışıyor.';});";
    return f;
  }
  function content(data) {
    const f=base(data);
    f['content.js']="(() => { console.info('Eklenti içerik betiği yüklendi.'); /* Sayfa DOM işlemlerini buraya ekle. */ })();";
    f['README.md']=(f['README.md']||'')+'\nİçerik betiği: content.js\n';
    return f;
  }
  global.EgeTemplates = { basic:base, popup, content };
})(window);

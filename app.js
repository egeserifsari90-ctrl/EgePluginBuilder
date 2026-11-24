(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let generatedFiles = {};
  let selectedPreview = '';
  $('year').textContent = new Date().getFullYear();

  const safeId = (value) => value.toLowerCase().trim().replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50);
  const escapeHtml = (value) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function buildFiles(data) {
    const files = {};
    files['plugin.js'] = data.template === 'content'
      ? `// ${data.name} - sayfa içeriği betiği\n(() => {\n  console.log('${data.name} etkin.');\n  // Kendi sayfa içi özelliklerini buraya ekle.\n})();\n`
      : `// ${data.name} - eklenti başlangıç dosyası\nexport function activate() {\n  console.log('${data.name} etkin.');\n}\n\nexport function deactivate() {\n  console.log('${data.name} devre dışı.');\n}\n`;
    files['index.html'] = data.template === 'popup'
      ? `<!doctype html>\n<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.name}</title><link rel="stylesheet" href="popup.css"></head><body><main><h1>${data.name}</h1><p>${data.description}</p><button id="action">Başlat</button><p id="result" aria-live="polite"></p></main><script src="popup.js"></script></body></html>\n`
      : `<!doctype html>\n<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${data.name}</title><link rel="stylesheet" href="style.css"></head><body><main><h1>${data.name}</h1><p>${data.description}</p><button id="action">Dene</button><p id="result" aria-live="polite"></p></main><script type="module" src="plugin.js"></script></body></html>\n`;
    files['style.css'] = `body{font:16px system-ui,sans-serif;margin:0;padding:32px;background:#101827;color:#f1f5ff}main{max-width:640px;margin:auto}button{padding:10px 16px;border:0;border-radius:8px;background:#83a0ff;color:#101827;font-weight:700;cursor:pointer}\n`;
    if (data.template === 'popup') files['popup.js'] = `document.getElementById('action').addEventListener('click',()=>{document.getElementById('result').textContent='Merhaba! ${data.name} çalışıyor.';});\n`;
    if (data.includeManifest) files['manifest.json'] = JSON.stringify({id:data.id,name:data.name,version:'1.0.0',description:data.description,format:'ege-plugin-project',note:'Bu genel proje manifestidir; tarayıcı/uygulama eklenti manifesti yerine geçmez.'},null,2)+'\n';
    if (data.includeReadme) files['README.md'] = `# ${data.name}\n\n${data.description}\n\n## Dosyalar\n- \`index.html\`: Başlangıç arayüzü\n- \`plugin.js\`: JavaScript başlangıç kodu\n- \`style.css\`: Stil dosyası\n\n## Çalıştırma\nDosyaları bir klasöre çıkar ve bir yerel web sunucusu üzerinden \`index.html\` dosyasını aç. ES module kullanan tarayıcılarda doğrudan file:// yerine yerel sunucu kullan.\n\n## Lisans\n${data.license}\n\n> Bu proje genel bir başlangıç şablonudur. Hedef platformun resmi eklenti API'si ve güvenlik izinleri ayrıca uygulanmalıdır.\n`;
    if (data.license === 'MIT') files['LICENSE'] = `MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${data.name}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.\n`;
    else if (data.license === 'Apache-2.0') files['LICENSE'] = 'Apache License 2.0 seçildi. Tam lisans metnini Apache Software Foundation resmi kaynağından ekleyin: https://www.apache.org/licenses/LICENSE-2.0\n';
    return files;
  }

  function renderFiles() {
    const list = $('fileList');
    list.innerHTML = '';
    Object.keys(generatedFiles).forEach(name => {
      const row = document.createElement('div');
      row.className = 'file-item';
      const left = document.createElement('span'); left.textContent = name;
      const right = document.createElement('span'); right.textContent = 'Hazır';
      row.append(left,right); list.append(row);
    });
    $('fileCount').textContent = Object.keys(generatedFiles).length + ' dosya';
    $('downloadBtn').disabled = false;
    $('previewBtn').disabled = false;
    selectedPreview = Object.keys(generatedFiles)[0] || '';
  }

  $('builderForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('projectName').value.trim();
    const id = safeId($('pluginId').value);
    if (!name || !id) { $('status').textContent = 'Proje adı ve geçerli eklenti kimliği gerekli.'; return; }
    $('pluginId').value = id;
    const data = {name,id,description:$('description').value.trim(),template:$('template').value,license:$('license').value,includeReadme:$('includeReadme').checked,includeManifest:$('includeManifest').checked};
    generatedFiles = buildFiles(data);
    renderFiles();
    $('status').textContent = 'Başarılı: ' + Object.keys(generatedFiles).length + ' dosya oluşturuldu.';
  });

  $('downloadBtn').addEventListener('click', async () => {
    if (!Object.keys(generatedFiles).length) return;
    if (!window.JSZip) { $('status').textContent = 'ZIP kütüphanesi yüklenemedi. İnternet bağlantını kontrol et.'; return; }
    const zip = new JSZip();
    const folder = zip.folder(safeId($('projectName').value) || 'ege-eklentisi');
    Object.entries(generatedFiles).forEach(([path,content]) => folder.file(path,content));
    $('status').textContent = 'ZIP hazırlanıyor…';
    try {
      const blob = await zip.generateAsync({type:'blob'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = (safeId($('projectName').value)||'ege-eklentisi')+'.zip'; a.click();
      URL.revokeObjectURL(url);
      $('status').textContent = 'ZIP indirildi.';
    } catch (error) { $('status').textContent = 'ZIP oluşturulamadı: ' + error.message; }
  });

  $('previewBtn').addEventListener('click', () => {
    if (!selectedPreview) return;
    const keys = Object.keys(generatedFiles);
    const currentIndex = keys.indexOf(selectedPreview);
    selectedPreview = keys[(currentIndex + 1) % keys.length];
    $('preview').hidden = false;
    $('preview').textContent = '// ' + selectedPreview + '\n\n' + generatedFiles[selectedPreview];
    $('previewBtn').textContent = 'Sonraki dosya: ' + selectedPreview;
  });

  $('resetBtn').addEventListener('click', () => {
    $('builderForm').reset(); generatedFiles = {}; selectedPreview = '';
    $('fileList').innerHTML = '<div class="empty">Henüz dosya yok. Önce yukarıdaki formu doldur.</div>';
    $('fileCount').textContent = 'Henüz oluşturulmadı';
    $('downloadBtn').disabled = true; $('previewBtn').disabled = true; $('preview').hidden = true;
    $('previewBtn').textContent = 'Önizlemeyi göster'; $('status').textContent = 'Form sıfırlandı.';
  });
})();
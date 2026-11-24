/* EgePluginBuilder - başlangıç şablonları */
(function (global) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function common(data) {
    const name=esc(data.name), desc=esc(data.description);
    const files={
      'index.html':`<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><link rel="stylesheet" href="style.css"></head><body><main><h1>${name}</h1><p>${desc}</p><button id="action">Başlat</button><p id="result" aria-live="polite"></p></main><script src="app.js"></script></body></html>`,
      'style.css':'body{font:16px system-ui;margin:0;padding:32px;background:#101827;color:#f1f5ff}main{max-width:680px;margin:auto}button{padding:10px 16px;border:0;border-radius:8px;background:#83a0ff;color:#101827;font-weight:700}',
      'app.js':"document.getElementById('action').addEventListener('click',()=>{document.getElementById('result').textContent='Merhaba! Eklentin çalışıyor.';});"
    };
    if(data.includeManifest) files['project.json']=JSON.stringify({id:data.id,name:data.name,version:'1.0.0',description:data.description,format:'ege-plugin-project'},null,2);
    return files;
  }
  function popup(data) {
    const f=common(data);
    f['popup.html']=f['index.html'].replace('style.css','popup.css').replace('app.js','popup.js');
    delete f['index.html']; delete f['style.css']; delete f['app.js'];
    f['popup.css']='body{min-width:280px;padding:16px;font:14px system-ui;background:#101827;color:#fff}button{padding:8px 12px;border:0;border-radius:7px}';
    f['popup.js']="document.getElementById('action').addEventListener('click',()=>{document.getElementById('result').textContent='Popup çalışıyor.';});";
    return f;
  }
  function content(data) {
    const f=common(data);
    delete f['index.html']; delete f['app.js']; delete f['style.css'];
    f['content.js']="(() => { console.info('İçerik betiği yüklendi.'); /* Sayfa DOM işlemlerini buraya ekleyin. */ })();";
    return f;
  }
  function chrome(data) {
    const f=popup(data);
    f['manifest.json']=JSON.stringify({
      manifest_version:3,
      name:String(data.name).slice(0,45),
      version:'1.0.0',
      description:String(data.description).slice(0,132),
      action:{default_popup:'popup.html'}
    },null,2);
    return f;
  }
  function webExtension(data) {
    const f=popup(data);
    f['manifest.json']=JSON.stringify({
      manifest_version:2,
      name:String(data.name).slice(0,45),
      version:'1.0',
      description:String(data.description).slice(0,132),
      browser_action:{default_popup:'popup.html'}
    },null,2);
    return f;
  }
  function capcutKit(data) {
    const project = esc(data.name);
    const brief = [
      '# CapCut düzenleme paketi: ' + data.name,
      '',
      '## Proje bilgisi',
      '- Proje: ' + data.name,
      '- Açıklama: ' + (data.description || 'Belirtilmedi'),
      '',
      '## Düzenleme akışı',
      '1. CapCut Web üzerinde yeni video projesi açın.',
      '2. Kendi video ve görsel dosyalarınızı içe aktarın.',
      '3. timeline.csv dosyasındaki sahne sırasını izleyerek klipleri zaman çizelgesine yerleştirin.',
      '4. captions.srt dosyasını altyazı olarak içe aktarın veya metinleri elle ekleyin.',
      '5. Ses seviyelerini, geçişleri ve çıktı oranını CapCut içinde kontrol edin.',
      '',
      '## Not',
      'Bu paket bir CapCut eklentisi veya CapCut API bağlantısı değildir. CapCut projesini otomatik açmaz ya da değiştirmez; düzenleme için yardımcı dosyalar üretir.'
    ].join('\\n');
    const timeline = [
      'scene,start_seconds,end_seconds,visual,onscreen_text,audio_notes',
      '1,0,5,"Açılış görüntüsü","Başlık","Müzik yumuşak başlasın"',
      '2,5,12,"Ana görüntü","Ana mesaj","Konuşma net duyulsun"',
      '3,12,18,"Detay görüntüsü","Kısa vurgu","Geçişi kontrol et"',
      '4,18,23,"Kapanış görüntüsü","Takip et / Sonuç","Müzik yavaşça bitsin"'
    ].join('\\n');
    const captions = [
      '1',
      '00:00:00,000 --> 00:00:05,000',
      '[Açılış başlığı]',
      '',
      '2',
      '00:00:05,000 --> 00:00:12,000',
      '[Ana mesaj]',
      '',
      '3',
      '00:00:12,000 --> 00:00:18,000',
      '[Kısa vurgu]',
      '',
      '4',
      '00:00:18,000 --> 00:00:23,000',
      '[Kapanış metni]',
      ''
    ].join('\\n');
    return {
      'README.md': brief,
      'edit-plan/timeline.csv': timeline,
      'edit-plan/captions.srt': captions,
      'edit-plan/asset-notes.md': '# Medya dosyaları\\n\\nKullanacağınız video, fotoğraf ve ses dosyalarını bu klasöre ekleyin. Bu araç medya dosyalarınızı yüklemez veya işlemez.\\n',
      'edit-plan/export-checklist.md': '# Dışa aktarma kontrol listesi\\n\\n- [ ] En-boy oranı doğru\\n- [ ] Altyazılar okunaklı\\n- [ ] Ses dengesi kontrol edildi\\n- [ ] Başlangıç ve bitiş izlendi\\n- [ ] Çıktı çözünürlüğü seçildi\\n'
    };
  }
  global.EgeTemplates={basic:common,popup,content,chrome,webExtension,capcutKit};
})(window);

(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let generatedFiles = {};
  let previewIndex = 0;
  $('year').textContent = new Date().getFullYear();

  function renderFiles() {
    const list=$('fileList'); list.replaceChildren();
    Object.keys(generatedFiles).forEach(name=>{
      const row=document.createElement('div'); row.className='file-item';
      const label=document.createElement('span'); label.textContent=name;
      const ready=document.createElement('span'); ready.textContent='Hazır';
      row.append(label,ready); list.append(row);
    });
    $('fileCount').textContent=Object.keys(generatedFiles).length+' dosya';
    $('downloadBtn').disabled=false; $('previewBtn').disabled=false;
    previewIndex=0;
  }

  $('builderForm').addEventListener('submit',event=>{
    event.preventDefault();
    const data={
      name:$('projectName').value.trim(),
      id:$('pluginId').value,
      description:$('description').value.trim(),
      template:$('template').value,
      license:$('license').value,
      includeReadme:$('includeReadme').checked,
      includeManifest:$('includeManifest').checked
    };
    const check=EgeBuilder.validate(data);
    if(!check.valid){$('status').textContent=check.errors.join(' ');return;}
    $('pluginId').value=check.id;
    try{
      generatedFiles=EgeBuilder.build(data);
      renderFiles();
      $('preview').hidden=true;
      $('previewBtn').textContent='Önizlemeyi göster';
      $('status').textContent='Başarılı: '+Object.keys(generatedFiles).length+' dosya oluşturuldu.';
    }catch(error){$('status').textContent='Hata: '+error.message;}
  });

  $('previewBtn').addEventListener('click',()=>{
    const names=Object.keys(generatedFiles);
    if(!names.length)return;
    const name=names[previewIndex%names.length];
    $('preview').hidden=false;
    $('preview').textContent='// '+name+'\n\n'+generatedFiles[name];
    previewIndex++;
    $('previewBtn').textContent=previewIndex>=names.length?'İlk dosyaya dön':'Sonraki dosyayı göster';
  });

  $('downloadBtn').addEventListener('click',async()=>{
    if(!Object.keys(generatedFiles).length)return;
    $('status').textContent='ZIP hazırlanıyor…';
    try{
      await EgeZip.download(generatedFiles,EgeBuilder.safeId($('projectName').value)||'ege-eklentisi');
      $('status').textContent='ZIP indirme işlemi başlatıldı.';
    }catch(error){$('status').textContent='ZIP hatası: '+error.message;}
  });

  $('resetBtn').addEventListener('click',()=>{
    $('builderForm').reset(); generatedFiles={}; previewIndex=0;
    $('fileList').innerHTML='<div class="empty">Henüz dosya yok. Önce yukarıdaki formu doldur.</div>';
    $('fileCount').textContent='Henüz oluşturulmadı';
    $('downloadBtn').disabled=true; $('previewBtn').disabled=true;
    $('preview').hidden=true; $('preview').textContent='';
    $('previewBtn').textContent='Önizlemeyi göster';
    $('status').textContent='Form sıfırlandı.';
  });
})();
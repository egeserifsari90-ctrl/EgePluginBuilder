/* EgePluginBuilder - dosya üretim ve doğrulama */
(function (global) {
  'use strict';
  const safeId = value => String(value || '').toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,50);
  function validate(input) {
    const errors=[];
    if(!String(input.name||'').trim()) errors.push('Proje adı gerekli.');
    if(!safeId(input.id)) errors.push('Geçerli bir eklenti kimliği gerekli.');
    if(!['basic','popup','content'].includes(input.template)) errors.push('Bilinmeyen şablon.');
    if(!['MIT','Apache-2.0','UNLICENSED'].includes(input.license)) errors.push('Geçersiz lisans seçimi.');
    return {valid:errors.length===0,errors,id:safeId(input.id)};
  }
  function build(input) {
    const check=validate(input);
    if(!check.valid) throw new Error(check.errors.join(' '));
    const data={...input,id:check.id,name:String(input.name).trim(),description:String(input.description||'').trim()};
    const maker=global.EgeTemplates[data.template];
    if(typeof maker!=='function') throw new Error('Şablon yüklenemedi.');
    const files=maker(data);
    if(data.includeReadme) files['README.md']=`# ${data.name}\n\n${data.description}\n\n## Çalıştırma\nBu genel başlangıç projesini hedef platformunuzun resmi kurallarına göre uyarlayın.\n\n## Lisans\n${data.license}\n`;
    if(data.license==='MIT') files['LICENSE']=`MIT License\n\nCopyright (c) ${new Date().getFullYear()} ${data.name}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.\n`;
    if(data.license==='UNLICENSED') delete files['LICENSE'];
    return files;
  }
  global.EgeBuilder={safeId,validate,build};
})(window);

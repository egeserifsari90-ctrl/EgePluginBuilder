const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = { console, window: {}, Date, JSON, String, Object, Array };
vm.createContext(context);
for (const file of ['js/templates.js', 'js/builder.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const builder = context.window.EgeBuilder;
assert.ok(builder);
assert.ok(context.window.EgeTemplates);

const base = {
  name: 'Ornek Eklenti',
  id: 'ornek-eklenti',
  description: 'Test aciklamasi',
  license: 'MIT',
  includeReadme: true,
  includeManifest: true
};

for (const template of ['basic', 'popup', 'content', 'chrome', 'webExtension']) {
  const files = builder.build({ ...base, template });
  assert.ok(Object.keys(files).length > 0, template + ' outputs files');
  assert.ok(files['README.md'], template + ' includes README');
  assert.ok(files['LICENSE'], template + ' includes MIT license');
}

const chromeFiles = builder.build({ ...base, template: 'chrome' });
const chromeManifest = JSON.parse(chromeFiles['manifest.json']);
assert.equal(chromeManifest.manifest_version, 3);
assert.equal(chromeManifest.action.default_popup, 'popup.html');
assert.ok(chromeFiles['popup.html']);
assert.ok(chromeFiles['popup.js']);

const webFiles = builder.build({ ...base, template: 'webExtension' });
const webManifest = JSON.parse(webFiles['manifest.json']);
assert.equal(webManifest.manifest_version, 2);
assert.equal(webManifest.browser_action.default_popup, 'popup.html');

const popupFiles = builder.build({ ...base, template: 'popup' });
assert.ok(popupFiles['popup.html'] && popupFiles['popup.js'] && popupFiles['popup.css']);

const contentFiles = builder.build({ ...base, template: 'content' });
assert.ok(contentFiles['content.js']);
assert.equal(contentFiles['index.html'], undefined);

assert.equal(builder.validate({ ...base, id: ' !!! ' }).valid, false);
assert.equal(builder.safeId('Ege Şerif 2026'), 'ege-serif-2026');
const noLicense = builder.build({ ...base, template: 'basic', license: 'UNLICENSED' });
assert.equal(noLicense['LICENSE'], undefined);

console.log('PASS: template, manifest, validation and license tests passed.');

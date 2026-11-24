const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const context = {
  console,
  window: {},
  Date,
  JSON,
  String,
  Object,
  Array,
};
vm.createContext(context);

for (const file of ['js/templates.js', 'js/builder.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}

const builder = context.window.EgeBuilder;
const templates = context.window.EgeTemplates;
assert.ok(builder, 'EgeBuilder global is defined');
assert.ok(templates, 'EgeTemplates global is defined');

const defaults = {
  name: 'Örnek Eklenti',
  id: 'ornek-eklenti',
  description: 'Smoke test açıklaması',
  license: 'MIT',
  includeReadme: true,
  includeManifest: true,
};

for (const template of ['basic', 'popup', 'content', 'chrome', 'webExtension']) {
  const files = builder.build({ ...defaults, template });
  assert.ok(files && typeof files === 'object', template + ' returns files');
  assert.ok(Object.keys(files).length > 0, template + ' has files');
  assert.ok(files['manifest.json'], template + ' has manifest');
  assert.ok(files['LICENSE'], template + ' has MIT license');
  assert.ok(files['README.md'], template + ' has README');
}

const chrome = JSON.parse(builder.build({ ...defaults, template: 'chrome' })['manifest.json']);
assert.equal(chrome.manifest_version, 3, 'Chrome template emits Manifest V3');
assert.equal(chrome.action.default_popup, 'popup.html');

const webExt = JSON.parse(builder.build({ ...defaults, template: 'webExtension' })['manifest.json']);
assert.equal(webExt.manifest_version, 2, 'generic WebExtension template emits Manifest V2');

const popup = builder.build({ ...defaults, template: 'popup' });
assert.ok(popup['popup.html']);
assert.ok(popup['popup.js']);
assert.ok(popup['popup.css']);

const content = builder.build({ ...defaults, template: 'content' });
assert.ok(content['content.js']);

const bad = builder.validate({ ...defaults, id: ' !!! ' });
assert.equal(bad.valid, false, 'invalid id is rejected');

const unicodeId = builder.safeId('Ege Şerif 2026');
assert.equal(unicodeId, 'ege-serif-2026', 'unicode id is normalized');

const noLicense = builder.build({ ...defaults, template: 'basic', license: 'UNLICENSED' });
assert.equal(noLicense['LICENSE'], undefined, 'unlicensed project omits LICENSE');

console.log('PASS: all generator smoke tests passed.');

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validMapsLocation,homepageAdditions,locationMapEmbed} from '../apps/web/src/lib/magasin.ts';

test('magasin links are restricted to Google Maps locations, including actual share-link shapes',()=>{
  for(const value of ['https://www.google.com/maps?q=Taza','https://www.google.com/maps/dir/?api=1&destination=Taza','https://www.google.com/maps/place/Taza/','https://maps.google.com/?q=Taza','https://maps.app.goo.gl/ApprovedPin','https://maps.app.goo.gl/ApprovedPin?g_st=iw','https://goo.gl/maps/ApprovedPin'])assert.equal(validMapsLocation(value),true,value);
  for(const value of ['','javascript:alert(1)','http://www.google.com/maps?q=x','https://evil.example/maps?q=x','https://www.google.com.evil.example/maps?q=x','https://evil@www.google.com/maps?q=x','https://www.google.com:443/maps?q=x','https://www.google.com/url?q=x','https://www.google.com/maps?q=x&continue=https://evil.example','https://www.google.com/maps','https://maps.app.goo.gl/Pin?url=https://evil.example','https://www.google.com/maps?q=x#redirect','https://www.google.com/maps?q=x%0d%0a'])assert.equal(validMapsLocation(value),false,value);
});

test('simple map uses the explicit store pin rather than the Google camera centre',()=>{
  const embed=locationMapEmbed('https://www.google.com/maps/place/Shop/@34.1916673,-4.2582115,1877m/data=!3m6!3d34.1868599!4d-4.2459147');
  assert.equal(new URL(embed).searchParams.get('marker'),'34.1868599,-4.2459147');
  assert.equal(new URL(embed).origin,'https://www.openstreetmap.org');
  assert.equal(new URL(locationMapEmbed('https://www.google.com/maps/dir/?api=1&destination=34.1868599,-4.2459147')).searchParams.get('marker'),'34.1868599,-4.2459147');
  assert.equal(new URL(locationMapEmbed('https://www.google.com/maps?q=0,0')).searchParams.get('marker'),'0,0');
  for(const value of ['https://www.google.com/maps/place/Shop/@34,-4,10z','https://maps.app.goo.gl/ApprovedPin','https://www.google.com/maps?q=Taza','https://www.google.com/maps?q=91,0','https://www.google.com/maps?q=0,181','https://evil.example/maps?q=34,-4','https://www.google.com/maps/dir/A/B/data=!3d34!4d-4!3d35!4d-5'])assert.equal(locationMapEmbed(value),null,value);
});

test('all homepage addition labels are present in French English and Arabic',()=>{
  assert.deepEqual(Object.keys(homepageAdditions),['fr','en','ar']);
  for(const copy of Object.values(homepageAdditions))assert.ok(Object.values(copy).every(value=>typeof value==='string'&&value.length>0));
});

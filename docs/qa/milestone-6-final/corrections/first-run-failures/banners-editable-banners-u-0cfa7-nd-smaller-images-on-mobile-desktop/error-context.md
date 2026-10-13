# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: banners.spec.ts >> editable banners use high resolution on desktop and smaller images on mobile
- Location: tests\banners.spec.ts:5:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=f28e1]:
  - generic [ref=f28e2]:
    - link "انتقل إلى المحتوى" [ref=f28e3] [cursor=pointer]:
      - /url: "#main"
    - banner [ref=f28e4]:
      - generic [ref=f28e5]:
        - link "TIME STONE MARBRE & PIERRE" [ref=f28e6] [cursor=pointer]:
          - /url: /ar
          - generic [ref=f28e7]:
            - generic [ref=f28e10]: TIME STONE
            - generic [ref=f28e11]: MARBRE & PIERRE
        - generic [ref=f28e12]:
          - generic [ref=f28e13]:
            - generic [ref=f28e18]: اختر اللغة
            - combobox "اختر اللغة" [ref=f28e19] [cursor=pointer]:
              - option "Français"
              - option "English"
              - option "العربية" [selected]
          - button "افتح القائمة" [ref=f28e20] [cursor=pointer]
    - main [ref=f28e23]:
      - region [ref=f28e24]:
        - generic [ref=f28e26]:
          - paragraph [ref=f28e27]: أحجارنا
          - heading "تشكيلة الحجر الطبيعي" [level=1] [ref=f28e28]
          - paragraph [ref=f28e29]: خامات وألوان وإلهام معماري. تشكيلة توضيحية لاكتشاف إمكانات الحجر.
          - text: صورة توضيحية · مؤقتة
      - region "تشكيلة الحجر الطبيعي" [ref=f28e31]:
        - generic [ref=f28e32]:
          - search [ref=f28e33]:
            - generic [ref=f28e34]: ابحث عن حجر
            - searchbox "ابحث عن حجر" [ref=f28e35]
            - button "ابحث عن حجر" [ref=f28e36] [cursor=pointer]: ⌕
          - button "التصفية" [ref=f28e37] [cursor=pointer]:
            - text: التصفية
            - generic [aria-hidden] [ref=f28e38]: ☷
        - navigation "الفئات" [ref=f28e39]:
          - link "كل الأحجار" [ref=f28e40] [cursor=pointer]:
            - /url: /ar/products#results
          - link "الحجر الجيري" [ref=f28e41] [cursor=pointer]:
            - /url: /ar/products?category=limestone#results
          - link "الرخام" [ref=f28e42] [cursor=pointer]:
            - /url: /ar/products?category=marble#results
          - link "البلاط" [ref=f28e43] [cursor=pointer]:
            - /url: /ar/products?category=tiles#results
          - link "الكتل" [ref=f28e44] [cursor=pointer]:
            - /url: /ar/products?category=blocks#results
          - link "حسب الطلب" [ref=f28e45] [cursor=pointer]:
            - /url: /ar/products?category=custom#results
        - generic [ref=f28e46]:
          - paragraph [ref=f28e47]: 18 عينات
          - generic [ref=f28e48]:
            - generic [ref=f28e49]: الترتيب حسب
            - combobox "الترتيب حسب" [ref=f28e50]:
              - option "المختارات" [selected]
              - option "أحدث العينات"
              - option "الاسم تصاعديًا"
              - option "الاسم تنازليًا"
            - button "تطبيق" [ref=f28e51] [cursor=pointer]
        - navigation "التصفية"
        - paragraph [ref=f28e52]: "عينات مؤقتة: الصور وتصنيفات التصفية توضيحية. المنتجات والتشطيبات والخصائص بحاجة إلى تأكيد. لا نعلن عن توفر تجاري."
        - generic [ref=f28e53]:
          - article [ref=f28e54]:
            - 'link "عرض العينة : الحجر الجيري · 01" [ref=f28e55] [cursor=pointer]':
              - /url: /ar/products/sample-1
              - generic [ref=f28e56]:
                - img "صورة توضيحية مؤقتة" [ref=f28e57]
                - generic [ref=f28e58]: عينة توضيحية
              - generic [ref=f28e59]:
                - heading "الحجر الجيري · 01" [level=2] [ref=f28e60]
                - paragraph [ref=f28e61]: الحجر الجيري
                - generic [aria-hidden] [ref=f28e62]: ←
          - article [ref=f28e63]:
            - 'link "عرض العينة : الرخام · 02" [ref=f28e64] [cursor=pointer]':
              - /url: /ar/products/sample-2
              - generic [ref=f28e65]:
                - img "صورة توضيحية مؤقتة" [ref=f28e66]
                - generic [ref=f28e67]: عينة توضيحية
              - generic [ref=f28e68]:
                - heading "الرخام · 02" [level=2] [ref=f28e69]
                - paragraph [ref=f28e70]: الرخام
                - generic [aria-hidden] [ref=f28e71]: ←
          - article [ref=f28e72]:
            - 'link "عرض العينة : البلاط · 03" [ref=f28e73] [cursor=pointer]':
              - /url: /ar/products/sample-3
              - generic [ref=f28e74]:
                - img "صورة توضيحية مؤقتة" [ref=f28e75]
                - generic [ref=f28e76]: عينة توضيحية
              - generic [ref=f28e77]:
                - heading "البلاط · 03" [level=2] [ref=f28e78]
                - paragraph [ref=f28e79]: البلاط
                - generic [aria-hidden] [ref=f28e80]: ←
          - article [ref=f28e81]:
            - 'link "عرض العينة : الكتل الحجرية · 04" [ref=f28e82] [cursor=pointer]':
              - /url: /ar/products/sample-4
              - generic [ref=f28e83]:
                - img "صورة توضيحية مؤقتة" [ref=f28e84]
                - generic [ref=f28e85]: عينة توضيحية
              - generic [ref=f28e86]:
                - heading "الكتل الحجرية · 04" [level=2] [ref=f28e87]
                - paragraph [ref=f28e88]: الكتل
                - generic [aria-hidden] [ref=f28e89]: ←
          - article [ref=f28e90]:
            - 'link "عرض العينة : حسب الطلب · 05" [ref=f28e91] [cursor=pointer]':
              - /url: /ar/products/sample-5
              - generic [ref=f28e92]:
                - img "صورة توضيحية مؤقتة" [ref=f28e93]
                - generic [ref=f28e94]: عينة توضيحية
              - generic [ref=f28e95]:
                - heading "حسب الطلب · 05" [level=2] [ref=f28e96]
                - paragraph [ref=f28e97]: حسب الطلب
                - generic [aria-hidden] [ref=f28e98]: ←
          - article [ref=f28e99]:
            - 'link "عرض العينة : الحجر الجيري · 06" [ref=f28e100] [cursor=pointer]':
              - /url: /ar/products/sample-6
              - generic [ref=f28e101]:
                - img "صورة توضيحية مؤقتة" [ref=f28e102]
                - generic [ref=f28e103]: عينة توضيحية
              - generic [ref=f28e104]:
                - heading "الحجر الجيري · 06" [level=2] [ref=f28e105]
                - paragraph [ref=f28e106]: الحجر الجيري
                - generic [aria-hidden] [ref=f28e107]: ←
          - article [ref=f28e108]:
            - 'link "عرض العينة : الرخام · 07" [ref=f28e109] [cursor=pointer]':
              - /url: /ar/products/sample-7
              - generic [ref=f28e110]:
                - img "صورة توضيحية مؤقتة" [ref=f28e111]
                - generic [ref=f28e112]: عينة توضيحية
              - generic [ref=f28e113]:
                - heading "الرخام · 07" [level=2] [ref=f28e114]
                - paragraph [ref=f28e115]: الرخام
                - generic [aria-hidden] [ref=f28e116]: ←
          - article [ref=f28e117]:
            - 'link "عرض العينة : البلاط · 08" [ref=f28e118] [cursor=pointer]':
              - /url: /ar/products/sample-8
              - generic [ref=f28e119]:
                - img "صورة توضيحية مؤقتة" [ref=f28e120]
                - generic [ref=f28e121]: عينة توضيحية
              - generic [ref=f28e122]:
                - heading "البلاط · 08" [level=2] [ref=f28e123]
                - paragraph [ref=f28e124]: البلاط
                - generic [aria-hidden] [ref=f28e125]: ←
          - article [ref=f28e126]:
            - 'link "عرض العينة : الكتل الحجرية · 09" [ref=f28e127] [cursor=pointer]':
              - /url: /ar/products/sample-9
              - generic [ref=f28e128]:
                - img "صورة توضيحية مؤقتة" [ref=f28e129]
                - generic [ref=f28e130]: عينة توضيحية
              - generic [ref=f28e131]:
                - heading "الكتل الحجرية · 09" [level=2] [ref=f28e132]
                - paragraph [ref=f28e133]: الكتل
                - generic [aria-hidden] [ref=f28e134]: ←
          - article [ref=f28e135]:
            - 'link "عرض العينة : حسب الطلب · 10" [ref=f28e136] [cursor=pointer]':
              - /url: /ar/products/sample-10
              - generic [ref=f28e137]:
                - img "صورة توضيحية مؤقتة" [ref=f28e138]
                - generic [ref=f28e139]: عينة توضيحية
              - generic [ref=f28e140]:
                - heading "حسب الطلب · 10" [level=2] [ref=f28e141]
                - paragraph [ref=f28e142]: حسب الطلب
                - generic [aria-hidden] [ref=f28e143]: ←
          - article [ref=f28e144]:
            - 'link "عرض العينة : الحجر الجيري · 11" [ref=f28e145] [cursor=pointer]':
              - /url: /ar/products/sample-11
              - generic [ref=f28e146]:
                - img "صورة توضيحية مؤقتة" [ref=f28e147]
                - generic [ref=f28e148]: عينة توضيحية
              - generic [ref=f28e149]:
                - heading "الحجر الجيري · 11" [level=2] [ref=f28e150]
                - paragraph [ref=f28e151]: الحجر الجيري
                - generic [aria-hidden] [ref=f28e152]: ←
          - article [ref=f28e153]:
            - 'link "عرض العينة : الرخام · 12" [ref=f28e154] [cursor=pointer]':
              - /url: /ar/products/sample-12
              - generic [ref=f28e155]:
                - img "صورة توضيحية مؤقتة" [ref=f28e156]
                - generic [ref=f28e157]: عينة توضيحية
              - generic [ref=f28e158]:
                - heading "الرخام · 12" [level=2] [ref=f28e159]
                - paragraph [ref=f28e160]: الرخام
                - generic [aria-hidden] [ref=f28e161]: ←
        - navigation "الصفحة" [ref=f28e162]:
          - generic [ref=f28e163]:
            - text: الصفحة
            - generic [ref=f28e164]: 1 / 2
          - link "التالي" [ref=f28e165] [cursor=pointer]:
            - /url: /ar/products?page=2#results
      - generic [ref=f28e168]:
        - heading "هل لديك فكرة خاصة؟" [level=2] [ref=f28e169]
        - paragraph [ref=f28e170]: اكتشف إمكانات الحجر لمشروعك. تبقى الأشكال والتشطيبات الفعلية بانتظار التأكيد.
        - link "حضّر مشروعك" [ref=f28e171] [cursor=pointer]:
          - /url: /ar/quote
          - text: حضّر مشروعك
          - generic [aria-hidden] [ref=f28e172]: ←
      - generic [ref=f28e173]:
        - figure "الخامة عينة توضيحية" [ref=f28e174]:
          - generic [ref=f28e176]:
            - text: الخامة
            - generic [ref=f28e177]: عينة توضيحية
        - figure "الأشكال عينة توضيحية" [ref=f28e178]:
          - generic [ref=f28e180]:
            - text: الأشكال
            - generic [ref=f28e181]: عينة توضيحية
        - figure "مساحتك عينة توضيحية" [ref=f28e182]:
          - generic [ref=f28e184]:
            - text: مساحتك
            - generic [ref=f28e185]: عينة توضيحية
    - contentinfo [ref=f28e186]:
      - generic [ref=f28e187]:
        - generic [ref=f28e188]:
          - generic [ref=f28e191]: TIME STONE
          - generic [ref=f28e192]: MARBRE & PIERRE
        - paragraph [ref=f28e193]: "عينات مؤقتة: الصور وتصنيفات التصفية توضيحية. المنتجات والتشطيبات والخصائص بحاجة إلى تأكيد. لا نعلن عن توفر تجاري."
        - link "الرئيسية" [ref=f28e194] [cursor=pointer]:
          - /url: /ar
  - alert [ref=f28e195]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | const adminOrigin=process.env.QA_API_URL||'http://127.0.0.1:8000';
  3  | import { readFile, mkdir, writeFile } from 'node:fs/promises';
  4  | 
  5  | test('editable banners use high resolution on desktop and smaller images on mobile', async ({ page, request }) => {
  6  |   test.skip(!process.env.QA_ADMIN_LOCALE_CREDENTIALS, 'Requires a disposable local admin account.');
  7  |   test.setTimeout(180000);
  8  |   page.setDefaultTimeout(15000);
  9  |   const output = 'docs/qa/banners';
  10 |   await mkdir(output, { recursive: true });
  11 |   const account = JSON.parse(await readFile(process.env.QA_ADMIN_LOCALE_CREDENTIALS!, 'utf8'));
  12 |   const errors: string[] = [];
  13 |   const checks: unknown[] = [];
  14 |   page.on('pageerror', e => errors.push(e.message));
  15 |   await page.goto(adminOrigin+'/admin/login');
  16 |   await page.locator('input[type=email]').fill(account.email);
  17 |   await page.locator('input[type=password]').fill(account.password);
  18 |   await page.locator('button[type=submit]').last().click();
  19 |   await expect(page).toHaveURL(adminOrigin+'/admin');
  20 |   for (const [locale, label, upload] of [['fr', 'Gérer les bannières', 'Importer une image de bannière'], ['en', 'Manage banners', 'Upload banner image'], ['ar', 'إدارة صور البانر', 'رفع صورة بانر']]) {
  21 |     await page.goto(adminOrigin+'/admin');
  22 |     await page.locator('#admin-locale').selectOption(locale);
  23 |     await Promise.all([page.waitForNavigation(), page.locator('.admin-language-switcher button').click()]);
  24 |     await page.getByRole('link', { name: label, exact: true }).click();
  25 |     await expect(page).toHaveURL(/filters\[banners\]\[isActive\]=1/);
  26 |     await expect(page.getByText('catalogue-hero', { exact: true })).toBeVisible();
  27 |     expect(await page.locator('table img').count()).toBeGreaterThan(0);
  28 |     if (locale === 'ar') await page.screenshot({ path: `${output}/admin-banners-ar.png`, fullPage: true });
  29 |     const api = await request.get(`${adminOrigin}/api/v1/pages/shared?locale=${locale}`);
  30 |     expect(api.ok()).toBe(true);
  31 |     const section = (await api.json()).data.sections.find((s: {key: string}) => s.key === 'catalogue-hero');
  32 |     expect(section.image).toMatch(/\/media\/\d+\/banner$/);
  33 |     const listing = await page.getByText('catalogue-hero', { exact: true }).locator('xpath=ancestor::tr').locator('a').first().getAttribute('href');
  34 |     expect(listing).toBeTruthy();
  35 |     await page.goto(listing!);
  36 |     await expect(page.getByText(upload, { exact: true })).toBeVisible();
  37 |     for (const width of [390, 1536]) {
  38 |       await page.setViewportSize({ width, height: 900 });
  39 |       const requested: string[] = [];
  40 |       const listener = (r: {url(): string}) => requested.push(r.url());
  41 |       page.on('request', listener);
  42 |       await page.goto(`/${locale}/products`);
  43 |       const hero = page.locator('.catalogue-hero img');
  44 |       await expect(hero).toBeVisible();
  45 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  46 |       const src = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
  47 |       expect(src).toMatch(width < 768 ? /\/preview$/ : /\/banner$/);
> 48 |       if (width < 768) expect(requested.some(url => url.endsWith(new URL(section.image).pathname))).toBe(false);
     |                                                                                                     ^ Error: expect(received).toBe(expected) // Object.is equality
  49 |       page.off('request', listener);
  50 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  51 |       await page.screenshot({ path: `${output}/catalogue-${locale}-${width}.png`, fullPage: false });
  52 |       checks.push({ locale, width, currentImage: src });
  53 |     }
  54 |     for (const path of ['', '/about', '/applications', '/contact', '/quote']) {
  55 |       await page.goto(`/${locale}${path}`);
  56 |       const hero = page.locator(path ? '.page-hero img' : '.hero-art img');
  57 |       await expect(hero).toBeVisible();
  58 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  59 |       checks.push({ locale, page: path || '/', loaded: true });
  60 |     }
  61 |   }
  62 |   expect(errors).toEqual([]);
  63 |   await writeFile(`${output}/results.json`, JSON.stringify({ passed: true, checks, browserErrors: errors }, null, 2));
  64 | });
  65 | 
  66 | test('Application banners preserve the first gallery image at desktop and mobile sizes', async ({ page, request }) => {
  67 |   const list = await request.get(adminOrigin+'/api/v1/applications?locale=fr');
  68 |   expect(list.ok()).toBe(true);
  69 |   const slug = (await list.json()).data[0].slug;
  70 |   for (const locale of ['fr', 'en', 'ar']) {
  71 |     const api = await request.get(`${adminOrigin}/api/v1/applications/${slug}?locale=${locale}`);
  72 |     const image = new URL((await api.json()).data.gallery[0]).pathname;
  73 |     for (const width of [390, 1536]) {
  74 |       await page.setViewportSize({ width, height: 900 });
  75 |       await page.goto(`/${locale}/applications/${slug}`);
  76 |       const hero = page.locator('.page-hero img');
  77 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  78 |       const source = await hero.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
  79 |       expect(source).toBe(width < 768 ? image.replace(/\/(banner|texture)$/, '/preview') : image);
  80 |     }
  81 |   }
  82 | });
  83 | 
```
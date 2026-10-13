# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: banners.spec.ts >> editable banners use high resolution on desktop and smaller images on mobile
- Location: tests\banners.spec.ts:4:5

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('.hero-art img')

```

# Page snapshot

```yaml
- generic [active] [ref=f30e1]:
  - link "انتقل إلى المحتوى" [ref=f30e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=f30e3]:
    - generic [ref=f30e4]:
      - link "TIME STONE MARBRE & PIERRE" [ref=f30e5] [cursor=pointer]:
        - /url: /ar
        - generic [ref=f30e6]:
          - generic [ref=f30e9]: TIME STONE
          - generic [ref=f30e10]: MARBRE & PIERRE
      - navigation "استكشف" [ref=f30e11]:
        - link "الرئيسية" [ref=f30e12] [cursor=pointer]:
          - /url: /ar
        - link "التشكيلة" [ref=f30e13] [cursor=pointer]:
          - /url: /ar/products
        - link "الاستخدامات" [ref=f30e14] [cursor=pointer]:
          - /url: /ar/applications
        - link "من نحن" [ref=f30e15] [cursor=pointer]:
          - /url: /ar/about
        - link "المحجر" [ref=f30e16] [cursor=pointer]:
          - /url: /ar/about#quarry
        - link "التواصل" [ref=f30e17] [cursor=pointer]:
          - /url: /ar/contact
      - generic [ref=f30e18]:
        - generic [ref=f30e19]:
          - generic [ref=f30e24]: اختر اللغة
          - combobox "اختر اللغة" [ref=f30e25] [cursor=pointer]:
            - option "Français"
            - option "English"
            - option "العربية" [selected]
        - link "اطلب عرض سعر" [ref=f30e26] [cursor=pointer]:
          - /url: /ar/quote
  - main [ref=f30e30]:
    - region [ref=f30e31]:
      - navigation "استكشف" [ref=f30e34]:
        - link "01 الرئيسية" [ref=f30e35] [cursor=pointer]:
          - /url: "#home"
          - generic [ref=f30e36]: "01"
          - text: الرئيسية
        - link "02 التشكيلة" [ref=f30e37] [cursor=pointer]:
          - /url: "#collection"
          - generic [ref=f30e38]: "02"
          - text: التشكيلة
        - link "03 الاستخدامات" [ref=f30e39] [cursor=pointer]:
          - /url: "#applications"
          - generic [ref=f30e40]: "03"
          - text: الاستخدامات
        - link "04 المحجر" [ref=f30e41] [cursor=pointer]:
          - /url: "#quarry"
          - generic [ref=f30e42]: "04"
          - text: المحجر
        - link "05 من نحن" [ref=f30e43] [cursor=pointer]:
          - /url: "#about"
          - generic [ref=f30e44]: "05"
          - text: من نحن
      - generic [ref=f30e46]:
        - paragraph [ref=f30e47]: حجر طبيعي · المغرب
        - heading "حجر يتخطّى الزمن. لعمارة معاصرة." [level=1] [ref=f30e48]
        - paragraph [ref=f30e49]: ملمس فريد وألوان طبيعية. تخيّل مكانًا جديدًا للحجر في مشروعك المعماري القادم.
        - generic [ref=f30e50]:
          - link "اطلب عرض سعر" [ref=f30e51] [cursor=pointer]:
            - /url: "#collection"
          - generic [ref=f30e54]:
            - generic "نظرة أقرب إلى الخامة" [ref=f30e55]:
              - 'button "الخامة المختارة : الحجر الجيري · 01" [ref=f30e56] [cursor=pointer]'
              - 'button "الخامة المختارة : الرخام · 02" [ref=f30e57] [cursor=pointer]'
              - 'button "الخامة المختارة : البلاط · 03" [ref=f30e58] [cursor=pointer]'
            - generic [ref=f30e59]:
              - heading "جمال الحجر الجيري" [level=2] [ref=f30e60]
              - paragraph [ref=f30e61]: دراسة بصرية لخامة بألوان دافئة وملمس معدني طبيعي.
              - button "اكتشف الخامة" [ref=f30e62] [cursor=pointer]
          - button "استكشف الخامات" [ref=f30e65] [cursor=pointer]
      - generic [ref=f30e68]:
        - link "اكتشف المزيد" [ref=f30e69] [cursor=pointer]:
          - /url: "#collection"
        - generic [ref=f30e71]: صورة توضيحية · مؤقتة
    - region "حجر طبيعي · المغرب" [ref=f30e72]:
      - generic [ref=f30e73]:
        - generic [ref=f30e78]:
          - heading "حجر طبيعي" [level=2] [ref=f30e79]
          - paragraph [ref=f30e80]: البداية من الخامة
        - generic [ref=f30e85]:
          - heading "ألوان وملمس" [level=2] [ref=f30e86]
          - paragraph [ref=f30e87]: طابع متفرّد
        - generic [ref=f30e92]:
          - heading "أشكال متنوعة" [level=2] [ref=f30e93]
          - paragraph [ref=f30e94]: ألواح وكتل وبلاط
        - generic [ref=f30e99]:
          - heading "أفكار للمساحات" [level=2] [ref=f30e100]
          - paragraph [ref=f30e101]: للداخل والخارج
        - generic [ref=f30e106]:
          - heading "مشروعك" [level=2] [ref=f30e107]
          - paragraph [ref=f30e108]: تحديد الاحتياجات
        - generic [ref=f30e113]:
          - heading "تواصل مباشر" [level=2] [ref=f30e114]
          - paragraph [ref=f30e115]: بيانات قيد التأكيد
    - region [ref=f30e116]:
      - generic [ref=f30e117]:
        - generic [ref=f30e118]:
          - paragraph [ref=f30e119]: تشكيلتنا
          - heading "اكتشف جمال الحجر الطبيعي" [level=2] [ref=f30e120]
          - paragraph [ref=f30e121]: الحجر الجيري والرخام والأشكال المعمارية. بداية لاكتشاف إمكانات الخامة.
        - link "استكشف المختارات" [ref=f30e122] [cursor=pointer]:
          - /url: "#materials"
      - generic [ref=f30e125]:
        - link [ref=f30e126] [cursor=pointer]:
          - /url: /ar/products?category=limestone
          - img "الحجر الجيري" [ref=f30e128]
          - generic [ref=f30e130]:
            - heading "الحجر الجيري" [level=3] [ref=f30e131]
            - paragraph [ref=f30e132]: تشكيلة توضيحية
        - link [ref=f30e136] [cursor=pointer]:
          - /url: /ar/products?category=marble
          - img "الرخام" [ref=f30e138]
          - generic [ref=f30e140]:
            - heading "الرخام" [level=3] [ref=f30e141]
            - paragraph [ref=f30e142]: تشكيلة توضيحية
        - link [ref=f30e146] [cursor=pointer]:
          - /url: /ar/products?category=tiles
          - img "البلاط" [ref=f30e148]
          - generic [ref=f30e150]:
            - heading "البلاط" [level=3] [ref=f30e151]
            - paragraph [ref=f30e152]: تشكيلة توضيحية
        - link [ref=f30e156] [cursor=pointer]:
          - /url: /ar/products?category=blocks
          - img "الكتل" [ref=f30e158]
          - generic [ref=f30e160]:
            - heading "الكتل" [level=3] [ref=f30e161]
            - paragraph [ref=f30e162]: تشكيلة توضيحية
        - link [ref=f30e166] [cursor=pointer]:
          - /url: /ar/products?category=custom
          - img "حسب الطلب" [ref=f30e168]
          - generic [ref=f30e170]:
            - heading "حسب الطلب" [level=3] [ref=f30e171]
            - paragraph [ref=f30e172]: تشكيلة توضيحية
    - region [ref=f30e176]:
      - generic [ref=f30e177]:
        - img "صورة توضيحية لمحجر · الموقع غير مؤكد" [ref=f30e178]
        - generic [ref=f30e179]: صورة توضيحية لمحجر · الموقع غير مؤكد
      - generic [ref=f30e180]:
        - paragraph [ref=f30e181]: من المحجر إلى الخامة
        - heading "حكاية صاغها الحجر" [level=2] [ref=f30e182]
        - paragraph [ref=f30e183]: خامة أولية، وحرفة، وتحول. لمحة بصرية عن عالم الحجر، ريثما تتوفر صور تايم ستون وقصتها المعتمدة.
        - link "اكتشف الحرفة" [ref=f30e184] [cursor=pointer]:
          - /url: "#craft"
        - generic [ref=f30e187]:
          - generic [ref=f30e188]: اختيار الخامة
          - generic [ref=f30e192]: القطع والتناسب
          - generic [ref=f30e196]: تشطيب السطح
    - generic [ref=f30e200]:
      - generic [ref=f30e201]:
        - paragraph [ref=f30e202]: روح تايم ستون
        - heading "خامة طبيعية. ورؤية معمارية." [level=2] [ref=f30e203]
        - paragraph [ref=f30e204]: "صالة عرض تقرّب الحجر من مشروعك: اكتشف الملمس، وقارن الأشكال، واستعد لحوار حول احتياجاتك."
        - link "تخيّل مساحتك" [ref=f30e205] [cursor=pointer]:
          - /url: "#applications"
      - figure "صورة توضيحية · مؤقتة" [ref=f30e208]:
        - img "الواجهات الخارجية" [ref=f30e209]
    - generic [ref=f30e212]:
      - generic [ref=f30e214]:
        - paragraph [ref=f30e215]: دراسات للخامة
        - heading "الجمال يكمن في التفاصيل" [level=2] [ref=f30e216]
        - paragraph [ref=f30e217]: ثلاثة تصورات بصرية. سيتم تأكيد المنتجات والتشطيبات والأبعاد الفعلية مع تايم ستون.
      - generic [ref=f30e218]:
        - article [ref=f30e219]:
          - generic [ref=f30e220]:
            - img "صورة توضيحية مؤقتة" [ref=f30e221]
            - generic [ref=f30e222]: نموذج للعرض
          - generic [ref=f30e223]:
            - paragraph [ref=f30e224]: limestone
            - heading [level=3] [ref=f30e225]:
              - link "الحجر الجيري · 01" [ref=f30e226] [cursor=pointer]:
                - /url: /ar/products/sample-1
        - article [ref=f30e227]:
          - generic [ref=f30e228]:
            - img "صورة توضيحية مؤقتة" [ref=f30e229]
            - generic [ref=f30e230]: نموذج للعرض
          - generic [ref=f30e231]:
            - paragraph [ref=f30e232]: marble
            - heading [level=3] [ref=f30e233]:
              - link "الرخام · 02" [ref=f30e234] [cursor=pointer]:
                - /url: /ar/products/sample-2
        - article [ref=f30e235]:
          - generic [ref=f30e236]:
            - img "صورة توضيحية مؤقتة" [ref=f30e237]
            - generic [ref=f30e238]: نموذج للعرض
          - generic [ref=f30e239]:
            - paragraph [ref=f30e240]: tiles
            - heading [level=3] [ref=f30e241]:
              - link "البلاط · 03" [ref=f30e242] [cursor=pointer]:
                - /url: /ar/products/sample-3
    - generic [ref=f30e243]:
      - generic [ref=f30e244]:
        - paragraph [ref=f30e245]: الحرفة
        - heading "من الكتلة إلى المساحة" [level=2] [ref=f30e246]
        - paragraph [ref=f30e247]: تصور توضيحي لمراحل التحويل. تبقى تفاصيل التصنيع والتشطيبات المتاحة بانتظار التوثيق.
      - list [ref=f30e248]:
        - listitem [ref=f30e249]:
          - generic [ref=f30e250]: "01"
          - heading "اختيار الخامة" [level=3] [ref=f30e251]
        - listitem [ref=f30e254]:
          - generic [ref=f30e255]: "02"
          - heading "القطع والتناسب" [level=3] [ref=f30e256]
        - listitem [ref=f30e259]:
          - generic [ref=f30e260]: "03"
          - heading "تشطيب السطح" [level=3] [ref=f30e261]
        - listitem [ref=f30e264]:
          - generic [ref=f30e265]: "04"
          - heading "التفصيل المعماري" [level=3] [ref=f30e266]
    - generic [ref=f30e269]:
      - generic [ref=f30e271]:
        - paragraph [ref=f30e272]: الاستخدامات
        - heading "حجر لكل مساحة" [level=2] [ref=f30e273]
        - paragraph [ref=f30e274]: أفكار معمارية تساعدك على تصوّر مشروعك.
      - generic [ref=f30e275]:
        - link [ref=f30e276] [cursor=pointer]:
          - /url: /ar/applications/exterior-facades
          - img "الواجهات الخارجية" [ref=f30e277]
          - generic [ref=f30e278]: الواجهات الخارجية
        - link [ref=f30e281] [cursor=pointer]:
          - /url: /ar/applications/interior-flooring
          - img "الأرضيات الداخلية" [ref=f30e282]
          - generic [ref=f30e283]: الأرضيات الداخلية
        - link [ref=f30e286] [cursor=pointer]:
          - /url: /ar/applications/wall-cladding
          - img "كسوة الجدران" [ref=f30e287]
          - generic [ref=f30e288]: كسوة الجدران
        - link [ref=f30e291] [cursor=pointer]:
          - /url: /ar/applications/stairs
          - img "السلالم والدرجات" [ref=f30e292]
          - generic [ref=f30e293]: السلالم والدرجات
      - paragraph [ref=f30e296]: صورة توضيحية · مؤقتة
    - generic [ref=f30e298]:
      - generic [ref=f30e299]:
        - paragraph [ref=f30e300]: اختيار على بيّنة
        - heading "كل مشروع يبدأ بالأسئلة المناسبة." [level=2] [ref=f30e301]
        - paragraph [ref=f30e302]: الاستخدام والتشطيب والأبعاد هي أساس الاختيار. تُنشر الخصائص التقنية بعد التحقق منها.
      - list [ref=f30e303]:
        - listitem [ref=f30e304]:
          - generic [ref=f30e305]: "01"
          - text: كيف سيُستخدم الحجر؟
        - listitem [ref=f30e306]:
          - generic [ref=f30e307]: "02"
          - text: ما التشطيب المناسب لمساحتك؟
        - listitem [ref=f30e308]:
          - generic [ref=f30e309]: "03"
          - text: ما الأبعاد التي يحتاجها مشروعك؟
    - region [ref=f30e310]:
      - paragraph [ref=f30e311]: لنبنِ الخطوة القادمة
      - heading "مشروعك يبدأ هنا." [level=2] [ref=f30e312]
      - paragraph [ref=f30e313]: فكرة، أو خامة، أو احتياج خاص. جهّز الأبعاد والكميات وموقع التسليم لطلب عرض السعر لاحقًا.
      - paragraph [ref=f30e318]: سيتوفر نموذج عرض السعر وبيانات التواصل الرسمية بعد التأكيد. لا يُرسل هذا العرض أي طلبات.
  - complementary "نموذج للعرض" [ref=f30e319]:
    - paragraph [ref=f30e323]: "عرض مؤقت: صور توضيحية ومحتوى بانتظار الاعتماد. المنتجات والمشاريع المعروضة ليست مراجع تجارية مؤكدة."
  - contentinfo [ref=f30e324]:
    - generic [ref=f30e325]:
      - generic [ref=f30e326]:
        - link "TIME STONE MARBRE & PIERRE" [ref=f30e327] [cursor=pointer]:
          - /url: /ar
          - generic [ref=f30e328]:
            - generic [ref=f30e331]: TIME STONE
            - generic [ref=f30e332]: MARBRE & PIERRE
        - paragraph [ref=f30e333]: الخامة. الزمن. العمارة.
      - generic [ref=f30e334]:
        - heading "استكشف" [level=2] [ref=f30e335]
        - navigation "استكشف" [ref=f30e336]:
          - link "الرئيسية" [ref=f30e337] [cursor=pointer]:
            - /url: "#home"
          - link "التشكيلة" [ref=f30e338] [cursor=pointer]:
            - /url: "#collection"
          - link "الاستخدامات" [ref=f30e339] [cursor=pointer]:
            - /url: "#applications"
          - link "من نحن" [ref=f30e340] [cursor=pointer]:
            - /url: "#about"
          - link "المحجر" [ref=f30e341] [cursor=pointer]:
            - /url: "#quarry"
          - link "التواصل" [ref=f30e342] [cursor=pointer]:
            - /url: "#contact"
      - generic [ref=f30e343]:
        - heading "الخامات" [level=2] [ref=f30e344]
        - navigation "الخامات" [ref=f30e345]:
          - link "الحجر الجيري" [ref=f30e346] [cursor=pointer]:
            - /url: /ar/products?category=limestone
          - link "الرخام" [ref=f30e347] [cursor=pointer]:
            - /url: /ar/products?category=marble
          - link "البلاط" [ref=f30e348] [cursor=pointer]:
            - /url: /ar/products?category=tiles
          - link "الكتل" [ref=f30e349] [cursor=pointer]:
            - /url: /ar/products?category=blocks
          - link "حسب الطلب" [ref=f30e350] [cursor=pointer]:
            - /url: /ar/products?category=custom
      - generic [ref=f30e351]:
        - heading "اللغات" [level=2] [ref=f30e352]
        - navigation "اللغات" [ref=f30e353]:
          - link "Français" [ref=f30e354] [cursor=pointer]:
            - /url: /fr
          - link "English" [ref=f30e355] [cursor=pointer]:
            - /url: /en
          - link "العربية" [ref=f30e356] [cursor=pointer]:
            - /url: /ar
    - generic [ref=f30e357]:
      - paragraph [ref=f30e358]: تايم ستون · عرض قيد التطوير
      - paragraph [ref=f30e359]: صور مؤقتة من التصاميم المعتمدة. المعلومات التجارية بانتظار التأكيد.
  - alert [ref=f30e360]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { readFile, mkdir, writeFile } from 'node:fs/promises';
  3  | 
  4  | test('editable banners use high resolution on desktop and smaller images on mobile', async ({ page, request }) => {
  5  |   test.skip(!process.env.QA_ADMIN_LOCALE_CREDENTIALS, 'Requires a disposable local admin account.');
  6  |   test.setTimeout(180000);
  7  |   page.setDefaultTimeout(15000);
  8  |   const output = 'docs/qa/banners';
  9  |   await mkdir(output, { recursive: true });
  10 |   const account = JSON.parse(await readFile(process.env.QA_ADMIN_LOCALE_CREDENTIALS!, 'utf8'));
  11 |   const errors: string[] = [];
  12 |   const checks: unknown[] = [];
  13 |   page.on('pageerror', e => errors.push(e.message));
  14 |   await page.goto('http://127.0.0.1:8000/admin/login');
  15 |   await page.locator('input[type=email]').fill(account.email);
  16 |   await page.locator('input[type=password]').fill(account.password);
  17 |   await page.locator('button[type=submit]').last().click();
  18 |   await expect(page).toHaveURL('http://127.0.0.1:8000/admin');
  19 |   for (const [locale, label, upload] of [['fr', 'Gérer les bannières', 'Importer une image de bannière'], ['en', 'Manage banners', 'Upload banner image'], ['ar', 'إدارة صور البانر', 'رفع صورة بانر']]) {
  20 |     await page.goto('http://127.0.0.1:8000/admin');
  21 |     await page.locator('#admin-locale').selectOption(locale);
  22 |     await Promise.all([page.waitForNavigation(), page.locator('.admin-language-switcher button').click()]);
  23 |     await page.getByRole('link', { name: label, exact: true }).click();
  24 |     await expect(page).toHaveURL(/filters\[banners\]\[isActive\]=1/);
  25 |     await expect(page.getByText('catalogue-hero', { exact: true })).toBeVisible();
  26 |     expect(await page.locator('table img').count()).toBeGreaterThan(0);
  27 |     if (locale === 'ar') await page.screenshot({ path: `${output}/admin-banners-ar.png`, fullPage: true });
  28 |     const api = await request.get(`http://127.0.0.1:8000/api/v1/pages/shared?locale=${locale}`);
  29 |     expect(api.ok()).toBe(true);
  30 |     const section = (await api.json()).data.sections.find((s: {key: string}) => s.key === 'catalogue-hero');
  31 |     expect(section.image).toMatch(/\/media\/\d+\/banner$/);
  32 |     const listing = await page.getByText('catalogue-hero', { exact: true }).locator('xpath=ancestor::tr').locator('a').first().getAttribute('href');
  33 |     expect(listing).toBeTruthy();
  34 |     await page.goto(listing!);
  35 |     await expect(page.getByText(upload, { exact: true })).toBeVisible();
  36 |     for (const width of [390, 1536]) {
  37 |       await page.setViewportSize({ width, height: 900 });
  38 |       const requested: string[] = [];
  39 |       const listener = (r: {url(): string}) => requested.push(r.url());
  40 |       page.on('request', listener);
  41 |       await page.goto(`http://127.0.0.1:3001/${locale}/products`);
  42 |       const hero = page.locator('.catalogue-hero img');
  43 |       await expect(hero).toBeVisible();
  44 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  45 |       const src = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
  46 |       expect(src).toMatch(width < 768 ? /\/preview$/ : /\/banner$/);
  47 |       if (width < 768) expect(requested.some(url => url.endsWith(new URL(section.image).pathname))).toBe(false);
  48 |       page.off('request', listener);
  49 |       expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  50 |       await page.screenshot({ path: `${output}/catalogue-${locale}-${width}.png`, fullPage: false });
  51 |       checks.push({ locale, width, currentImage: src });
  52 |     }
  53 |     for (const path of ['', '/about', '/applications', '/contact', '/quote']) {
  54 |       await page.goto(`http://127.0.0.1:3001/${locale}${path}`);
  55 |       const hero = page.locator(path ? '.page-hero img' : '.hero-art img');
  56 |       await expect(hero).toBeVisible();
> 57 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
     |                                    ^ Error: locator.evaluate: Test timeout of 180000ms exceeded.
  58 |       checks.push({ locale, page: path || '/', loaded: true });
  59 |     }
  60 |   }
  61 |   expect(errors).toEqual([]);
  62 |   await writeFile(`${output}/results.json`, JSON.stringify({ passed: true, checks, browserErrors: errors }, null, 2));
  63 | });
  64 | 
  65 | test('Application banners preserve the first gallery image at desktop and mobile sizes', async ({ page, request }) => {
  66 |   const list = await request.get('http://127.0.0.1:8000/api/v1/applications?locale=fr');
  67 |   expect(list.ok()).toBe(true);
  68 |   const slug = (await list.json()).data[0].slug;
  69 |   for (const locale of ['fr', 'en', 'ar']) {
  70 |     const api = await request.get(`http://127.0.0.1:8000/api/v1/applications/${slug}?locale=${locale}`);
  71 |     const image = new URL((await api.json()).data.gallery[0]).pathname;
  72 |     for (const width of [390, 1536]) {
  73 |       await page.setViewportSize({ width, height: 900 });
  74 |       await page.goto(`http://127.0.0.1:3001/${locale}/applications/${slug}`);
  75 |       const hero = page.locator('.page-hero img');
  76 |       await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  77 |       const source = await hero.evaluate((img: HTMLImageElement) => new URL(img.currentSrc).pathname);
  78 |       expect(source).toBe(width < 768 ? image.replace(/\/(banner|texture)$/, '/preview') : image);
  79 |     }
  80 |   }
  81 | });
  82 | 
```
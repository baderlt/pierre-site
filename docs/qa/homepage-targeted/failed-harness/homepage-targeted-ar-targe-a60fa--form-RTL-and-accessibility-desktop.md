# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-targeted.spec.ts >> ar: targeted sections at six widths, lazy form, RTL and accessibility
- Location: tests\homepage-targeted.spec.ts:7:42

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "انتقل إلى المحتوى" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "TIME STONE MARBRE & PIERRE" [ref=e5] [cursor=pointer]:
        - /url: /ar
        - generic [ref=e6]:
          - generic [ref=e9]: TIME STONE
          - generic [ref=e10]: MARBRE & PIERRE
      - navigation "استكشف" [ref=e11]:
        - link "الرئيسية" [ref=e12] [cursor=pointer]:
          - /url: /ar
        - link "التشكيلة" [ref=e13] [cursor=pointer]:
          - /url: /ar/products
        - link "الاستخدامات" [ref=e14] [cursor=pointer]:
          - /url: /ar/applications
        - link "من نحن" [ref=e15] [cursor=pointer]:
          - /url: /ar/about
        - link "المحجر" [ref=e16] [cursor=pointer]:
          - /url: /ar/about#quarry
        - link "التواصل" [ref=e17] [cursor=pointer]:
          - /url: /ar/contact
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e24]: اختر اللغة
          - combobox "اختر اللغة" [ref=e25] [cursor=pointer]:
            - option "Français"
            - option "English"
            - option "العربية" [selected]
        - link "اطلب عرض سعر" [ref=e26] [cursor=pointer]:
          - /url: /ar/quote
  - main [ref=e30]:
    - region [ref=e31]:
      - navigation "استكشف" [ref=e34]:
        - link "01 الرئيسية" [ref=e35] [cursor=pointer]:
          - /url: "#home"
          - generic [ref=e36]: "01"
          - text: الرئيسية
        - link "02 التشكيلة" [ref=e37] [cursor=pointer]:
          - /url: "#collection"
          - generic [ref=e38]: "02"
          - text: التشكيلة
        - link "03 الاستخدامات" [ref=e39] [cursor=pointer]:
          - /url: "#applications"
          - generic [ref=e40]: "03"
          - text: الاستخدامات
        - link "04 المحجر" [ref=e41] [cursor=pointer]:
          - /url: "#quarry"
          - generic [ref=e42]: "04"
          - text: المحجر
        - link "05 من نحن" [ref=e43] [cursor=pointer]:
          - /url: "#about"
          - generic [ref=e44]: "05"
          - text: من نحن
      - generic [ref=e46]:
        - paragraph [ref=e47]: حجر طبيعي · المغرب
        - heading "حجر يتخطّى الزمن. لعمارة معاصرة." [level=1] [ref=e48]
        - paragraph [ref=e49]: ملمس فريد وألوان طبيعية. تخيّل مكانًا جديدًا للحجر في مشروعك المعماري القادم.
        - generic [ref=e50]:
          - link "اطلب عرض سعر" [ref=e51] [cursor=pointer]:
            - /url: "#collection"
          - generic [ref=e54]:
            - generic "نظرة أقرب إلى الخامة" [ref=e55]:
              - 'button "الخامة المختارة : الحجر الجيري · 01" [ref=e56] [cursor=pointer]'
              - 'button "الخامة المختارة : الرخام · 02" [ref=e57] [cursor=pointer]'
              - 'button "الخامة المختارة : البلاط · 03" [ref=e58] [cursor=pointer]'
            - generic [ref=e59]:
              - heading "جمال الحجر الجيري" [level=2] [ref=e60]
              - paragraph [ref=e61]: دراسة بصرية لخامة بألوان دافئة وملمس معدني طبيعي.
              - button "اكتشف الخامة" [ref=e62] [cursor=pointer]
          - button "استكشف الخامات" [ref=e65] [cursor=pointer]
      - generic [ref=e68]:
        - link "اكتشف المزيد" [ref=e69] [cursor=pointer]:
          - /url: "#collection"
        - generic [ref=e71]: صورة توضيحية · مؤقتة
    - region "حجر طبيعي · المغرب" [ref=e72]:
      - generic [ref=e73]:
        - generic [ref=e78]:
          - heading "حجر طبيعي" [level=2] [ref=e79]
          - paragraph [ref=e80]: البداية من الخامة
        - generic [ref=e85]:
          - heading "ألوان وملمس" [level=2] [ref=e86]
          - paragraph [ref=e87]: طابع متفرّد
        - generic [ref=e92]:
          - heading "أشكال متنوعة" [level=2] [ref=e93]
          - paragraph [ref=e94]: ألواح وكتل وبلاط
        - generic [ref=e99]:
          - heading "أفكار للمساحات" [level=2] [ref=e100]
          - paragraph [ref=e101]: للداخل والخارج
        - generic [ref=e106]:
          - heading "مشروعك" [level=2] [ref=e107]
          - paragraph [ref=e108]: تحديد الاحتياجات
        - generic [ref=e113]:
          - heading "تواصل مباشر" [level=2] [ref=e114]
          - paragraph [ref=e115]: بيانات قيد التأكيد
    - region [ref=e116]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - paragraph [ref=e119]: تشكيلتنا
          - heading "اكتشف جمال الحجر الطبيعي" [level=2] [ref=e120]
          - paragraph [ref=e121]: الحجر الجيري والرخام والأشكال المعمارية. بداية لاكتشاف إمكانات الخامة.
        - link "استكشف المختارات" [ref=e122] [cursor=pointer]:
          - /url: "#materials"
      - generic [ref=e125]:
        - link [ref=e126] [cursor=pointer]:
          - /url: /ar/products?category=limestone
          - img "الحجر الجيري" [ref=e128]
          - generic [ref=e130]:
            - heading "الحجر الجيري" [level=3] [ref=e131]
            - paragraph [ref=e132]: تشكيلة توضيحية
        - link [ref=e136] [cursor=pointer]:
          - /url: /ar/products?category=marble
          - img "الرخام" [ref=e138]
          - generic [ref=e140]:
            - heading "الرخام" [level=3] [ref=e141]
            - paragraph [ref=e142]: تشكيلة توضيحية
        - link [ref=e146] [cursor=pointer]:
          - /url: /ar/products?category=tiles
          - img "البلاط" [ref=e148]
          - generic [ref=e150]:
            - heading "البلاط" [level=3] [ref=e151]
            - paragraph [ref=e152]: تشكيلة توضيحية
        - link [ref=e156] [cursor=pointer]:
          - /url: /ar/products?category=blocks
          - img "الكتل" [ref=e158]
          - generic [ref=e160]:
            - heading "الكتل" [level=3] [ref=e161]
            - paragraph [ref=e162]: تشكيلة توضيحية
        - link [ref=e166] [cursor=pointer]:
          - /url: /ar/products?category=custom
          - img "حسب الطلب" [ref=e168]
          - generic [ref=e170]:
            - heading "حسب الطلب" [level=3] [ref=e171]
            - paragraph [ref=e172]: تشكيلة توضيحية
    - region [ref=e176]:
      - generic [ref=e177]:
        - img "صورة توضيحية لمحجر · الموقع غير مؤكد" [ref=e178]
        - generic [ref=e179]: صورة توضيحية لمحجر · الموقع غير مؤكد
      - generic [ref=e180]:
        - paragraph [ref=e181]: من المحجر إلى الخامة
        - heading "حكاية صاغها الحجر" [level=2] [ref=e182]
        - paragraph [ref=e183]: خامة أولية، وحرفة، وتحول. لمحة بصرية عن عالم الحجر، ريثما تتوفر صور تايم ستون وقصتها المعتمدة.
        - link "اكتشف الحرفة" [ref=e184] [cursor=pointer]:
          - /url: "#craft"
        - generic [ref=e187]:
          - generic [ref=e188]: اختيار الخامة
          - generic [ref=e192]: القطع والتناسب
          - generic [ref=e196]: تشطيب السطح
    - generic [ref=e200]:
      - generic [ref=e201]:
        - paragraph [ref=e202]: روح تايم ستون
        - heading "خامة طبيعية. ورؤية معمارية." [level=2] [ref=e203]
        - paragraph [ref=e204]: "صالة عرض تقرّب الحجر من مشروعك: اكتشف الملمس، وقارن الأشكال، واستعد لحوار حول احتياجاتك."
        - link "تخيّل مساحتك" [ref=e205] [cursor=pointer]:
          - /url: "#applications"
      - figure "صورة توضيحية · مؤقتة" [ref=e208]:
        - img "الواجهات الخارجية" [ref=e209]
    - generic [ref=e212]:
      - generic [ref=e214]:
        - paragraph [ref=e215]: دراسات للخامة
        - heading "الجمال يكمن في التفاصيل" [level=2] [ref=e216]
        - paragraph [ref=e217]: ثلاثة تصورات بصرية. سيتم تأكيد المنتجات والتشطيبات والأبعاد الفعلية مع تايم ستون.
      - generic [ref=e218]:
        - article [ref=e219]:
          - generic [ref=e220]:
            - img "صورة توضيحية مؤقتة" [ref=e221]
            - generic [ref=e222]: نموذج للعرض
          - generic [ref=e223]:
            - paragraph [ref=e224]: limestone
            - heading [level=3] [ref=e225]:
              - link "الحجر الجيري · 01" [ref=e226] [cursor=pointer]:
                - /url: /ar/products/sample-1
        - article [ref=e227]:
          - generic [ref=e228]:
            - img "صورة توضيحية مؤقتة" [ref=e229]
            - generic [ref=e230]: نموذج للعرض
          - generic [ref=e231]:
            - paragraph [ref=e232]: marble
            - heading [level=3] [ref=e233]:
              - link "الرخام · 02" [ref=e234] [cursor=pointer]:
                - /url: /ar/products/sample-2
        - article [ref=e235]:
          - generic [ref=e236]:
            - img "صورة توضيحية مؤقتة" [ref=e237]
            - generic [ref=e238]: نموذج للعرض
          - generic [ref=e239]:
            - paragraph [ref=e240]: tiles
            - heading [level=3] [ref=e241]:
              - link "البلاط · 03" [ref=e242] [cursor=pointer]:
                - /url: /ar/products/sample-3
    - region [ref=e243]:
      - figure "صورة توضيحية · مؤقتة" [ref=e244]
      - generic [ref=e248]:
        - generic [ref=e249]:
          - paragraph [ref=e250]: الحرفة
          - heading "من الكتلة إلى المساحة" [level=2] [ref=e251]
          - paragraph [ref=e252]: تصور توضيحي لمراحل التحويل. تبقى تفاصيل التصنيع والتشطيبات المتاحة بانتظار التوثيق.
        - list [ref=e253]:
          - listitem [ref=e254]:
            - generic [ref=e255]: "01"
            - heading "اختيار الخامة" [level=3] [ref=e256]
          - listitem [ref=e259]:
            - generic [ref=e260]: "02"
            - heading "القطع والتناسب" [level=3] [ref=e261]
          - listitem [ref=e264]:
            - generic [ref=e265]: "03"
            - heading "تشطيب السطح" [level=3] [ref=e266]
          - listitem [ref=e269]:
            - generic [ref=e270]: "04"
            - heading "التفصيل المعماري" [level=3] [ref=e271]
    - generic [ref=e274]:
      - generic [ref=e276]:
        - paragraph [ref=e277]: الاستخدامات
        - heading "حجر لكل مساحة" [level=2] [ref=e278]
        - paragraph [ref=e279]: أفكار معمارية تساعدك على تصوّر مشروعك.
      - generic [ref=e280]:
        - link [ref=e281] [cursor=pointer]:
          - /url: /ar/applications/exterior-facades
          - img "الواجهات الخارجية" [ref=e282]
          - generic [ref=e283]: الواجهات الخارجية
        - link [ref=e286] [cursor=pointer]:
          - /url: /ar/applications/interior-flooring
          - img "الأرضيات الداخلية" [ref=e287]
          - generic [ref=e288]: الأرضيات الداخلية
        - link [ref=e291] [cursor=pointer]:
          - /url: /ar/applications/wall-cladding
          - img "كسوة الجدران" [ref=e292]
          - generic [ref=e293]: كسوة الجدران
        - link [ref=e296] [cursor=pointer]:
          - /url: /ar/applications/stairs
          - img "السلالم والدرجات" [ref=e297]
          - generic [ref=e298]: السلالم والدرجات
      - paragraph [ref=e301]: صورة توضيحية · مؤقتة
    - generic [ref=e303]:
      - generic [ref=e304]:
        - paragraph [ref=e305]: اختيار على بيّنة
        - heading "كل مشروع يبدأ بالأسئلة المناسبة." [level=2] [ref=e306]
        - paragraph [ref=e307]: الاستخدام والتشطيب والأبعاد هي أساس الاختيار. تُنشر الخصائص التقنية بعد التحقق منها.
      - list [ref=e308]:
        - listitem [ref=e309]:
          - generic [ref=e310]: "01"
          - text: كيف سيُستخدم الحجر؟
        - listitem [ref=e311]:
          - generic [ref=e312]: "02"
          - text: ما التشطيب المناسب لمساحتك؟
        - listitem [ref=e313]:
          - generic [ref=e314]: "03"
          - text: ما الأبعاد التي يحتاجها مشروعك؟
    - region [ref=e315]:
      - generic [ref=e316]:
        - generic [ref=e317]:
          - paragraph [ref=e318]: لنبنِ الخطوة القادمة
          - heading "مشروعك يبدأ هنا." [level=2] [ref=e319]
          - paragraph [ref=e320]: فكرة، أو خامة، أو احتياج خاص. جهّز الأبعاد والكميات وموقع التسليم لطلب عرض السعر لاحقًا.
        - generic [ref=e321]:
          - generic [ref=e322]:
            - paragraph [ref=e323]: جارٍ تحميل النموذج…
            - button "إظهار نموذج الطلب" [ref=e324] [cursor=pointer]
          - link "فتح صفحة طلب عرض السعر" [ref=e325] [cursor=pointer]:
            - /url: /ar/quote
  - complementary "نموذج للعرض" [ref=e326]:
    - paragraph [ref=e330]: "عرض مؤقت: صور توضيحية ومحتوى بانتظار الاعتماد. المنتجات والمشاريع المعروضة ليست مراجع تجارية مؤكدة."
  - contentinfo [ref=e331]:
    - generic [ref=e332]:
      - generic [ref=e333]:
        - link "TIME STONE MARBRE & PIERRE" [ref=e334] [cursor=pointer]:
          - /url: /ar
          - generic [ref=e335]:
            - generic [ref=e338]: TIME STONE
            - generic [ref=e339]: MARBRE & PIERRE
        - paragraph [ref=e340]: الخامة. الزمن. العمارة.
      - generic [ref=e341]:
        - heading "استكشف" [level=2] [ref=e342]
        - navigation "استكشف" [ref=e343]:
          - link "الرئيسية" [ref=e344] [cursor=pointer]:
            - /url: "#home"
          - link "التشكيلة" [ref=e345] [cursor=pointer]:
            - /url: "#collection"
          - link "الاستخدامات" [ref=e346] [cursor=pointer]:
            - /url: "#applications"
          - link "من نحن" [ref=e347] [cursor=pointer]:
            - /url: "#about"
          - link "المحجر" [ref=e348] [cursor=pointer]:
            - /url: "#quarry"
          - link "التواصل" [ref=e349] [cursor=pointer]:
            - /url: "#contact"
      - generic [ref=e350]:
        - heading "الخامات" [level=2] [ref=e351]
        - navigation "الخامات" [ref=e352]:
          - link "الحجر الجيري" [ref=e353] [cursor=pointer]:
            - /url: /ar/products?category=limestone
          - link "الرخام" [ref=e354] [cursor=pointer]:
            - /url: /ar/products?category=marble
          - link "البلاط" [ref=e355] [cursor=pointer]:
            - /url: /ar/products?category=tiles
          - link "الكتل" [ref=e356] [cursor=pointer]:
            - /url: /ar/products?category=blocks
          - link "حسب الطلب" [ref=e357] [cursor=pointer]:
            - /url: /ar/products?category=custom
      - generic [ref=e358]:
        - heading "اللغات" [level=2] [ref=e359]
        - navigation "اللغات" [ref=e360]:
          - link "Français" [ref=e361] [cursor=pointer]:
            - /url: /fr
          - link "English" [ref=e362] [cursor=pointer]:
            - /url: /en
          - link "العربية" [ref=e363] [cursor=pointer]:
            - /url: /ar
    - generic [ref=e364]:
      - paragraph [ref=e365]: تايم ستون · عرض قيد التطوير
      - paragraph [ref=e366]: صور مؤقتة من التصاميم المعتمدة. المعلومات التجارية بانتظار التأكيد.
  - alert [ref=e367]
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | import {mkdir} from 'node:fs/promises';
  4  | 
  5  | const out='docs/qa/homepage-targeted/after';
  6  | 
  7  | for(const locale of ['fr','en','ar'])test(`${locale}: targeted sections at six widths, lazy form, RTL and accessibility`,async({page})=>{
  8  |   await mkdir(out,{recursive:true});
  9  |   const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  10 |   let formCode=false;const pending:Promise<void>[]=[];
  11 |   page.on('response',response=>{if(response.url().includes('/_next/')&&response.url().endsWith('.js'))pending.push(response.text().then(text=>{if(text.includes('quote-product-search'))formCode=true;}).catch(()=>{}));});
  12 |   const reads:string[]=[];page.on('request',r=>{if(r.url().includes('/api/quotations'))reads.push(r.method());});
  13 |   await page.goto(`/${locale}`);await page.evaluate(()=>document.fonts.ready);await Promise.all(pending);
> 14 |   expect(formCode).toBe(false);expect(reads).toEqual([]);await expect(page.locator('.home-location')).toHaveCount(0);
     |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  15 |   await expect(page.locator('html')).toHaveAttribute('dir',locale==='ar'?'rtl':'ltr');
  16 |   const craftTitle=await page.locator('#craft h2').innerText();
  17 |   await page.locator('#contact').scrollIntoViewIfNeeded();await expect(page.locator('#quote-name')).toBeVisible();await Promise.all(pending);expect(formCode).toBe(true);
  18 |   await page.locator('#quote-name').fill('QA ONLY unsent input');
  19 |   for(const width of [320,390,430,768,1024,1536]){
  20 |     await page.setViewportSize({width,height:1024});
  21 |     await expect(page.locator('#quote-name')).toHaveValue('QA ONLY unsent input');
  22 |     await expect(page.locator('#craft h2')).toHaveText(craftTitle);await expect(page.locator('#craft .process-steps li')).toHaveCount(4);
  23 |     expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  24 |     for(const id of ['craft','contact']){
  25 |       const section=page.locator('#'+id);await section.scrollIntoViewIfNeeded();
  26 |       await section.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode().catch(()=>{})))});
  27 |       await section.screenshot({path:`${out}/${locale}-${width}-${id}.png`,animations:'disabled',style:'.site-header,.skip-link{visibility:hidden!important}'});
  28 |     }
  29 |   }
  30 |   await page.setViewportSize({width:390,height:844});await page.locator('#contact').scrollIntoViewIfNeeded();
  31 |   expect((await new AxeBuilder({page}).include('#craft').include('#contact').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  32 |   await page.emulateMedia({reducedMotion:'reduce'});
  33 |   expect(await page.locator('#craft li').first().evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  34 |   expect(errors).toEqual([]);
  35 | });
  36 | 
  37 | test('same quotation validation, product selection and duplicate-safe uncertain recovery',async({page})=>{
  38 |   await page.goto('/fr#contact');await expect(page.locator('#quote-name')).toBeVisible();
  39 |   await page.locator('.quote-submit').click();await expect(page.locator('.quote-errors')).toBeFocused();
  40 |   await page.locator('.quote-errors a[href="#quote-email"]').click();await expect(page.locator('#quote-email')).toBeFocused();
  41 |   await expect(page.locator('#quote-product option')).not.toHaveCount(1);
  42 |   const product=await page.locator('#quote-product option').nth(1).getAttribute('value');
  43 |   await page.locator('#quote-product').selectOption(product!);await expect(page.locator('#quote-width')).toBeVisible();
  44 |   await page.setViewportSize({width:390,height:844});await expect(page.locator('#quote-product')).toHaveValue(product!);
  45 |   await page.locator('#quote-product').selectOption('');await expect(page.locator('#quote-width')).toHaveCount(0);
  46 |   await page.locator('#quote-name').fill('QA ONLY browser mock');await page.locator('#quote-email').fill('qa-only@example.test');
  47 |   await page.locator('#quote-country').selectOption('MA');await page.locator('#quote-location').fill('QA ONLY');await page.locator('#quote-description').fill('QA ONLY synthetic browser submission; intercepted before the backend.');await page.locator('#quote-privacy').check();
  48 |   const posts:{key:string|undefined;body:unknown}[]=[];
  49 |   await page.route('**/api/quotations',async route=>{
  50 |     if(route.request().method()!=='POST')return route.continue();
  51 |     posts.push({key:route.request().headers()['idempotency-key'],body:route.request().postDataJSON()});
  52 |     if(posts.length===1)return route.fulfill({status:503,json:{message:'uncertain'}});
  53 |     if(posts.length===2)return route.fulfill({status:429,headers:{'Retry-After':'1'},json:{message:'submission_failed'}});
  54 |     return route.fulfill({status:200,json:{reference:'TS-ABCDEFGHIJKLMNOP',duplicate:true}});
  55 |   });
  56 |   await page.locator('.quote-submit').click();await expect(page.locator('#quote-name')).toBeDisabled();
  57 |   await page.locator('.quote-submit').click();await expect.poll(()=>posts.length).toBe(2);await expect(page.locator('#quote-name')).toBeDisabled();
  58 |   await page.locator('.quote-submit').click();await expect(page.locator('.quote-success')).toBeFocused();await expect(page.locator('.quote-success')).toContainText('TS-ABCDEFGHIJKLMNOP');
  59 |   expect(posts).toHaveLength(3);expect(posts[1]).toEqual(posts[0]);expect(posts[2]).toEqual(posts[0]);
  60 |   expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
  61 | });
  62 | 
  63 | test('location fixture: directions safety, translated layouts, keyboard and reduced motion',async({page})=>{
  64 |   const fixture=process.env.QA_LOCATION_URL;
  65 |   expect(fixture,'A separate read-only synthetic fixture is required; never overwrite real address settings').toBeTruthy();
  66 |   for(const locale of ['fr','en','ar']){
  67 |     await page.goto(`${fixture}/${locale}`);const section=page.locator('.home-location');await section.scrollIntoViewIfNeeded();
  68 |     await expect(section).toContainText('QA ONLY — synthetic location, not TIME STONE’s address');
  69 |     const link=section.getByRole('link');await expect(link).toHaveAttribute('href','https://www.google.com/maps?q=QA+ONLY+NONBUSINESS+TEST+LOCATION');await expect(link).toHaveAttribute('rel','noopener noreferrer');
  70 |     await link.focus();await expect(link).toBeFocused();expect(await section.locator('.magasin-visual').getAttribute('aria-hidden')).toBe('true');
  71 |     for(const width of [320,390,430,768,1024,1536]){
  72 |       await page.setViewportSize({width,height:1024});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  73 |       await section.screenshot({path:`${out}/location-QA-ONLY-${locale}-${width}.png`,animations:'disabled',style:'.site-header,.skip-link{visibility:hidden!important}'});
  74 |     }
  75 |     expect((await new AxeBuilder({page}).include('.home-location').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  76 |     await page.emulateMedia({reducedMotion:'reduce'});expect(await section.locator('.magasin-plane').evaluate(el=>getComputedStyle(el).transitionDuration)).toBe('0s');
  77 |   }
  78 | });
  79 | 
  80 | test('without JavaScript the homepage keeps the dedicated quotation destination',async({browser})=>{
  81 |   const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  82 |   await page.goto(`${process.env.QA_BASE_URL}/ar#contact`);await expect(page.locator('#contact a[href="/ar/quote"]')).toBeVisible();
  83 |   await expect(page.locator('#contact form')).toHaveCount(0);await context.close();
  84 | });
  85 | 
  86 | test('manual keyboard activation without IntersectionObserver focuses the existing form',async({page})=>{
  87 |   await page.addInitScript(()=>{delete (window as unknown as Record<string,unknown>).IntersectionObserver;});
  88 |   await page.goto('/fr#contact');const button=page.locator('.home-quote-placeholder button');await button.focus();await page.keyboard.press('Enter');
  89 |   await expect(page.locator('#quote-product-search')).toBeFocused();
  90 | });
  91 | 
```
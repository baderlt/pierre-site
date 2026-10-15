# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-targeted.spec.ts >> en: targeted sections at six widths, lazy form, RTL and accessibility
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
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "TIME STONE MARBRE & PIERRE" [ref=e5] [cursor=pointer]:
        - /url: /en
        - generic [ref=e6]:
          - generic [ref=e9]: TIME STONE
          - generic [ref=e10]: MARBRE & PIERRE
      - navigation "Explore" [ref=e11]:
        - link "Home" [ref=e12] [cursor=pointer]:
          - /url: /en
        - link "Collection" [ref=e13] [cursor=pointer]:
          - /url: /en/products
        - link "Applications" [ref=e14] [cursor=pointer]:
          - /url: /en/applications
        - link "About" [ref=e15] [cursor=pointer]:
          - /url: /en/about
        - link "Quarry" [ref=e16] [cursor=pointer]:
          - /url: /en/about#quarry
        - link "Contact" [ref=e17] [cursor=pointer]:
          - /url: /en/contact
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e24]: Choose language
          - combobox "Choose language" [ref=e25] [cursor=pointer]:
            - option "Français"
            - option "English" [selected]
            - option "العربية"
        - link "Request a quote" [ref=e26] [cursor=pointer]:
          - /url: /en/quote
  - main [ref=e30]:
    - region [ref=e31]:
      - navigation "Explore" [ref=e34]:
        - link "01 Home" [ref=e35] [cursor=pointer]:
          - /url: "#home"
          - generic [ref=e36]: "01"
          - text: Home
        - link "02 Collection" [ref=e37] [cursor=pointer]:
          - /url: "#collection"
          - generic [ref=e38]: "02"
          - text: Collection
        - link "03 Applications" [ref=e39] [cursor=pointer]:
          - /url: "#applications"
          - generic [ref=e40]: "03"
          - text: Applications
        - link "04 Quarry" [ref=e41] [cursor=pointer]:
          - /url: "#quarry"
          - generic [ref=e42]: "04"
          - text: Quarry
        - link "05 About" [ref=e43] [cursor=pointer]:
          - /url: "#about"
          - generic [ref=e44]: "05"
          - text: About
      - generic [ref=e46]:
        - paragraph [ref=e47]: NATURAL STONE · MOROCCO
        - heading "Timeless Stone for Modern Architecture" [level=1] [ref=e48]
        - paragraph [ref=e49]: Distinctive textures. Natural tones. Imagine a new place for stone in your next architectural project.
        - generic [ref=e50]:
          - link "Demander un devis" [ref=e51] [cursor=pointer]:
            - /url: "#collection"
          - generic [ref=e54]:
            - generic "A closer look at the material" [ref=e55]:
              - 'button "Selected material : Limestone · 01" [ref=e56] [cursor=pointer]'
              - 'button "Selected material : Marble · 02" [ref=e57] [cursor=pointer]'
              - 'button "Selected material : Tiles · 03" [ref=e58] [cursor=pointer]'
            - generic [ref=e59]:
              - heading "The character of limestone" [level=2] [ref=e60]
              - paragraph [ref=e61]: A material study in warm tones and natural mineral texture.
              - button "Discover the material" [ref=e62] [cursor=pointer]
          - button "Explore the materials" [ref=e65] [cursor=pointer]
      - generic [ref=e68]:
        - link "Discover" [ref=e69] [cursor=pointer]:
          - /url: "#collection"
        - generic [ref=e71]: Illustrative image · temporary
    - region "NATURAL STONE · MOROCCO" [ref=e72]:
      - generic [ref=e73]:
        - generic [ref=e78]:
          - heading "Natural stone" [level=2] [ref=e79]
          - paragraph [ref=e80]: It begins with the material
        - generic [ref=e85]:
          - heading "Tones & textures" [level=2] [ref=e86]
          - paragraph [ref=e87]: Individual character
        - generic [ref=e92]:
          - heading "Explore the formats" [level=2] [ref=e93]
          - paragraph [ref=e94]: Slabs, blocks and tiles
        - generic [ref=e99]:
          - heading "Ideas for spaces" [level=2] [ref=e100]
          - paragraph [ref=e101]: Indoors and outdoors
        - generic [ref=e106]:
          - heading "Your project" [level=2] [ref=e107]
          - paragraph [ref=e108]: Define your requirements
        - generic [ref=e113]:
          - heading "A direct conversation" [level=2] [ref=e114]
          - paragraph [ref=e115]: Contacts to be confirmed
    - region [ref=e116]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - paragraph [ref=e119]: OUR COLLECTION
          - heading "Explore Our Natural Stone" [level=2] [ref=e120]
          - paragraph [ref=e121]: Limestone, marble and architectural formats. A first encounter with the possibilities of stone.
        - link "Discover the selections" [ref=e122] [cursor=pointer]:
          - /url: "#materials"
      - generic [ref=e125]:
        - link [ref=e126] [cursor=pointer]:
          - /url: /en/products?category=limestone
          - img "Limestone" [ref=e128]
          - generic [ref=e130]:
            - heading "Limestone" [level=3] [ref=e131]
            - paragraph [ref=e132]: Illustrative collection
        - link [ref=e136] [cursor=pointer]:
          - /url: /en/products?category=marble
          - img "Marble" [ref=e138]
          - generic [ref=e140]:
            - heading "Marble" [level=3] [ref=e141]
            - paragraph [ref=e142]: Illustrative collection
        - link [ref=e146] [cursor=pointer]:
          - /url: /en/products?category=tiles
          - img "Tiles" [ref=e148]
          - generic [ref=e150]:
            - heading "Tiles" [level=3] [ref=e151]
            - paragraph [ref=e152]: Illustrative collection
        - link [ref=e156] [cursor=pointer]:
          - /url: /en/products?category=blocks
          - img "Blocks" [ref=e158]
          - generic [ref=e160]:
            - heading "Blocks" [level=3] [ref=e161]
            - paragraph [ref=e162]: Illustrative collection
        - link [ref=e166] [cursor=pointer]:
          - /url: /en/products?category=custom
          - img "Custom" [ref=e168]
          - generic [ref=e170]:
            - heading "Custom" [level=3] [ref=e171]
            - paragraph [ref=e172]: Illustrative collection
    - region [ref=e176]:
      - generic [ref=e177]:
        - img "Quarry illustration · location unverified" [ref=e178]
        - generic [ref=e179]: Quarry illustration · location unverified
      - generic [ref=e180]:
        - paragraph [ref=e181]: FROM QUARRY TO MATERIAL
        - heading "A story shaped by stone" [level=2] [ref=e182]
        - paragraph [ref=e183]: Raw material, skilled hands, transformation. A visual introduction to the world of stone while TIME STONE’s own images and story are prepared.
        - link "Discover the craft" [ref=e184] [cursor=pointer]:
          - /url: "#craft"
        - generic [ref=e187]:
          - generic [ref=e188]: Selecting the material
          - generic [ref=e192]: Cutting & proportion
          - generic [ref=e196]: Finishing the surface
    - generic [ref=e200]:
      - generic [ref=e201]:
        - paragraph [ref=e202]: THE SPIRIT OF TIME STONE
        - heading "Natural material. Architectural possibility." [level=2] [ref=e203]
        - paragraph [ref=e204]: "A showroom designed to bring stone closer to your project: explore textures, compare formats and prepare a conversation around what you need."
        - link "Imagine your space" [ref=e205] [cursor=pointer]:
          - /url: "#applications"
      - figure "Illustrative image · temporary" [ref=e208]:
        - img "Exterior façades" [ref=e209]
    - generic [ref=e212]:
      - generic [ref=e214]:
        - paragraph [ref=e215]: MATERIAL STUDIES
        - heading "Beauty is in the detail" [level=2] [ref=e216]
        - paragraph [ref=e217]: Three visual inspirations. Actual products, finishes and dimensions will be confirmed with TIME STONE.
      - generic [ref=e218]:
        - article [ref=e219]:
          - generic [ref=e220]:
            - img "Temporary illustration" [ref=e221]
            - generic [ref=e222]: PRESENTATION SAMPLE
          - generic [ref=e223]:
            - paragraph [ref=e224]: limestone
            - heading [level=3] [ref=e225]:
              - link "Limestone · 01" [ref=e226] [cursor=pointer]:
                - /url: /en/products/sample-1
        - article [ref=e227]:
          - generic [ref=e228]:
            - img "Temporary illustration" [ref=e229]
            - generic [ref=e230]: PRESENTATION SAMPLE
          - generic [ref=e231]:
            - paragraph [ref=e232]: marble
            - heading [level=3] [ref=e233]:
              - link "Marble · 02" [ref=e234] [cursor=pointer]:
                - /url: /en/products/sample-2
        - article [ref=e235]:
          - generic [ref=e236]:
            - img "Temporary illustration" [ref=e237]
            - generic [ref=e238]: PRESENTATION SAMPLE
          - generic [ref=e239]:
            - paragraph [ref=e240]: tiles
            - heading [level=3] [ref=e241]:
              - link "Tiles · 03" [ref=e242] [cursor=pointer]:
                - /url: /en/products/sample-3
    - region [ref=e243]:
      - figure "Illustrative image · temporary" [ref=e244]
      - generic [ref=e248]:
        - generic [ref=e249]:
          - paragraph [ref=e250]: THE CRAFT
          - heading "From block to space" [level=2] [ref=e251]
          - paragraph [ref=e252]: An illustrative look at the stages of transformation. The actual process and available finishes remain to be documented.
        - list [ref=e253]:
          - listitem [ref=e254]:
            - generic [ref=e255]: "01"
            - heading "Selecting the material" [level=3] [ref=e256]
          - listitem [ref=e259]:
            - generic [ref=e260]: "02"
            - heading "Cutting & proportion" [level=3] [ref=e261]
          - listitem [ref=e264]:
            - generic [ref=e265]: "03"
            - heading "Finishing the surface" [level=3] [ref=e266]
          - listitem [ref=e269]:
            - generic [ref=e270]: "04"
            - heading "The architectural detail" [level=3] [ref=e271]
    - generic [ref=e274]:
      - generic [ref=e276]:
        - paragraph [ref=e277]: APPLICATIONS
        - heading "Stone for Every Space" [level=2] [ref=e278]
        - paragraph [ref=e279]: Architectural inspiration to help you imagine your project.
      - generic [ref=e280]:
        - link [ref=e281] [cursor=pointer]:
          - /url: /en/applications/exterior-facades
          - img "Exterior facades" [ref=e282]
          - generic [ref=e283]: Exterior facades
        - link [ref=e286] [cursor=pointer]:
          - /url: /en/applications/interior-flooring
          - img "Interior flooring" [ref=e287]
          - generic [ref=e288]: Interior flooring
        - link [ref=e291] [cursor=pointer]:
          - /url: /en/applications/wall-cladding
          - img "Wall cladding" [ref=e292]
          - generic [ref=e293]: Wall cladding
        - link [ref=e296] [cursor=pointer]:
          - /url: /en/applications/stairs
          - img "Stairs & steps" [ref=e297]
          - generic [ref=e298]: Stairs & steps
      - paragraph [ref=e301]: Illustrative image · temporary
    - generic [ref=e303]:
      - generic [ref=e304]:
        - paragraph [ref=e305]: AN INFORMED CHOICE
        - heading "Every project starts with the right questions." [level=2] [ref=e306]
        - paragraph [ref=e307]: Use, finish and dimensions guide the selection. Technical characteristics will be published after verification.
      - list [ref=e308]:
        - listitem [ref=e309]:
          - generic [ref=e310]: "01"
          - text: How will the stone be used?
        - listitem [ref=e311]:
          - generic [ref=e312]: "02"
          - text: Which finish suits your space?
        - listitem [ref=e313]:
          - generic [ref=e314]: "03"
          - text: What dimensions does your project need?
    - region [ref=e315]:
      - generic [ref=e316]:
        - generic [ref=e317]:
          - paragraph [ref=e318]: LET’S BUILD WHAT’S NEXT
          - heading "Your project starts here." [level=2] [ref=e319]
          - paragraph [ref=e320]: An idea, a material, a particular requirement. Gather your dimensions, quantities and delivery location for a future quotation request.
        - generic [ref=e321]:
          - generic [ref=e322]:
            - paragraph [ref=e323]: Loading the form…
            - button "Show the enquiry form" [ref=e324] [cursor=pointer]
          - link "Open the quotation page" [ref=e325] [cursor=pointer]:
            - /url: /en/quote
  - complementary "PRESENTATION SAMPLE" [ref=e326]:
    - paragraph [ref=e330]: "Temporary presentation: illustrative images and draft content. No project or product shown is a confirmed commercial reference."
  - contentinfo [ref=e331]:
    - generic [ref=e332]:
      - generic [ref=e333]:
        - link "TIME STONE MARBRE & PIERRE" [ref=e334] [cursor=pointer]:
          - /url: /en
          - generic [ref=e335]:
            - generic [ref=e338]: TIME STONE
            - generic [ref=e339]: MARBRE & PIERRE
        - paragraph [ref=e340]: Material. Time. Architecture.
      - generic [ref=e341]:
        - heading "Explore" [level=2] [ref=e342]
        - navigation "Explore" [ref=e343]:
          - link "Home" [ref=e344] [cursor=pointer]:
            - /url: "#home"
          - link "Collection" [ref=e345] [cursor=pointer]:
            - /url: "#collection"
          - link "Applications" [ref=e346] [cursor=pointer]:
            - /url: "#applications"
          - link "About" [ref=e347] [cursor=pointer]:
            - /url: "#about"
          - link "Quarry" [ref=e348] [cursor=pointer]:
            - /url: "#quarry"
          - link "Contact" [ref=e349] [cursor=pointer]:
            - /url: "#contact"
      - generic [ref=e350]:
        - heading "Materials" [level=2] [ref=e351]
        - navigation "Materials" [ref=e352]:
          - link "Limestone" [ref=e353] [cursor=pointer]:
            - /url: /en/products?category=limestone
          - link "Marble" [ref=e354] [cursor=pointer]:
            - /url: /en/products?category=marble
          - link "Tiles" [ref=e355] [cursor=pointer]:
            - /url: /en/products?category=tiles
          - link "Blocks" [ref=e356] [cursor=pointer]:
            - /url: /en/products?category=blocks
          - link "Custom" [ref=e357] [cursor=pointer]:
            - /url: /en/products?category=custom
      - generic [ref=e358]:
        - heading "Languages" [level=2] [ref=e359]
        - navigation "Languages" [ref=e360]:
          - link "Français" [ref=e361] [cursor=pointer]:
            - /url: /fr
          - link "English" [ref=e362] [cursor=pointer]:
            - /url: /en
          - link "العربية" [ref=e363] [cursor=pointer]:
            - /url: /ar
    - generic [ref=e364]:
      - paragraph [ref=e365]: TIME STONE · Development presentation
      - paragraph [ref=e366]: Temporary imagery from the approved mockups. Commercial information awaits confirmation.
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
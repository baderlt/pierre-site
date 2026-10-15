# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage-targeted.spec.ts >> fr: targeted sections at six widths, lazy form, RTL and accessibility
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
  - link "Aller au contenu" [ref=e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "TIME STONE MARBRE & PIERRE" [ref=e5] [cursor=pointer]:
        - /url: /fr
        - generic [ref=e6]:
          - generic [ref=e9]: TIME STONE
          - generic [ref=e10]: MARBRE & PIERRE
      - navigation "Explorer" [ref=e11]:
        - link "Accueil" [ref=e12] [cursor=pointer]:
          - /url: /fr
        - link "Collection" [ref=e13] [cursor=pointer]:
          - /url: /fr/products
        - link "Applications" [ref=e14] [cursor=pointer]:
          - /url: /fr/applications
        - link "À propos" [ref=e15] [cursor=pointer]:
          - /url: /fr/about
        - link "Carrière" [ref=e16] [cursor=pointer]:
          - /url: /fr/about#quarry
        - link "Contact" [ref=e17] [cursor=pointer]:
          - /url: /fr/contact
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e24]: Choisir la langue
          - combobox "Choisir la langue" [ref=e25] [cursor=pointer]:
            - option "Français" [selected]
            - option "English"
            - option "العربية"
        - link "Demander un devis" [ref=e26] [cursor=pointer]:
          - /url: /fr/quote
  - main [ref=e30]:
    - region [ref=e31]:
      - navigation "Explorer" [ref=e34]:
        - link "01 Accueil" [ref=e35] [cursor=pointer]:
          - /url: "#home"
          - generic [ref=e36]: "01"
          - text: Accueil
        - link "02 Collection" [ref=e37] [cursor=pointer]:
          - /url: "#collection"
          - generic [ref=e38]: "02"
          - text: Collection
        - link "03 Applications" [ref=e39] [cursor=pointer]:
          - /url: "#applications"
          - generic [ref=e40]: "03"
          - text: Applications
        - link "04 Carrière" [ref=e41] [cursor=pointer]:
          - /url: "#quarry"
          - generic [ref=e42]: "04"
          - text: Carrière
        - link "05 À propos" [ref=e43] [cursor=pointer]:
          - /url: "#about"
          - generic [ref=e44]: "05"
          - text: À propos
      - generic [ref=e46]:
        - paragraph [ref=e47]: PIERRE NATURELLE · MAROC
        - heading "La pierre intemporelle. L’architecture de demain." [level=1] [ref=e48]
        - paragraph [ref=e49]: Des textures singulières, des nuances naturelles. Imaginez une nouvelle place pour la pierre dans votre projet.
        - generic [ref=e50]:
          - link "Demander un devis" [ref=e51] [cursor=pointer]:
            - /url: "#collection"
          - generic [ref=e54]:
            - generic "Une première rencontre avec la matière" [ref=e55]:
              - 'button "Matière sélectionnée : Calcaire · 01" [ref=e56] [cursor=pointer]'
              - 'button "Matière sélectionnée : Marbre · 02" [ref=e57] [cursor=pointer]'
              - 'button "Matière sélectionnée : Carreaux · 03" [ref=e58] [cursor=pointer]'
            - generic [ref=e59]:
              - heading "L’expression du calcaire" [level=2] [ref=e60]
              - paragraph [ref=e61]: Une étude de matière aux nuances chaudes et au caractère minéral.
              - button "Découvrir la matière" [ref=e62] [cursor=pointer]
          - button "Voir les matières" [ref=e65] [cursor=pointer]
      - generic [ref=e68]:
        - link "Découvrir" [ref=e69] [cursor=pointer]:
          - /url: "#collection"
        - generic [ref=e71]: Visuel illustratif · provisoire
    - region "PIERRE NATURELLE · MAROC" [ref=e72]:
      - generic [ref=e73]:
        - generic [ref=e78]:
          - heading "Pierre naturelle" [level=2] [ref=e79]
          - paragraph [ref=e80]: La matière à l’origine
        - generic [ref=e85]:
          - heading "Nuances & textures" [level=2] [ref=e86]
          - paragraph [ref=e87]: Un caractère singulier
        - generic [ref=e92]:
          - heading "Formats à explorer" [level=2] [ref=e93]
          - paragraph [ref=e94]: Dalles, blocs et carreaux
        - generic [ref=e99]:
          - heading "Idées d’espaces" [level=2] [ref=e100]
          - paragraph [ref=e101]: Intérieur et extérieur
        - generic [ref=e106]:
          - heading "Votre projet" [level=2] [ref=e107]
          - paragraph [ref=e108]: Des besoins à préciser
        - generic [ref=e113]:
          - heading "Un échange direct" [level=2] [ref=e114]
          - paragraph [ref=e115]: Des contacts à confirmer
    - region [ref=e116]:
      - generic [ref=e117]:
        - generic [ref=e118]:
          - paragraph [ref=e119]: NOTRE COLLECTION
          - heading "Explorez la pierre naturelle" [level=2] [ref=e120]
          - paragraph [ref=e121]: "Calcaire, marbre et formats architecturaux : une première découverte de la matière."
        - link "Découvrir les sélections" [ref=e122] [cursor=pointer]:
          - /url: "#materials"
      - generic [ref=e125]:
        - link [ref=e126] [cursor=pointer]:
          - /url: /fr/products?category=limestone
          - img "Calcaire" [ref=e128]
          - generic [ref=e130]:
            - heading "Calcaire" [level=3] [ref=e131]
            - paragraph [ref=e132]: Collection illustrative
        - link [ref=e136] [cursor=pointer]:
          - /url: /fr/products?category=marble
          - img "Marbre" [ref=e138]
          - generic [ref=e140]:
            - heading "Marbre" [level=3] [ref=e141]
            - paragraph [ref=e142]: Collection illustrative
        - link [ref=e146] [cursor=pointer]:
          - /url: /fr/products?category=tiles
          - img "Carreaux" [ref=e148]
          - generic [ref=e150]:
            - heading "Carreaux" [level=3] [ref=e151]
            - paragraph [ref=e152]: Collection illustrative
        - link [ref=e156] [cursor=pointer]:
          - /url: /fr/products?category=blocks
          - img "Blocs" [ref=e158]
          - generic [ref=e160]:
            - heading "Blocs" [level=3] [ref=e161]
            - paragraph [ref=e162]: Collection illustrative
        - link [ref=e166] [cursor=pointer]:
          - /url: /fr/products?category=custom
          - img "Sur mesure" [ref=e168]
          - generic [ref=e170]:
            - heading "Sur mesure" [level=3] [ref=e171]
            - paragraph [ref=e172]: Collection illustrative
    - region [ref=e176]:
      - generic [ref=e177]:
        - img "Illustration de carrière · lieu non vérifié" [ref=e178]
        - generic [ref=e179]: Illustration de carrière · lieu non vérifié
      - generic [ref=e180]:
        - paragraph [ref=e181]: DE LA CARRIÈRE À LA MATIÈRE
        - heading "Une histoire façonnée par la pierre" [level=2] [ref=e182]
        - paragraph [ref=e183]: La matière brute, le geste, la transformation. Un aperçu visuel de l’univers de la pierre, en attendant les images et le récit de TIME STONE.
        - link "Explorer le savoir-faire" [ref=e184] [cursor=pointer]:
          - /url: "#craft"
        - generic [ref=e187]:
          - generic [ref=e188]: La sélection de la matière
          - generic [ref=e192]: La découpe & les proportions
          - generic [ref=e196]: La finition de surface
    - generic [ref=e200]:
      - generic [ref=e201]:
        - paragraph [ref=e202]: L’ESPRIT TIME STONE
        - heading "Une matière naturelle. Une vision architecturale." [level=2] [ref=e203]
        - paragraph [ref=e204]: "Ce showroom est conçu pour rapprocher la pierre de votre projet : découvrir les textures, comparer les formats et préparer un échange autour de vos besoins."
        - link "Imaginer votre espace" [ref=e205] [cursor=pointer]:
          - /url: "#applications"
      - figure "Visuel illustratif · provisoire" [ref=e208]:
        - img "Façades extérieures" [ref=e209]
    - generic [ref=e212]:
      - generic [ref=e214]:
        - paragraph [ref=e215]: ÉTUDES DE MATIÈRE
        - heading "Le détail fait la différence" [level=2] [ref=e216]
        - paragraph [ref=e217]: Trois inspirations visuelles. Les produits, finitions et dimensions réels seront confirmés avec TIME STONE.
      - generic [ref=e218]:
        - article [ref=e219]:
          - generic [ref=e220]:
            - img "Illustration temporaire" [ref=e221]
            - generic [ref=e222]: ÉCHANTILLON DE PRÉSENTATION
          - generic [ref=e223]:
            - paragraph [ref=e224]: limestone
            - heading [level=3] [ref=e225]:
              - link "Calcaire · 01" [ref=e226] [cursor=pointer]:
                - /url: /fr/products/sample-1
        - article [ref=e227]:
          - generic [ref=e228]:
            - img "Illustration temporaire" [ref=e229]
            - generic [ref=e230]: ÉCHANTILLON DE PRÉSENTATION
          - generic [ref=e231]:
            - paragraph [ref=e232]: marble
            - heading [level=3] [ref=e233]:
              - link "Marbre · 02" [ref=e234] [cursor=pointer]:
                - /url: /fr/products/sample-2
        - article [ref=e235]:
          - generic [ref=e236]:
            - img "Illustration temporaire" [ref=e237]
            - generic [ref=e238]: ÉCHANTILLON DE PRÉSENTATION
          - generic [ref=e239]:
            - paragraph [ref=e240]: tiles
            - heading [level=3] [ref=e241]:
              - link "Carreaux · 03" [ref=e242] [cursor=pointer]:
                - /url: /fr/products/sample-3
    - region [ref=e243]:
      - figure "Visuel illustratif · provisoire" [ref=e244]
      - generic [ref=e248]:
        - generic [ref=e249]:
          - paragraph [ref=e250]: LE SAVOIR-FAIRE
          - heading "Du bloc à l’espace" [level=2] [ref=e251]
          - paragraph [ref=e252]: Une lecture illustrative des étapes de transformation. Le procédé réel et les finitions disponibles restent à documenter.
        - list [ref=e253]:
          - listitem [ref=e254]:
            - generic [ref=e255]: "01"
            - heading "La sélection de la matière" [level=3] [ref=e256]
          - listitem [ref=e259]:
            - generic [ref=e260]: "02"
            - heading "La découpe & les proportions" [level=3] [ref=e261]
          - listitem [ref=e264]:
            - generic [ref=e265]: "03"
            - heading "La finition de surface" [level=3] [ref=e266]
          - listitem [ref=e269]:
            - generic [ref=e270]: "04"
            - heading "Le détail architectural" [level=3] [ref=e271]
    - generic [ref=e274]:
      - generic [ref=e276]:
        - paragraph [ref=e277]: LES APPLICATIONS
        - heading "La pierre dans chaque espace" [level=2] [ref=e278]
        - paragraph [ref=e279]: Des inspirations architecturales pour envisager votre projet.
      - generic [ref=e280]:
        - link [ref=e281] [cursor=pointer]:
          - /url: /fr/applications/exterior-facades
          - img "Façades extérieures" [ref=e282]
          - generic [ref=e283]: Façades extérieures
        - link [ref=e286] [cursor=pointer]:
          - /url: /fr/applications/interior-flooring
          - img "Sols intérieurs" [ref=e287]
          - generic [ref=e288]: Sols intérieurs
        - link [ref=e291] [cursor=pointer]:
          - /url: /fr/applications/wall-cladding
          - img "Revêtement mural" [ref=e292]
          - generic [ref=e293]: Revêtement mural
        - link [ref=e296] [cursor=pointer]:
          - /url: /fr/applications/stairs
          - img "Escaliers et marches" [ref=e297]
          - generic [ref=e298]: Escaliers et marches
      - paragraph [ref=e301]: Visuel illustratif · provisoire
    - generic [ref=e303]:
      - generic [ref=e304]:
        - paragraph [ref=e305]: CHOISIR EN CONNAISSANCE
        - heading "Chaque projet commence par les bonnes questions." [level=2] [ref=e306]
        - paragraph [ref=e307]: L’usage, la finition et les dimensions guident le choix. Les caractéristiques techniques seront publiées après validation.
      - list [ref=e308]:
        - listitem [ref=e309]:
          - generic [ref=e310]: "01"
          - text: Quel usage pour votre pierre ?
        - listitem [ref=e311]:
          - generic [ref=e312]: "02"
          - text: Quelle finition pour votre espace ?
        - listitem [ref=e313]:
          - generic [ref=e314]: "03"
          - text: Quelles dimensions pour votre projet ?
    - region [ref=e315]:
      - generic [ref=e316]:
        - generic [ref=e317]:
          - paragraph [ref=e318]: CONSTRUISONS LA SUITE
          - heading "Votre projet commence ici." [level=2] [ref=e319]
          - paragraph [ref=e320]: Une idée, une matière, un besoin particulier. Préparez les dimensions, les quantités et le lieu de livraison pour votre future demande.
        - generic [ref=e321]:
          - generic [ref=e322]:
            - paragraph [ref=e323]: Chargement du formulaire…
            - button "Afficher le formulaire" [ref=e324] [cursor=pointer]
          - link "Ouvrir la page Devis" [ref=e325] [cursor=pointer]:
            - /url: /fr/quote
  - complementary "ÉCHANTILLON DE PRÉSENTATION" [ref=e326]:
    - paragraph [ref=e330]: "Présentation provisoire : images illustratives et contenu à valider. Aucun projet ni produit présenté n’est une référence commerciale confirmée."
  - contentinfo [ref=e331]:
    - generic [ref=e332]:
      - generic [ref=e333]:
        - link "TIME STONE MARBRE & PIERRE" [ref=e334] [cursor=pointer]:
          - /url: /fr
          - generic [ref=e335]:
            - generic [ref=e338]: TIME STONE
            - generic [ref=e339]: MARBRE & PIERRE
        - paragraph [ref=e340]: La matière. Le temps. L’architecture.
      - generic [ref=e341]:
        - heading "Explorer" [level=2] [ref=e342]
        - navigation "Explorer" [ref=e343]:
          - link "Accueil" [ref=e344] [cursor=pointer]:
            - /url: "#home"
          - link "Collection" [ref=e345] [cursor=pointer]:
            - /url: "#collection"
          - link "Applications" [ref=e346] [cursor=pointer]:
            - /url: "#applications"
          - link "À propos" [ref=e347] [cursor=pointer]:
            - /url: "#about"
          - link "Carrière" [ref=e348] [cursor=pointer]:
            - /url: "#quarry"
          - link "Contact" [ref=e349] [cursor=pointer]:
            - /url: "#contact"
      - generic [ref=e350]:
        - heading "Les matières" [level=2] [ref=e351]
        - navigation "Les matières" [ref=e352]:
          - link "Calcaire" [ref=e353] [cursor=pointer]:
            - /url: /fr/products?category=limestone
          - link "Marbre" [ref=e354] [cursor=pointer]:
            - /url: /fr/products?category=marble
          - link "Carreaux" [ref=e355] [cursor=pointer]:
            - /url: /fr/products?category=tiles
          - link "Blocs" [ref=e356] [cursor=pointer]:
            - /url: /fr/products?category=blocks
          - link "Sur mesure" [ref=e357] [cursor=pointer]:
            - /url: /fr/products?category=custom
      - generic [ref=e358]:
        - heading "Langues" [level=2] [ref=e359]
        - navigation "Langues" [ref=e360]:
          - link "Français" [ref=e361] [cursor=pointer]:
            - /url: /fr
          - link "English" [ref=e362] [cursor=pointer]:
            - /url: /en
          - link "العربية" [ref=e363] [cursor=pointer]:
            - /url: /ar
    - generic [ref=e364]:
      - paragraph [ref=e365]: TIME STONE · Présentation de développement
      - paragraph [ref=e366]: Images temporaires issues des maquettes approuvées. Informations commerciales à confirmer.
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
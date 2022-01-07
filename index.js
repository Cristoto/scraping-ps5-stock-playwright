const { chromium } = require("playwright");

const shops = [
  {
    vendor: "Game",
    hasSchema: false,
    url: "https://www.game.es/consola-playstation-5-playstation-5-183224",
    checkStock: async ({ page }) => {
      const content = await page.textContent("h4.buy--type:has(span.cm-txt)");

      return content.toLowerCase().includes("COMPRAR".toLowerCase());
    },
  },
  {
    vendor: "MediaMarkt Canarias",
    hasSchema: false,
    url: "https://canarias.mediamarkt.es/products/consola-mando-juegos-sony-ps5-825-gb-4k-hdr-blanco-y-negro-dualsense-negro-ratchet-clank-mxgp-2020-fifa-2022?variant=39731924598844",
    checkStock: async ({ page }) => {
      const content = await page.textContent(
        "form#AddToCartForm:has(button#AddToCart)"
      );

      return content.toLowerCase().includes("COMPRAR".toLowerCase());
    },
  },
  {
    vendor: "Fnac",
    hasSchema: false,
    url: "https://www.fnac.es/n127487/Playstation/Consolas-PS5",
    checkStock: async ({ page }) => {
      const elementHandles = await page.$$("span.Dispo-txt");
      for (const elementHand of elementHandles) {
        const text = await elementHand.innerText();
        const hasStock = text.toLowerCase().includes("En stock".toLowerCase());

        if (hasStock) {
          return true;
        }
      }

      return false;
    },
  },
  {
    vendor: "Amazon",
    hasSchema: false,
    url: "https://www.amazon.es/Playstation-Consola-PlayStation-5/dp/B08KKJ37F7/",
    checkStock: async ({ page }) => {
      const addToCartButton = await page.$$("#add-to-cart-button");
      return addToCartButton.length > 0;
    },
  },
  {
    vendor: "El corte inglés - PS5 Digital + Dual Sense",
    hasSchema: false,
    url: "https://www.elcorteingles.es/videojuegos/A39115666-ps5-digital--dual-sense/",
    checkStock: async ({ page }) => {
      const content = await page.textContent("#js_add_to_cart_desktop");

      return !content
        .toLowerCase()
        .includes("Agotado temporalmente".toLowerCase());
    },
  },
  {
    vendor:
      "El corte inglés - PlayStation 5 + Ratchet & Clank: Una Dimensión Aparte + Destruction AllStars + 20€ Fondos",
    hasSchema: false,
    url: "https://www.elcorteingles.es/videojuegos/A40110604-playstation-5--ratchet-and-clank-una-dimension-aparte--destruction-allstars--20-fondos-monedero/",
    checkStock: async ({ page }) => {
      const content = await page.textContent("#js_add_to_cart_desktop");

      return !content
        .toLowerCase()
        .includes("Agotado temporalmente".toLowerCase());
    },
  },
  {
    vendor: "El corte inglés - PS5 + Dual Sense",
    hasSchema: false,
    url: "https://www.elcorteingles.es/videojuegos/A39115651-ps5--dual-sense/",
    checkStock: async ({ page }) => {
      const content = await page.textContent("#js_add_to_cart_desktop");

      return !content
        .toLowerCase()
        .includes("Agotado temporalmente".toLowerCase());
    },
  },
  /*{
    vendor: "MediaMarkt PS5 Lector",
    url: "https://www.mediamarkt.es/es/product/_consola-sony-ps5-825-gb-4k-hdr-blanco-1487016.html",
    hasSchema: true, //OutOfStock -> Fetch y comprobar el schema
    checkStock: async ({ page }) => {
      const ee = await page.$(
        `div[data-product-online-status='CURRENTLY_NOT_AVAILABLE']`
      );
      console.log(ee);
      const content = await page.textContent(
        `[data-product-online-status='CURRENTLY_NOT_AVAILABLE']`
      );

      console.log(content);

      return content.toLowerCase().includes("COMPRAR".toLowerCase());
    },
  },*/
];

(async () => {
  const browser = await chromium.launch({ headless: false });

  for (const shop of shops) {
    const { vendor, url, checkStock } = shop;

    const page = await browser.newPage();
    await page.goto(url);
    const isStock = await checkStock({ page });
    await page.screenshot({ path: `screenshots/${vendor}.png` });
    await page.close();

    console.log(
      `${vendor}: ${isStock ? "HAS STOCK!!! 😃" : "Out of Stock 😥"}`
    );
  }

  await browser.close();
})();

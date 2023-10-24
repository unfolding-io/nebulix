# Nebulix | Astro + Static CMS

[![License: CC BY-ND 4.0](https://img.shields.io/badge/License-CC_BY--ND_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nd/4.0/)




A Universe of Possibilities: Blogs, Portfolios, Webshop, Restaurant Menus, and Beyond.



![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-00-start.jpg)

## Notice

__This theme is currently under development, and until we reach version 1.0.0, there is a possibility that upgrading could lead to errors.__

## 🛠️Deploy
Easily deploy this theme to Netlify with a single click, and conveniently update environment variables afterward on Netlify.



[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/unfolding-io/nebulix#BLOG_SLUG=blog&PORTFOLIO_SLUG=work&SHOP_SLUG=shop&MENU_SLUG=menu&WEBSITE_LANGUAGE=en&CURRENCY=USD&UNITS=metric&NODE_VERSION=18)


## Constellations of Features:

-   📰 Chart Your Path with a Blog
-   🖼 Showcase Your Stellar Portfolio
-   🍝 Illuminate Culinary Voyages with a Restaurant Menu
-   🛒 Launch Your Webshop Powered by Snipcart
-   🔍 SEO Constellations: Canonical URLs and OpenGraph radiance
-   🧭 Navigational Maps: Sitemap Support
-   📑Language of the Stars: Markdown & MDX Support
-   📝 Static CMS Ready for Galactic Exploration
- 	🐵 Mailchimp newsletter form
-   🕵 Unveil Hidden Constellations with Full Text Search using Pagefind

## ♻️ Page Speed and Emissions
Experience the green and swift capabilities of Nebulix. With an impressively low emission of 0.05g - 0.07g CO2 per page visit and consistently achieving a lighthouse score between 98 and 100, Nebulix ensures both speed and environmental consciousness for your website.

## 🚀 Getting Started

### 1. Setting up the .env file

rename the `env.txt` to `.env` and fill in your details

```ENV
BLOG_SLUG=blog
PORTFOLIO_SLUG=work
SHOP_SLUG=shop
MENU_SLUG=menu
WEBSITE_LANGUAGE=en
CURRENCY=USD
UNITS=metric
SNIPCART_KEY=<your-snipcart-public-key>
NODE_VERSION=18
NEWSLETTER_PROVIDER=mailchimp
MAILCHIMP_API_KEY=XXXXXXXXXXXXXXXX-us21
MAILCHIMP_SERVER_PREFIX=us21	
MAILCHIMP_LIST_ID=XXXXXXXXX

FROM_EMAIL_ADDRESS=[test@email.com](mailto:test@email.com)
TO_EMAIL_ADDRESS=[test@email.com](mailto:test@email.com)

MAILGUN_API_KEY=XXXXXXXXX
MAILGUN_DOMAIN=XXXXXXXXX
MAILGUN_API_URL=<https://api.eu.mailgun.net>

POSTMARK_SERVER_TOKEN=XXXXXXXXX

SLACK_CHANNEL_ID=XXXXXXXXX
SLACK_TOKEN=XXXXXXXXX

```

### 2. Configure your Static CMS Backend

Navigate to `src/pages/admin.astro` and provide your Git repository details. You can find a list of all supported Git backends at:
<https://www.staticcms.org/docs/backends-overview>


**_Gitlab Example:_**

```javascript

const config = {
	locale: lang,
	site_url: url,
	logo_url: 'https://nebulix.unfolding.io/nebulix-logo.svg',
	local_backend: true,
	backend: {
		name: 'gitlab',
		repo: '/<your-gitlab-repo>',
		auth_type: 'pkce', // Required for pkce
		app_id: 'xxxx', // Application ID from your GitLab settings
		commit_messages: {
			create: 'Create {{collection}} "{{slug}}"',
			update: 'Update {{collection}} "{{slug}}"',
			delete: 'Delete {{collection}} "{{slug}}"',
			uploadMedia: 'Upload "{{path}}"',
			deleteMedia: 'Delete "{{path}}"'
		}
	},
	search: 'true',
    ....
}

```

### 3. Add your site to the astro config

```javascript

export default defineConfig({
	site: 'https://your-website.com',
    ....

```

### 4. Install dependencies

```bash
$ npm install
```

### 🛠️ 5. Start Development server

```bash
$ npm run dev
```

If you wish to engage the local backend:

```bash
$ npm run cms-proxy-server
```

Now you can open Static CMS on http://localhost:4321/admin/


## ❌ Removing Collections
If your cosmic journey excludes a blog, portfolio, shop, or restaurant menu, simply remove the corresponding documents from the `src/content`. Additionally, erase the page templates from `src/pages` .


## 🛸 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `npm install`              | Installs dependencies                            |
| `npm run dev`              | Starts local dev server at `localhost:4321`      |
| `npm run cms-proxy-server` | Starts Static CMS proxy server for local-backend |
| `npm run build`            | Build your production site to `./dist/`          |
| `npm run preview`          | Preview your build locally, before deploying     |
| `npm run astro ...`        | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`  | Get help using the Astro CLI                     |

## 📁 Documentation
Learn how to harness the power of Static CMS and craft a distinctive website that stands out from the crowd.

[Documentation](https://nebulix.unfolding.io/blog/tag/docs)

## 🌐 Demo

Witness the extraordinary speed of Nebulix in action.

[Demo](https://nebulix.unfolding.io)

## 👀 Want to learn more about Astro?

Check out [Astro documentation](https://docs.astro.build) or jump into Astro's [Discord server](https://astro.build/chat).

## 📚 Tech Stack

Astro, MDX, Vue, TailwindCSS, Pagefind, Snipcart

## 🛟 Support

If you encounter any issues or bugs, we encourage you to open an issue in the repository. To help us quickly address the problem, please provide detailed information about the bug and steps to reproduce it.

## 👑 Premium Support

For those seeking priority assistance, we offer premium support services. Do you need support, custom intergrations, design, or development? Feel free to reach out to me by email at [hello@unfolding.io.](mailto:hello@unfolding.io.) find me on [UpWork](https://www.upwork.com/freelancers/~01dcde6b3915c74c30) Im here to help!

## ☕️ Buy me a coffee

Want to power my late night coding sessions? [Buy me a coffee](https://nebulix.unfolding.io/shop/buy-me-a-coffee/)

## 📝 License

Want to get rid of the attribution? Simply [purchase a license](https://nebulix.unfolding.io/shop/nebulix-license/) and you're good to go.

## 🚕 Roadmap

As we journey towards v1.0, our path includes enriching the page builder with a diverse array of new blocks, upgrading dependencies to ensure optimal performance, and introducing exciting features. We're eager to hear from you! If you have any feature requests, please feel free to reach out and let us know.


## 📸 Screenshots

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-01-shop.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-02-shop-category.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-03-shop-product.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-04-shop-product.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-05-shop-product-dark.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-06-blogpost.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-07-portfolio.jpg)

![Nebulix](https://nebulix.unfolding.io/screenshots/nebulix-08-footer.jpg)





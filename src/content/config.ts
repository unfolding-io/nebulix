import { defineCollection, reference, z } from 'astro:content'
import { getIconName } from '@util/helpers'
 

const blocks = z
	.array(
		z.object({
			template: z.string().optional(),
			page_type: z.string().optional(),
			surface: z.string().optional(),
			animate: z.boolean().optional(),
			centered: z.boolean().optional(),
			container: z.string().optional(),
			post_tag:  z.array(z.string()).optional(),
			portfolio_tag:  z.array(z.string()).optional()
			.optional(),
			products: z.array(z.string()).optional(),
			categories: z.array(z.string()).optional(),
			component: z.string(),
			reverse: z.boolean().optional(),
			title: z.string().optional(),
			thumbnail: z.string().optional(),
			content: z.string().optional(),
			block_class: z.string().optional(),
			image_size: z.string().optional(),
			count: z.number().optional(),
			aspect: z.number().or(z.string()).transform((val) => {
				if (typeof val === 'string') return parseFloat(val)
				if (!!val && val > 0) return val
				return 0
			}).optional(),
			images: z
				.array(
					z.object({
						title: z.string().optional(),
						image: z.string()
					})
				)
				.optional(),
			buttons: z
				.array(
					z.object({
						href: z.string(),
						className: z.string().optional(),
						label: z.string(),
						color: z.string().optional(),
						icon: z.string().transform((val) => getIconName(val)).optional(),
						icon_only: z.boolean().optional()
					})
				)
				.optional(),
			features: z
				.array(
					z.object({
						href: z.string().optional(),
						className: z.string().optional(),
						label: z.string().optional(),
						content: z.string().optional(),
						color: z.string().optional(),
						icon: z.string().transform((val) => getIconName(val)).optional(),
					})
				)
				.optional()
		})
	)
	.optional()

const style = z.object({
	template: z.string().optional(),
	card_template: z.string().optional(),
	hero_template: z.string().optional(),
	hero_surface: z.string().optional(),
	hero_image_opacity: z.string().optional(),
	container: z.string().optional(),
	page_class: z.string().optional(),
	content_class: z.string().optional(),
	block_class: z.string().optional(),
	hero_class: z.string().optional()
})

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),
		tag: z.array(z.string()).optional(),
		hero_buttons: z
			.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			)
			.optional(),
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),

		nav: z
			.object({
				next: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional(),

				prev: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional()
			})
			.optional(),

		blocks: blocks,
		style: style
	})
})

const project = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),
		tag: z.array(z.string()).optional(),
		features: z
			.array(
				z.object({
					name: z.string(),
					value: z.string()
				})
			)
			.optional(),
		hero_buttons: z
			.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			)
			.optional(),
		date: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),

		style: style,
		blocks: blocks,
		nav: z
			.object({
				next: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional(),

				prev: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional()
			})
			.optional()
	})
})

const product = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		id: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),
		price: z
			.number()
			.or(z.string())
			.optional()
			.transform((val) => {
				if (typeof val === 'string') return parseFloat(val)
				if (!!val && val > 0) return val
				return 0.0
			}),
		offer_price: z
			.number()
			.or(z.string())
			.optional()
			.transform((val) => {
				if (typeof val === 'string') return parseFloat(val)
				if (!!val && val > 0) return val
				return 0.0
			}),
		taxable: z.boolean(),
		tax_included: z.boolean(),
		in_stock: z.boolean().optional(),
		min: z.number().optional(),
		max: z.number().optional(),
		is_digital: z.boolean(),
		guid: z.string().optional(),
		shipping: z
			.object({
				weight: z.number(),
				height: z.number().optional(),
				width: z.number().optional(),
				length: z.number().optional()
			})
			.optional(),

		category: z.array(z.string()).optional(),
		features: z
			.array(
				z.object({
					name: z.string(),
					value: z.string()
				})
			)
			.optional(),
		hero_buttons: z
			.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			)
			.optional(),
		variations: z
			.array(
				z.object({
					name: z.string(),
					id: z.string(),
					show_images: z.boolean().optional(),
					options: z
						.array(
							z.object({
								label: z.string(),
								id: z.string(),
								price: z
									.number()
									.or(z.string())
									.optional()
									.transform((val) => {
										if (typeof val === 'string') return parseFloat(val)
										if (!!val && val > 0) return val
										return 0.0
									}),
								thumbnail: z.string().optional()
							})
						)
						.optional()
				}).optional(),
			)
			.optional(),
		date: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),

		style: style,
		blocks: blocks,
		nav: z
			.object({
				next: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional(),

				prev: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional()
			})
			.optional()
	})
})

const menu = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),
		date: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		categories: z.array(
			z.object({
				title: z.string(),
				intro: z.string().optional(),
				menu_items: z.array(
					z.object({
						title: z.string(),
						intro: z.string().optional(),
						thumbnail: z.string().optional(),
						price: z
							.array(
								z.object({
									label: z.string().optional(),
									price: z
										.number()
										.or(z.string())
										.optional()
										.transform((val) => {
											if (typeof val === 'string') return parseFloat(val)
											if (!!val && val > 0) return val
											return 0.0
										})
								})
							)
							.optional(),

						details: z
							.object({
								allergens: z.array(z.string()).optional().or(z.string()),
								labels: z.array(z.string()).optional().or(z.string())
							})
							.optional()
					})
				)
			})
		),
		style: z.object({
			template: z.string().optional(),
			hero_template: z.string().optional(),
			container: z.string().optional(),
			page_class: z.string().optional(),
			content_class: z.string().optional(),
			block_class: z.string().optional(),
			hero_class: z.string().optional()
		}),
		hero_buttons: z
			.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			)
			.optional(),
		nav: z
			.object({
				next: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional(),

				prev: z
					.array(
						z.object({
							href: z.string(),
							label: z.string()
						})
					)
					.optional()
			})
			.optional()
	})
})

const page = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		intro: z.string().optional(),
		thumbnail: z.string(),
		og_image: z.string().optional(),
		template: z.string().optional(),
		container: z.string().optional(),
		hero_template: z.string().optional(),

		hero_buttons: z
			.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			)
			.optional(),

		blocks: blocks,

		style: style

		
	})
})

const config = defineCollection({
	type: 'content',
	schema: z.object({
		sitename: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		newsletter_text: z.string().optional(),
		footer_text: z.string().optional(),
		per_page: z.number().optional(),
		intro: z.string().optional(),
		thumbnail: z.string().optional(),
		og_image: z.string().optional(),
		surface: z.array(z.object({
				name: z.string(),
				class: z.string()
			})).optional(),
		hero_buttons: z
			.array(
				z.object({
					href: z.string(),
					className: z.string().optional(),
					label: z.string(),
					color: z.string().optional(),
					icon: z.string().transform((val) => getIconName(val)).optional(),
					icon_only: z.boolean().optional()
				})
			)
			.optional(),

		team: z
			.array(
				z.object({
					name: z.string(),
					position: z.string().optional(),
					thumbnail: z.string().optional()
				})
			)
			.optional(),

		blog_tags: z
			.array(
				z.object({
					title: z.string(),
					name: z.string(),
					description: z.string(),
					thumbnail: z.string(),
					intro: z.string().optional(),
					body: z.string().optional(),		
					overwrite_style:z.boolean().optional(),
					hero_buttons: z
						.array(
							z.object({
							    href: z.string(),
								className: z.string().optional(),
								label: z.string(),
								color: z.string().optional(),
								icon: z.string().transform((val) => getIconName(val)).optional(),
								icon_only: z.boolean().optional()
							})
						)
						.optional()
				})
			)
			.optional(),

		project_tags: z
			.array(
				z.object({
					title: z.string(),
					name: z.string(),
					description: z.string(),
					thumbnail: z.string(),
					intro: z.string().optional(),
					body: z.string().optional(),		
					overwrite_style:z.boolean().optional(),
					hero_buttons: z
						.array(
							z.object({
							    href: z.string(),
								className: z.string().optional(),
								label: z.string(),
								color: z.string().optional(),
								icon: z.string().transform((val) => getIconName(val)).optional(),
								icon_only: z.boolean().optional()
							})
						)
						.optional()
				})
			)
			.optional(),

		product_categories: z
			.array(
				z.object({
					title: z.string(),
					name: z.string(),
					description: z.string(),
					thumbnail: z.string(),
					intro: z.string().optional(),
					body: z.string().optional(),	
					overwrite_style:z.boolean().optional(),
					style:style,
					hero_buttons: z
						.array(
							z.object({
							    href: z.string(),
								className: z.string().optional(),
								label: z.string(),
								color: z.string().optional(),
								icon: z.string().transform((val) => getIconName(val)).optional(),
								icon_only: z.boolean().optional()
							})
						)
						.optional()
				})
			)
			.optional(),

		style: style.optional(),

		main_menu: z
			.array(
				z.object({
					href: z.string(),
					label: z.string()
				})
			)
			.optional(),

		footer_menus: z
			.array(
				z.object({
					label: z.string(),
					links: z.array(
					z.object({
						href: z.string(),
						label: z.string()
					})
				)
				})
			)
			.optional(),

		social: z
			.array(
				z.object({
					href: z.string(),
					label: z.string(),
					icon: z.string().transform((val) => getIconName(val)),
				})
			)
			.optional()
	})
})

export const collections = { blog, page, menu, project, product, config }

export function slugify(str: string): string {
	if (!str || str === '') return ''
	str = str.replace(/^\s+|\s+$/g, '')
	str = str.toLowerCase()
	const from =
		'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;'
	const to =
		'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------'
	for (let i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
	}
	str = str
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')

	return str
}

export function getArchiveNav(
	count: number,
	index: number,
	posts: any[]
): { prev: any; next: any } {
	 
	if (count < 2) return { prev: null, next: null }
	if (count === 2 && index === 0) return { prev: null, next: posts[1] }
	if (count === 2 && index === 1) return { prev: posts[0], next: null }
	
	if (index < 1) return { prev: posts[count - 1], next: posts[index + 1] }
	if (index === count - 1) return { prev: posts[index - 1], next: posts[0] }
	return {
		prev: posts[index - 1],
		next: posts[index + 1]
	}
}

export function getPagination(
	posts: any[],
	filters: string[] | any,
	data: any,
	type: string
): Array<{ params: { slug: string }; props: any }[] | false> {
	return filters.flatMap((filter) => {
		const filterSlug = slugify(filter)
		const filterPosts = posts.filter((post) => post.data[type] && post.data[type].includes(filter))

		if (filterPosts.length === 0) return false
		const totalPages = Math.ceil(filterPosts.length / data.per_page)

		if (totalPages > 1) {
			let params: { params: { slug: string }; props: any }[] = []

			for (let i = 1; i <= totalPages; i++) {
				const sufix = i > 1 ? `/${i}` : ''
				params = [
					...params,
					{
						params: {
							slug: `${filterSlug}${sufix}`
						},
						props: {
							lastPage: totalPages,
							currentPage: i,
							filter_type: type,
							filters: filters,
							filter: filter,
							page: filterPosts.slice(i * data.per_page - data.per_page, i * data.per_page)
						}
					}
				]
			}

			return params
		}

		return [
			{
				params: {
					slug: filterSlug
				},
				props: {
					lastPage: 1,
					currentPage: '1',
					filter_type: type,
					filters: filters,
					filter: filter,
					page: filterPosts
				}
			}
		]
	})
}

export function getGridImageSizes(container: string): string {
	if (container === 'full')
		return '(min-width: 640px) calc(55rem / 2 - 0.66rem),(min-width: 768px) calc(55rem / 3 - 0.66rem), (min-width: 1024px) calc(65rem / 4 - 0.66rem), (min-width: 1536px) calc(75rem / 4 - 0.66rem), calc(100vw - 4rem)'

	if (container === 'xl')
		return '(min-width: 640px) calc(55rem / 2 - 0.66rem),(min-width: 768px) calc(55rem / 3 - 0.66rem), (min-width: 1024px) calc(65rem / 4 - 0.66rem), calc(100vw - 4rem)'

	if (container === 'lg' || container === 'md')
		return '(min-width: 640px) calc(55rem / 2 - 0.66rem),(min-width: 768px) calc(55rem / 3 - 0.66rem), calc(100vw - 4rem)'

	if (container === 'sm')
		return '(min-width: 640px) calc(55rem / 2 - 0.66rem),(min-width: 768px) calc(55rem / 3 - 0.66rem), calc(100vw - 4rem)'

	return 'calc(100vw - 4rem)'
}

export function getImageUrl(thumbnail: string | null): string {
	if (!thumbnail) return '#'
	return `/images/${thumbnail.split('/').pop()!.split('.')[0]}`
}

export function getImageName(thumbnail: string | null): string | null {
	if (!thumbnail) return null
	return thumbnail.split('/').pop()!.split('.')[0]
}

export function getImageTransitionName(thumbnail: string | null): string {
	if (!thumbnail) return `not_found_${Math.random()}`
	return `image_${thumbnail.split('/').pop()!.split('.')[0]}`
}

export function getCategoryData(categories: any[] | undefined, category: string): any | null {
 
	if (!categories || categories.length < 0) return null 
	return categories.filter((c) => c.name.trim() === category).pop()
}

export function getIconName(icon: string | null): string {
	if (!icon) return 'right'
	return icon.split('/').pop()!.split('.')[0]
}

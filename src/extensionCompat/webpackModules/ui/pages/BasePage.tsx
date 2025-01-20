import type { CardProps } from '../Card/Card';

import React from '@moonlight-mod/wp/react';
import spacepack from '@moonlight-mod/wp/spacepack_spacepack';
import Card from '../Card/Card';

const SearchBar: any = Object.values(spacepack.findByCode('hideSearchIcon')[0].exports)[0];


export default function BasePage({ cards }: {
	cards: CardProps[];
}) {
	// TODO: Filtering, search, etc.
	return <>
		{/* <SearchBar
			size={SearchBar.Sizes.MEDIUM}
			query={query}
			onChange={(v: string) => setQuery(v.toLowerCase())}
			onClear={() => setQuery('')}
			autoFocus={true}
			autoComplete='off'
			inputProps={{
				autoCapitalize: 'none',
				autoCorrect: 'off',
				spellCheck: 'false'
			}}
		/>
		<FilterBar filter={filter} setFilter={setFilter} selectedTags={selectedTags} setSelectedTags={setSelectedTags} /> */}

		{cards.map(card => <Card {...card} />)}
	</>;
}

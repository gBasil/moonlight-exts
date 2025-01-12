import type { CardProps } from '../Card/Card';

import React from '@moonlight-mod/wp/react';
import Card from '../Card/Card';

export default function BasePage({ cards }: {
	cards: CardProps[];
}) {
	// TODO: Filtering, search, etc.
	return <>
		{cards.map(card => <Card {...card} />)}
	</>;
}

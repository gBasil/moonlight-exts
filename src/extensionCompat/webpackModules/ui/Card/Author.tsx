import type { CardProps } from './Card';

import React from '@moonlight-mod/wp/react';

type Author = CardProps['authors'][0];

type Props = {
	author: Author;
};

export default function Author({ author }: Props) {
	return <AuthorContainer author={author}>
		{/* TODO: Render Discord avatar if `discordId` is present. */}
		{author.name}
	</AuthorContainer>;
}

function AuthorContainer({ author, children }: Props & { children: React.ReactNode; }) {
	if (author.website !== undefined) return (
		<a href={author.website} target='_blank'>
			{children}
		</a>
	);

	return <span>{children}</span>;
}

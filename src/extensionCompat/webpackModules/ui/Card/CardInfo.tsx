import type { CardProps } from './Card';

import React from '@moonlight-mod/wp/react';
import { Text } from '@moonlight-mod/wp/discord/components/common/index';
import Author from './Author';

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div style={{ marginRight: '1em' }}>
			<Text variant='eyebrow'>
				{title}
			</Text>

			<Text variant='text-sm/normal'>{children}</Text>
		</div>
	);
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
	return (
		<span
			style={{
				borderRadius: '.1875rem',
				padding: '0 0.275rem',
				marginRight: '0.4em',
				backgroundColor: color,
				color: '#fff'
			}}
		>
			{children}
		</span>
	);
}

export default function CardInfo({ authors, tags, version }: Pick<CardProps, 'authors' | 'tags' | 'version'>) {
	return (
		<>
			{authors !== undefined && (
				<InfoSection title='Authors'>
					{authors.map((author, i) => {
						const comma = i !== authors.length - 1 ? ', ' : '';

						return <>
							<Author key={i} author={author} />
							{comma}
						</>;
					})}
				</InfoSection>
			)}

			{tags !== undefined && (
				<InfoSection title='Tags'>
					{tags.map((tag, i) => (
						<Badge key={i} color='var(--brand-500)'>
							{tag}
						</Badge>
					))}
				</InfoSection>
			)}

			{version !== undefined && (
				<InfoSection title='Version'>
					<span>{version}</span>
				</InfoSection>
			)}
		</>
	);
}

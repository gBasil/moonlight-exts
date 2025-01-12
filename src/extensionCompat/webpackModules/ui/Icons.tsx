import React from '@moonlight-mod/wp/react';
import vencord from '../../static/vencord.webp';

export type IconProps = {
	size: number;
};

const SIZE = 128;

function Svg(props: IconProps & { children: React.JSX.Element; }) {
	return <svg
		width={props.size}
		height={props.size}
		viewBox={`0 0 ${SIZE} ${SIZE}`}
		xmlns='http://www.w3.org/2000/svg'
	>
		{props.children}
	</svg>;
}

export function VencordIcon(props: IconProps) {
	return <Svg {...props}>
		<image href={vencord} height={SIZE} width={SIZE} />
	</Svg>;
}

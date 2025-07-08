import { TwMainColor } from '@/data/types'
import { Route } from '@/data/types'
import getColorClass from '@/utils/getColorClass'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

export interface BadgeProps {
	className?: string
	roundedClassName?: string
	name: ReactNode
	color?: TwMainColor
	href?: Route
}

const Badge: FC<BadgeProps> = ({
	className = 'relative',
	roundedClassName = 'rounded-full',
	name,
	color = 'blue',
	href,
}) => {
	// Do not display the badge if the name is 'Radio Stations'
	if (
		(typeof name === 'string' && name === 'Radio Stations') ||
		// If name is a ReactNode that is a string (e.g., from JSX)
		(Array.isArray(name) && name.join('') === 'Radio Stations')
	) {
		return null;
	}
	const CLASSES = `nc-Badge inline-flex px-2.5 py-1 font-medium text-xs ${roundedClassName} ${className}`
	return !!href ? (
		<Link
			href={href ?? '/'}
			className={`transition-colors duration-300 ${CLASSES} ${getColorClass(
				color,
			)}`}
		>
			{name}
		</Link>
	) : (
		<span className={`${CLASSES} ${getColorClass(color, false)} `}>{name}</span>
	)
}

export default Badge

'use client';

import { useRouter } from 'next/navigation';
import styles from './UrlChip.module.css';
import { formatFieldName, extractCategoryAndId } from '@/lib/helper';

interface UrlChipProps {
	url: string;
}

export default function UrlChip({ url }: UrlChipProps) {
	const router = useRouter();
	const parsed = extractCategoryAndId(url);

	if (!parsed) return <span className={styles.chip}>{url}</span>;

	const { category, id } = parsed;
	const singularLabel = getSingularLabel(category);
	const label = `${singularLabel} ${id}`;

	return (
		<button className={styles.chip} onClick={() => router.push(`/${category}/${id}`)} aria-label={`View ${singularLabel} ${id}`} type="button">
			{label}
		</button>
	);
}

function getSingularLabel(category: string): string {
	const map: Record<string, string> = {
		people: 'Person',
		planets: 'Planet',
		films: 'Film',
		species: 'Species',
		vehicles: 'Vehicle',
		starships: 'Starship',
	};
	return map[category] ?? formatFieldName(category);
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { SwapiCategory } from '@/types';
import { fetchById } from '@/lib/swapi';
import DetailCard from '@/components/DetailCard/DetailCard';
import styles from './page.module.css';

const VALID_CATEGORIES: SwapiCategory[] = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

const EXCLUDED_FIELDS = new Set(['url']);

interface Props {
	params: Promise<{ category: string; id: string }>;
}

export default async function DetailPage({ params }: Props) {
	const { category, id } = await params;

	if (!VALID_CATEGORIES.includes(category as SwapiCategory)) {
		notFound();
	}

	const data = await fetchById<Record<string, unknown>>(category as SwapiCategory, id);

	const fields = Object.entries(data).filter(([key]) => !EXCLUDED_FIELDS.has(key));
	const title = String(data.title || data.name);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.topBar}>
					<Link href="/" className={styles.backBtn}>
						← Back to Explorer
					</Link>
					<span className={styles.categoryTag}>{category}</span>
				</div>

				<h1 className={styles.title}>{title}</h1>
				<dl className={styles.grid}>
					{fields.map(([key, value]) => (
						<DetailCard key={key} fieldKey={key} value={value} />
					))}
				</dl>
			</div>
		</div>
	);
}

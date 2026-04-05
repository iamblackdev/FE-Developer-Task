'use client';

import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './error.module.css';
import Link from 'next/link';

interface Props {
	error: Error;
}

export default function Error({ error }: Props) {
	return (
		<div className={styles.wrapper}>
			<ErrorMessage message={error.message} />
			<Link href="/" className={styles.retryBtn}>
				Back to Home
			</Link>
		</div>
	);
}

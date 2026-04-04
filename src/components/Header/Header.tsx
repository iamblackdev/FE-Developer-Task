import styles from './Header.module.css';

export default function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<div className={styles.logo}>
					<span className={styles.icon} aria-hidden="true">
						✦
					</span>
					<span className={styles.title}>Star Wars Explorer</span>
				</div>
			</div>
		</header>
	);
}

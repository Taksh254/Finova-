import React from "react";
import { CheckCircle2, Layers } from "lucide-react";
import styles from "./ModulePlaceholder.module.css";

interface PlannedFeature {
  title: string;
  description: string;
  schemaReady: string;
}

interface ModulePlaceholderProps {
  moduleName: string;
  description: string;
  icon: React.ReactNode;
  plannedFeatures: PlannedFeature[];
}

export function ModulePlaceholder({
  moduleName,
  description,
  icon,
  plannedFeatures,
}: ModulePlaceholderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.iconBox}>{icon}</div>
          <div className={styles.headingGroup}>
            <h2 className={styles.title}>{moduleName}</h2>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
        <span className={styles.stageBadge}>Foundation Active &bull; Phase 2</span>
      </div>

      <span className={styles.sectionTitle}>Engineered Data Schema &amp; Pipeline Ready</span>

      <div className={styles.featuresGrid}>
        {plannedFeatures.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <div className={styles.featureHeader}>
              <CheckCircle2 size={14} color="var(--color-positive)" />
              <span>{f.title}</span>
            </div>
            <p className={styles.featureDesc}>{f.description}</p>
            <span className={styles.statusTag}>
              <Layers size={10} style={{ display: "inline", marginRight: 4 }} />
              Prisma Model: {f.schemaReady}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import "../CSS/PageSkeleton.css";

export default function PageSkeleton() {
  return (
    <section className="page-skeleton" aria-label="Loading page" aria-busy="true">
      <div className="skeleton-mobile-title">
        <span className="sk sk-square" />
        <span className="sk sk-title" />
        <span className="sk sk-square" />
      </div>

      <div className="skeleton-stat-row">
        {Array.from({ length: 4 }, (_, index) => (
          <article className="skeleton-stat" key={index}>
            <span className="sk sk-circle" />
            <div><span className="sk sk-line short" /><span className="sk sk-line value" /><span className="sk sk-line tiny" /></div>
          </article>
        ))}
      </div>

      <div className="skeleton-toolbar">
        <span className="sk sk-control wide" /><span className="sk sk-control" /><span className="sk sk-control" />
      </div>

      <div className="skeleton-content-grid">
        <section className="skeleton-main-panel">
          <div className="skeleton-panel-head"><span className="sk sk-line heading" /><span className="sk sk-control small" /></div>
          <div className="skeleton-card-grid">
            {Array.from({ length: 6 }, (_, index) => (
              <article className="skeleton-content-card" key={index}>
                <span className="sk sk-media" />
                <div><span className="sk sk-line heading" /><span className="sk sk-line" /><span className="sk sk-line short" /></div>
              </article>
            ))}
          </div>
        </section>
        <aside className="skeleton-side-panel">
          <span className="sk sk-line heading" />
          {Array.from({ length: 5 }, (_, index) => <span className="sk sk-side-row" key={index} />)}
        </aside>
      </div>
      <span className="sr-only">Loading content</span>
    </section>
  );
}

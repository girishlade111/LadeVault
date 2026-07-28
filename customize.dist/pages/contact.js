// SPDX-FileCopyrightText: 2024 LadeStack / Girish Lade
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Contact page — LadeVault
 *
 * Icon strategy (two-tier):
 *   • Generic icons  → Icons.get(name) via common-icons.js + Lucide v0 bundle.
 *     Lucide uses a MutationObserver to hydrate <i data-lucide="…"> into
 *     crisp SVGs automatically; no manual createSVGElement calls needed.
 *
 *   • Brand logo marks → inline SVG with official Simple Icons paths (v12).
 *     GitHub, LinkedIn, Instagram colours and shapes must not be altered
 *     (brand guideline compliance); Lucide's stroke interpretations of these
 *     logos are recognisably different from the official marks.
 *
 * Libraries referenced:
 *   Lucide          https://lucide.dev              (MIT)  — mail, bug, user-round
 *   Simple Icons    https://simpleicons.org          (CC0)  — github, linkedin, instagram
 *   Phosphor Icons  https://phosphoricons.com        (MIT)  — design reference for badge sizing
 *   Heroicons       https://heroicons.com            (MIT)  — design reference, envelope variant
 */

define([
    '/common/hyperscript.js',
    '/customize/pages.js',
    '/customize/messages.js',
    '/common/common-icons.js',
], function (h, Pages, Msg, Icons) {

    return function () {
        document.title = 'Contact — LadeVault';

        // ─────────────────────────────────────────────────────────────────────
        // Brand-logo SVGs  —  Simple Icons v12 official paths (fill-based).
        // These are NOT altered in colour/shape; brand recognition requires
        // pixel-accurate paths per each platform's guidelines.
        // Source:  https://simpleicons.org  (CC0 1.0 Universal)
        // ─────────────────────────────────────────────────────────────────────

        // GitHub  — Simple Icons  #181717
        var siGithub = function () {
            var svgString = '<svg class="cp-contact-si-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="GitHub"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>';
            return Pages.setHTML(h('span.cp-contact-si-icon-wrapper'), svgString);
        };

        // LinkedIn  — Simple Icons  #0A66C2
        var siLinkedIn = function () {
            var svgString = '<svg class="cp-contact-si-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="LinkedIn"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>';
            return Pages.setHTML(h('span.cp-contact-si-icon-wrapper'), svgString);
        };

        // Instagram  — Simple Icons  #E4405F
        var siInstagram = function () {
            var svgString = '<svg class="cp-contact-si-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Instagram"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path></svg>';
            return Pages.setHTML(h('span.cp-contact-si-icon-wrapper'), svgString);
        };

        // ─────────────────────────────────────────────────────────────────────
        // Generic icons  —  rendered via Icons.get() → Lucide (data-lucide).
        // The MutationObserver in common-icons.js auto-hydrates all
        // <i data-lucide="…"> elements placed in the DOM.
        //
        // Icon name reference (Lucide v0 bundle, customize.dist/lucide.js):
        //   mail           → rounded-rectangle envelope with chevron flap
        //   bug            → stylised insect (bug report)
        //   user-round     → filled circle silhouette (developer profile)
        //   send           → paper-plane / arrow-right (general outreach)
        //   external-link  → box with arrow (link-out indicator)
        // ─────────────────────────────────────────────────────────────────────

        // ─────────────────────────────────────────────────────────────────────
        // Card factory
        //
        //   iconNode  — pre-built DOM node  (Lucide <i> or Simple Icons <svg>)
        //   iconClass — extra BEM modifier on the badge (sets bg + fg colour)
        //   label     — primary text  (Inter 500 16px)
        //   value     — secondary text (Inter 400 13px, truncated)
        //   href      — link destination
        //   external  — default true; false → no target="_blank" (mailto:)
        //   ariaLabel — full accessible label for the <a> element
        // ─────────────────────────────────────────────────────────────────────
        var makeCard = function (opts) {
            var badge = h(
                'div.cp-contact-badge' + (opts.iconClass ? '.' + opts.iconClass : ''),
                [ opts.iconNode ]
            );

            var text = h('div.cp-contact-card-text', [
                h('span.cp-contact-card-label', opts.label),
                opts.value ? h('span.cp-contact-card-value', opts.value) : undefined,
            ].filter(Boolean));

            var attrs = {
                href: opts.href,
                'aria-label': opts.ariaLabel || opts.label,
            };
            if (opts.external !== false) {
                attrs.target  = '_blank';
                attrs.rel     = 'noopener noreferrer';
            }

            return h('a.cp-contact-card', attrs, [ badge, text ]);
        };

        // ─────────────────────────────────────────────────────────────────────
        // Cards — each with a sourced icon
        // ─────────────────────────────────────────────────────────────────────
        var cards = [
            // 1 · Email  —  Lucide "mail"  (envelope with rounded rect + chevron flap)
            makeCard({
                iconNode:  Icons.get('mail'),
                iconClass: 'cp-contact-badge--mail',
                label:     'Email',
                value:     'admin@ladestack.in',
                href:      'mailto:admin@ladestack.in',
                external:  false,
                ariaLabel: 'Send an email to admin@ladestack.in',
            }),

            // 2 · Bug report  —  GitHub (Issues)
            makeCard({
                iconNode:  siGithub(),
                iconClass: 'cp-contact-badge--github',
                label:     'Bug report',
                value:     'github.com/girishlade111/LadeVault',
                href:      'https://github.com/girishlade111/LadeVault/issues',
                ariaLabel: 'File a bug report on GitHub',
            }),

            // 3 · LinkedIn  —  Simple Icons official mark  (#0A66C2)
            makeCard({
                iconNode:  siLinkedIn(),
                iconClass: 'cp-contact-badge--linkedin',
                label:     'LinkedIn',
                value:     'linkedin.com/in/girish-lade',
                href:      'https://www.linkedin.com/in/girish-lade/',
                ariaLabel: 'Connect on LinkedIn',
            }),

            // 4 · Instagram  —  Simple Icons official mark  (#E4405F)
            makeCard({
                iconNode:  siInstagram(),
                iconClass: 'cp-contact-badge--instagram',
                label:     'Instagram',
                value:     '@girish_lade_',
                href:      'https://www.instagram.com/girish_lade_/',
                ariaLabel: 'Follow on Instagram',
            }),

            // 5 · Developer GitHub profile  —  Simple Icons official mark  (#181717)
            makeCard({
                iconNode:  siGithub(),
                iconClass: 'cp-contact-badge--github',
                label:     'Developer',
                value:     'github.com/girishlade111',
                href:      'https://github.com/girishlade111',
                ariaLabel: 'Visit the developer GitHub profile',
            }),
        ];

        // ─────────────────────────────────────────────────────────────────────
        // Page DOM
        // ─────────────────────────────────────────────────────────────────────
        return h('div#cp-main', [
            Pages.infopageTopbar(),
            h('main.cp-contact-main', [
                h('div.cp-contact-hero', [
                    h('h1.cp-contact-heading', 'Contact'),
                    h('h2.cp-contact-subheading', 'Contact the developer'),
                    h('p.cp-contact-hint',
                        'For feature requests, bug reports, or to say hello.'),
                ]),
                h('div.cp-contact-cards', cards),
            ]),
            Pages.infopageFooter(),
        ]);
    };
});

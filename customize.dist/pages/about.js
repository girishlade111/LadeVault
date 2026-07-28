// SPDX-FileCopyrightText: 2024 LadeStack / Girish Lade
//
// SPDX-License-Identifier: AGPL-3.0-or-later

define([
    'jquery',
    '/common/hyperscript.js',
    '/customize/messages.js',
    '/customize/pages.js',
    '/common/common-icons.js',
], function ($, h, Msg, Pages, Icons) {
    return function () {
        document.title = 'About — LadeVault';

        // ── Social / external links ──────────────────────────────────────────
        var makeExternalLink = function (href, label, svgNode) {
            return h('a.cp-about-link', {
                href: href,
                target: '_blank',
                rel: 'noopener noreferrer',
            }, [svgNode, h('span', label)]);
        };

        // Lucide Icon Wrapper (Stroked)
        var lucideIcon = function (pathData) {
            var svgString = '<svg class="cp-about-ext-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + pathData + '"></path></svg>';
            return Pages.setHTML(h('span.cp-about-ext-icon-wrapper'), svgString);
        };

        // Simple Icons Wrapper (Filled)
        var brandIcon = function (pathData) {
            var svgString = '<svg class="cp-about-ext-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + pathData + '"></path></svg>';
            return Pages.setHTML(h('span.cp-about-ext-icon-wrapper'), svgString);
        };

        var ICON_GLOBE = 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z';
        var ICON_MAIL  = 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6';
        
        var BRAND_GITHUB   = 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
        var BRAND_LINKEDIN = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';
        var BRAND_X        = 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z';

        var linksRow = h('div.cp-about-links', [
            makeExternalLink('https://ladestack.in',               'LadeStack',  lucideIcon(ICON_GLOBE)),
            makeExternalLink('https://github.com/girishlade111',    'GitHub',     brandIcon(BRAND_GITHUB)),
            makeExternalLink('https://linkedin.com/in/girishlade', 'LinkedIn',   brandIcon(BRAND_LINKEDIN)),
            makeExternalLink('https://x.com/GirishLade111',       'X / Twitter',brandIcon(BRAND_X)),
            h('a.cp-about-link', { href: '/contact.html' }, [
                lucideIcon(ICON_MAIL),
                h('span', 'Contact'),
            ]),
        ]);

        // ── Left Column (Profile & Identity) ─────────────────────────────────
        var heroImage = h('div.cp-about-hero-image-wrapper', [
            h('div.cp-about-blob-bg'),
            h('div.cp-about-avatar-container', [
                h('img.cp-about-avatar', {
                    src: '/customize/images/profile.png',
                    alt: 'Girish Lade — profile photo',
                })
            ])
        ]);

        var heroText = h('div.cp-about-hero-text', [
            h('h1.cp-about-name', 'Girish Lade'),
            h('h3.cp-about-tagline', 'Founder, LadeStack — building free, privacy-first developer tools'),
        ]);

        var leftCol = h('div.cp-about-left-col', [
            heroImage,
            heroText,
            linksRow
        ]);

        // ── Right Column (Narrative Card) ────────────────────────────────────
        var para = function (text) {
            return h('p.cp-about-para', text);
        };

        var narrativeCard = h('div.cp-about-narrative-card', [
            para('LadeVault exists as part of LadeStack — a founder-led suite of free, no-login, AI-powered developer tools. The goal is simple: give developers the software they need without paywalls, accounts, or surveillance. Every tool in the ecosystem is built to be genuinely useful from the first second you open it.'),
            para('I\'m Girish Lade — a mechanical engineer who crossed into software engineering and never looked back. LadeStack is my way of building in public: each tool is a real product I\'d want to use myself, progressively refined and shipped as part of one coherent ecosystem rooted at ladestack.in.'),
            para('LadeVault is built on CryptPad\'s open-source foundation and hardened with privacy-first principles. It\'s 100% free with no account required to start. Everything runs in your browser — nothing is tracked, nothing is sold. Your documents stay yours. Six formats live in one place: rich text, kanban boards, code pads, forms, diagrams, and slides — so you can do serious collaborative work without juggling five different apps.'),
            para('This is a solo-built project, continuously improved. If it saves you time or earns a place in your workflow, that\'s the win. Follow the journey at ladestack.in or drop me a message on the Contact page.'),
        ]);

        var rightCol = h('div.cp-about-right-col', [
            narrativeCard
        ]);

        // ── Full page layout ─────────────────────────────────────────────────
        var gridLayout = h('div.cp-about-grid', [
            leftCol,
            rightCol
        ]);

        var root = h('div#cp-main', [
            Pages.infopageTopbar(),
            h('main.cp-about-main', [
                h('div.cp-about-container', [
                    gridLayout
                ]),
            ]),
            Pages.infopageFooter(),
        ]);

        // ── Scroll-fade for narrative paragraphs ─────────────────────────────
        setTimeout(function () {
            var paras = document.querySelectorAll('.cp-about-para');
            if (!paras.length) { return; }

            var prefersReduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                paras.forEach(function (p) { p.classList.add('cp-about-visible'); });
                return;
            }

            if (!window.IntersectionObserver) {
                paras.forEach(function (p) { p.classList.add('cp-about-visible'); });
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('cp-about-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });

            paras.forEach(function (p, index) {
                // Add a staggered delay based on index for a cascading effect
                p.style.transitionDelay = (index * 80) + 'ms';
                observer.observe(p);
            });
        }, 0);

        return root;
    };
});

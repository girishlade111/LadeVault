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
        var makeExternalLink = function (href, label, iconSvgPath) {
            var icon = h('svg.cp-about-ext-icon', {
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'aria-hidden': 'true',
            }, [h('path', { d: iconSvgPath })]);

            return h('a.cp-about-link', {
                href: href,
                target: '_blank',
                rel: 'noopener noreferrer',
            }, [icon, h('span', label)]);
        };

        // Lucide-style path data for each icon
        var ICON_GLOBE    = 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z';
        var ICON_GITHUB   = 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22';
        var ICON_LINKEDIN = 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
        var ICON_TWITTER  = 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z';
        var ICON_MAIL     = 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6';

        var linksRow = h('div.cp-about-links', [
            makeExternalLink('https://ladestack.in',               'LadeStack',  ICON_GLOBE),
            makeExternalLink('https://github.com/girishlade111',    'GitHub',     ICON_GITHUB),
            makeExternalLink('https://linkedin.com/in/girishlade', 'LinkedIn',   ICON_LINKEDIN),
            makeExternalLink('https://x.com/GirishLade111',       'X / Twitter',ICON_TWITTER),
            h('a.cp-about-link', { href: '/contact.html' }, [
                h('svg.cp-about-ext-icon', {
                    xmlns: 'http://www.w3.org/2000/svg',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'aria-hidden': 'true',
                }, [h('path', { d: ICON_MAIL })]),
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

// SPDX-FileCopyrightText: 2024 LadeStack / Girish Lade
//
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// LadeVault — Features page (redesigned)
// Sage-green brand, modern two-column tier cards, inline Lucide SVG icons,
// "Recommended" badge on registered card, scroll-reveal animation, footer contact strip.

define([
    'jquery',
    '/common/hyperscript.js',
    '/customize/messages.js',
    '/customize/application_config.js',
    '/common/outer/local-store.js',
    '/customize/pages.js',
    '/api/config',
    '/common/common-ui-elements.js',
    '/common/common-constants.js',
    '/common/pad-types.js',
    '/common/extensions.js',
], function ($, h, Msg, AppConfig, LocalStore, Pages, Config, UIElements, Constants, PadTypes, Extensions) {
    return function () {
        document.title = 'Features — LadeVault';

        // ── Inline SVG icon builder (Lucide-style, no external dep needed) ────
        // Each icon is rendered as a minimal inline SVG with stroke paths.
        var icon = function (paths, extraClass) {
            var children = (Array.isArray(paths) ? paths : [paths]).map(function (d) {
                return h('path', { d: d });
            });
            return h('svg.lv-feat-icon' + (extraClass || ''), {
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '1.75',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'aria-hidden': 'true',
            }, children);
        };

        // ── Lucide path data keyed by semantic feature name ────────────────────
        var ICONS = {
            // LayoutGrid — "access to all apps"
            apps: [
                'M3 3h7v7H3z',
                'M14 3h7v7h-7z',
                'M3 14h7v7H3z',
                'M14 14h7v7h-7z',
            ],
            // FolderOpen — "open documents"
            file0: [
                'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
                'M2 10h20',
            ],
            // Sliders — "common features (edit/export/history/chat)"
            core: [
                'M4 21v-7',
                'M4 10V3',
                'M12 21v-9',
                'M12 8V3',
                'M20 21v-5',
                'M20 12V3',
                'M1 14h6',
                'M9 8h6',
                'M17 16h6',
            ],
            // HardDrive — "limited CryptDrive"
            cryptdrive0: [
                'M22 12H2',
                'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
                'M6 16h.01',
                'M10 16h.01',
            ],
            // Clock — "limited storage time"
            storage0: [
                'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
                'M12 6v6l4 2',
            ],
            // CheckCircle2 — "all guest features"
            anon: [
                'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
                'M9 12l2 2 4-4',
            ],
            // Users — "social features"
            social: [
                'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
                'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
                'M23 21v-2a4 4 0 0 0-3-3.87',
                'M16 3.13a4 4 0 0 1 0 7.75',
            ],
            // UploadCloud — "upload and share files"
            file1: [
                'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
                'M12 12v9',
                'M8 17l4-4 4 4',
            ],
            // FolderTree — "complete CryptDrive"
            cryptdrive1: [
                'M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z',
                'M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z',
                'M3 5h8',
                'M3 19h2',
                'M3 12h5',
            ],
            // MonitorSmartphone — "documents on all devices"
            devices: [
                'M18 8h-1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11c0 1.1.9 2 2 2h7',
                'M6 19h.01',
                'M22 14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6z',
                'M19 20v.01',
            ],
            // ShieldCheck — "personal storage"
            storage1: [
                'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                'M9 12l2 2 4-4',
            ],
        };

        // ── Icon circle wrapper ────────────────────────────────────────────────
        var iconCircle = function (key, deepTone) {
            var paths = ICONS[key] || ICONS.anon;
            return h('div.lv-icon-circle' + (deepTone ? '.lv-icon-circle--deep' : ''), [
                icon(paths)
            ]);
        };

        // ── Single feature row ─────────────────────────────────────────────────
        var featureRow = function (key, title, note, deepTone) {
            return h('li.lv-feat-row', [
                iconCircle(key, deepTone),
                h('div.lv-feat-text', [
                    h('span.lv-feat-title', title),
                    note ? h('span.lv-feat-note', note) : null,
                ]),
            ]);
        };

        // ── Build feature rows from message keys (mirrors original logic) ──────
        Msg.features_f_apps_note = PadTypes.availableTypes.map(function (app) {
            if (AppConfig.registeredOnlyTypes.indexOf(app) !== -1) { return; }
            if (AppConfig.premiumTypes && AppConfig.premiumTypes.includes(app)) { return; }
            if (Constants.earlyAccessApps && Constants.earlyAccessApps.includes(app) &&
                  AppConfig.enableEarlyAccess) { return; }
            return Msg.type[app];
        }).filter(Boolean).join(', ');

        var rowFor = function (key, deepTone) {
            var title = Msg['features_f_' + key];
            var note  = Msg['features_f_' + key + '_note'];
            return featureRow(key, title, note, deepTone);
        };

        // Special rows that interpolate config values
        var row_storage0 = function (deep) {
            return featureRow('storage0',
                Msg['features_f_storage0'],
                Msg._getKey('features_f_storage0_note', [Config.inactiveTime]),
                deep
            );
        };
        var row_file1 = function (deep) {
            return featureRow('file1',
                Msg['features_f_file1'],
                Msg._getKey('features_f_file1_note', [Config.maxUploadSize / 1024 / 1024]),
                deep
            );
        };
        var row_storage1 = function (deep) {
            return featureRow('storage1',
                Msg._getKey('features_f_storage1', [UIElements.prettySize(Config.defaultStorageLimit)]),
                Msg['features_f_storage1_note'],
                deep
            );
        };

        // ── Card builder ──────────────────────────────────────────────────────
        var makeCard = function (opts) {
            // opts: { tier, price, subtext, rows, cta, recommended }
            var header = h('div.lv-card-header', [
                h('h2.lv-card-title', opts.tier),
                opts.recommended
                    ? h('span.lv-card-badge', 'Recommended')
                    : null,
            ]);

            var pricing = h('div.lv-card-pricing', [
                h('span.lv-card-price', opts.price),
                h('span.lv-card-price-sub', opts.subtext),
            ]);

            var featureList = h('ul.lv-feat-list', opts.rows);

            var cta = opts.cta
                ? h('div.lv-card-cta', [opts.cta])
                : null;

            return h('div.lv-tier-card' + (opts.recommended ? '.lv-tier-card--recommended' : ''), [
                header,
                pricing,
                featureList,
                cta,
            ]);
        };

        // ── Guest card ────────────────────────────────────────────────────────
        var guestCard = makeCard({
            tier: Msg.features_anon,   // "Guest"
            price: '0€',
            subtext: Msg.features_noData || 'No personal information required',
            rows: [
                rowFor('apps'),
                rowFor('file0'),
                rowFor('core'),
                rowFor('cryptdrive0'),
                row_storage0(false),
            ],
            recommended: false,
            cta: null,
        });

        // ── Registered card ───────────────────────────────────────────────────
        var registerBtn = h('a.lv-register-btn', {
            href: '/register/',
            id: 'lv-register-cta',
        }, Msg.features_f_register || 'Register for free');

        var registeredCard = makeCard({
            tier: Msg.features_registered || 'Registered',
            price: '0€',
            subtext: Msg.features_noData || 'No personal information required',
            rows: [
                rowFor('anon',       true),
                rowFor('social',     true),
                row_file1(true),
                rowFor('cryptdrive1',true),
                rowFor('devices',    true),
                row_storage1(true),
            ],
            recommended: true,
            cta: registerBtn,
        });

        // ── Tier grid ─────────────────────────────────────────────────────────
        var availableCards = [guestCard, registeredCard];

        Extensions.getExtensionsSync('EXTRA_PRICING').forEach(function (ext) {
            if (!ext.getContent) { return; }
            availableCards.push(h('div.lv-tier-card', [ext.getContent(function (title, note) {
                return featureRow('anon', title, note, false);
            })]));
        });

        // ── Footer contact strip ───────────────────────────────────────────────
        var contactStrip = h('p.lv-contact-strip', [
            'Questions about a feature? ',
            h('a.lv-contact-link', {
                href: 'mailto:admin@ladestack.in',
            }, 'admin@ladestack.in'),
            ' or open an issue on ',
            h('a.lv-contact-link', {
                href: 'https://github.com/girishlade111/LadeVault/issues',
                target: '_blank',
                rel: 'noopener noreferrer',
            }, 'GitHub'),
            '.',
        ]);

        // ── Full page ─────────────────────────────────────────────────────────
        var root = h('div#cp-main', [
            Pages.infopageTopbar(),
            h('main.lv-features-main', [
                // Hero
                h('div.lv-hero', [
                    h('h1.lv-hero-heading', 'Features'),
                    h('p.lv-hero-sub',
                        'Everything you need, free forever \u2014 choose how much you want to store.'),
                ]),
                // Tier cards
                h('div.lv-tier-grid', availableCards),
                // Contact strip
                h('div.lv-contact-wrap', [contactStrip]),
            ]),
            Pages.infopageFooter(),
        ]);

        // ── Scroll-reveal animation for tier cards ────────────────────────────
        setTimeout(function () {
            var cards = document.querySelectorAll('.lv-tier-card');
            if (!cards.length) { return; }

            var prefersReduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) {
                cards.forEach(function (c) { c.classList.add('lv-card-visible'); });
                return;
            }

            if (!window.IntersectionObserver) {
                cards.forEach(function (c) { c.classList.add('lv-card-visible'); });
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('lv-card-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08 });

            cards.forEach(function (c, i) {
                // Stagger the reveal slightly for visual rhythm
                c.style.transitionDelay = (i * 80) + 'ms';
                observer.observe(c);
            });
        }, 0);

        return root;
    };
});

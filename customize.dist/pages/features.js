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

        // ── Modern Heroicons SVG path dictionary (Default) ────────────────────
        var HEROICONS = {
            // SquaresPlus — "access to all apps"
            apps: [
                'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
            ],
            // DocumentText — "open documents"
            file0: [
                'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
            ],
            // Bolt — "common features"
            core: [
                'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
            ],
            // ServerStack — "limited CryptDrive"
            cryptdrive0: [
                'M2.25 15a4.5 4.5 0 004.5 4.5h10.5a4.5 4.5 0 004.5-4.5V12a4.5 4.5 0 00-4.5-4.5H6.75A4.5 4.5 0 002.25 12v3z',
                'M2.25 9a4.5 4.5 0 014.5-4.5h10.5A4.5 4.5 0 0121.75 9',
            ],
            // Clock — "limited storage time"
            storage0: [
                'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
            ],
            // CheckBadge — "all guest features"
            anon: [
                'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
            ],
            // UserGroup — "social features"
            social: [
                'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
            ],
            // ArrowUpOnSquare — "upload and share files"
            file1: [
                'M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z',
            ],
            // FolderPlus — "complete CryptDrive"
            cryptdrive1: [
                'M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
            ],
            // DevicePhoneMobile — "all devices access"
            devices: [
                'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
            ],
            // ShieldCheck — "personal encrypted storage"
            storage1: [
                'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z',
            ],
        };

        // ── Inline SVG icon renderer ───────────────────────────────────────────
        var renderIconSvg = function (key, extraClass) {
            var paths = HEROICONS[key] || HEROICONS.anon;

            var pathString = (Array.isArray(paths) ? paths : [paths]).map(function (d) {
                return '<path d="' + d + '"></path>';
            }).join('');

            var svgHtml = '<svg class="lv-feat-icon' + (extraClass ? ' ' + extraClass : '') + '" ' +
                'xmlns="http://www.w3.org/2000/svg" ' +
                'viewBox="0 0 24 24" ' +
                'fill="none" ' +
                'stroke="currentColor" ' +
                'stroke-width="1.75" ' +
                'stroke-linecap="round" ' +
                'stroke-linejoin="round" ' +
                'aria-hidden="true">' +
                pathString +
                '</svg>';

            return Pages.setHTML(h('span.lv-icon-svg-wrap'), svgHtml);
        };

        // ── Icon circle wrapper ────────────────────────────────────────────────
        var iconCircle = function (key, deepTone) {
            return h('div.lv-icon-circle' + (deepTone ? '.lv-icon-circle--deep' : ''), [
                renderIconSvg(key)
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

        // ── Build feature rows from message keys ──────────────────────────────
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
            tier: Msg.features_anon,
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
                c.style.transitionDelay = (i * 80) + 'ms';
                observer.observe(c);
            });
        }, 0);

        return root;
    };
});


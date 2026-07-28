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

        // ── Active icon library state ──────────────────────────────────────────
        var activeLib = 'lucide';

        // ── Icon Libraries Path Dictionary ─────────────────────────────────────
        var LIBRARIES = {
            lucide: {
                name: 'Lucide Icons',
                subtitle: 'Clean & Balanced',
                badge: 'Default',
                strokeWidth: '1.75',
                icons: {
                    apps: [
                        'M3 3h7v7H3z',
                        'M14 3h7v7h-7z',
                        'M3 14h7v7H3z',
                        'M14 14h7v7h-7z',
                    ],
                    file0: [
                        'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z',
                        'M14 2v6h6',
                        'M16 13H8',
                        'M16 17H8',
                        'M10 9H8',
                    ],
                    core: [
                        'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
                    ],
                    cryptdrive0: [
                        'M22 12H2',
                        'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
                        'M6 16h.01',
                        'M10 16h.01',
                    ],
                    storage0: [
                        'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
                        'M12 6v6l4 2',
                    ],
                    anon: [
                        'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z',
                        'M9 12l2 2 4-4',
                    ],
                    social: [
                        'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
                        'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
                        'M22 21v-2a4 4 0 0 0-3-3.87',
                        'M16 3.13a4 4 0 0 1 0 7.75',
                    ],
                    file1: [
                        'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242',
                        'M12 12v9',
                        'M16 16l-4-4-4 4',
                    ],
                    cryptdrive1: [
                        'M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z',
                        'M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z',
                        'M3 5h8',
                        'M3 19h2',
                        'M3 12h5',
                    ],
                    devices: [
                        'M18 8h-1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11c0 1.1.9 2 2 2h7',
                        'M6 19h.01',
                        'M22 14a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6z',
                        'M19 20v.01',
                    ],
                    storage1: [
                        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                        'M9 12l2 2 4-4',
                    ],
                }
            },
            heroicons: {
                name: 'Heroicons',
                subtitle: 'Tailwind Modern',
                badge: 'Popular',
                strokeWidth: '1.75',
                icons: {
                    apps: [
                        'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
                    ],
                    file0: [
                        'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
                    ],
                    core: [
                        'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
                    ],
                    cryptdrive0: [
                        'M2.25 15a4.5 4.5 0 004.5 4.5h10.5a4.5 4.5 0 004.5-4.5V12a4.5 4.5 0 00-4.5-4.5H6.75A4.5 4.5 0 002.25 12v3z',
                        'M2.25 9a4.5 4.5 0 014.5-4.5h10.5A4.5 4.5 0 0121.75 9',
                    ],
                    storage0: [
                        'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
                    ],
                    anon: [
                        'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
                    ],
                    social: [
                        'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
                    ],
                    file1: [
                        'M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z',
                    ],
                    cryptdrive1: [
                        'M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
                    ],
                    devices: [
                        'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3',
                    ],
                    storage1: [
                        'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z',
                    ],
                }
            },
            phosphor: {
                name: 'Phosphor Icons',
                subtitle: 'Duotone Accent',
                badge: 'Duotone',
                strokeWidth: '1.85',
                icons: {
                    apps: [
                        'M4 4h7v7H4z',
                        'M13 4h7v7h-7z',
                        'M4 13h7v7H4z',
                        'M13 13h7v7h-7z',
                    ],
                    file0: [
                        'M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z',
                        'M14 2v6h6',
                        'M8 13h8',
                        'M8 17h5',
                    ],
                    core: [
                        'M13 2L3 14h8l-1 8 11-12h-8l1-8z',
                    ],
                    cryptdrive0: [
                        'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
                        'M2 13h20',
                        'M6 16h.01',
                        'M9 16h.01',
                    ],
                    storage0: [
                        'M6 2h12v4l-4 4 4 4v4H6v-4l4-4-4-4V2z',
                        'M6 2h12',
                        'M6 22h12',
                    ],
                    anon: [
                        'M12 2l2.5 2.5L18 4l.5 3.5L22 9l-1.5 3L22 15l-3.5 1.5L18 20l-3.5-.5L12 22l-2.5-2.5L6 20l-.5-3.5L2 15l1.5-3L2 9l3.5-1.5L6 4l3.5.5L12 2z',
                        'M9 12l2 2 4-4',
                    ],
                    social: [
                        'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
                        'M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2',
                        'M16 3.13a4 4 0 0 1 0 7.75',
                        'M23 21v-2a4 4 0 0 0-3-3.87',
                    ],
                    file1: [
                        'M6 19a5 5 0 0 1-1-9.9A7 7 0 0 1 18.5 7.5A4.5 4.5 0 0 1 20 16.3',
                        'M12 12v8',
                        'M8.5 15.5L12 12l3.5 3.5',
                    ],
                    cryptdrive1: [
                        'M4 4h12v4H4z',
                        'M4 10h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z',
                    ],
                    devices: [
                        'M4 6h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
                        'M8 21h8',
                        'M12 17v4',
                    ],
                    storage1: [
                        'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                        'M9 12l2 2 4-4',
                    ],
                }
            },
            tabler: {
                name: 'Tabler Icons',
                subtitle: 'Technical Precision',
                badge: 'Precision',
                strokeWidth: '1.75',
                icons: {
                    apps: [
                        'M4 4h6v6H4z',
                        'M14 4h6v6h-6z',
                        'M4 14h6v6H4z',
                        'M14 14h6v6h-6z',
                    ],
                    file0: [
                        'M14 3v4a1 1 0 0 0 1 1h4',
                        'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z',
                        'M10 13l-2 2 2 2',
                        'M14 13l2 2-2 2',
                    ],
                    core: [
                        'M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0',
                        'M6 4v4',
                        'M6 12v8',
                        'M12 15a2 2 0 1 0 4 0a2 2 0 0 0 -4 0',
                        'M14 4v9',
                        'M14 17v3',
                        'M20 7a2 2 0 1 0 -4 0a2 2 0 0 0 4 0',
                        'M18 4v1',
                        'M18 9v11',
                    ],
                    cryptdrive0: [
                        'M4 6c0 1.657 3.582 3 8 3s8 -1.343 8 -3s -3.582 -3 -8 -3s -8 1.343 -8 3',
                        'M4 6v6c0 1.657 3.582 3 8 3s8 -1.343 8 -3v-6',
                        'M4 12v6c0 1.657 3.582 3 8 3s8 -1.343 8 -3v-6',
                    ],
                    storage0: [
                        'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0',
                        'M12 7v5l3 3',
                        'M12 12l-2 2',
                    ],
                    anon: [
                        'M12 3l1.912 1.912a1 1 0 0 0 .707 .293h2.704a1 1 0 0 1 1 1v2.704a1 1 0 0 0 .293 .707l1.912 1.912a1 1 0 0 1 0 1.414l-1.912 1.912a1 1 0 0 0 -.293 .707v2.704a1 1 0 0 1 -1 1h-2.704a1 1 0 0 0 -.707 .293l-1.912 1.912a1 1 0 0 1 -1.414 0l-1.912 -1.912a1 1 0 0 0 -.707 -.293h-2.704a1 1 0 0 1 -1 -1v-2.704a1 1 0 0 0 -.293 -.707l-1.912 -1.912a1 1 0 0 1 0 -1.414l1.912 -1.912a1 1 0 0 0 .293 -.707v-2.704a1 1 0 0 1 1 -1h2.704a1 1 0 0 0 .707 -.293l1.912 -1.912a1 1 0 0 1 1.414 0z',
                        'M9 12l2 2 4 -4',
                    ],
                    social: [
                        'M10 13a5 5 0 1 0 0 -10a5 5 0 0 0 0 10z',
                        'M4 21v-1a5 5 0 0 1 5 -5h2a5 5 0 0 1 5 5v1',
                        'M15 5a5 5 0 0 1 4.5 7.5',
                        'M19 21v-1a5 5 0 0 0 -2 -4',
                    ],
                    file1: [
                        'M7 18a4.6 4.6 0 0 1 0 -9a5 5 0 0 1 8.2 -1a4.5 4.5 0 0 1 2.8 8.7',
                        'M9 15l3 -3l3 3',
                        'M12 12v9',
                    ],
                    cryptdrive1: [
                        'M4 4h5v4H4z',
                        'M15 4h5v4h-5z',
                        'M4 16h5v4H4z',
                        'M6 8v8',
                        'M9 6h6',
                    ],
                    devices: [
                        'M13 9a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-10z',
                        'M18 8v-3a1 1 0 0 0 -1 -1h-13a1 1 0 0 0 -1 1v12a1 1 0 0 0 1 1h9',
                    ],
                    storage1: [
                        'M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3',
                        'M12 11m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
                        'M12 12v2.5',
                    ],
                }
            }
        };

        // ── Inline SVG icon renderer ───────────────────────────────────────────
        var renderIconSvg = function (key, libKey, extraClass) {
            var lib = LIBRARIES[libKey] || LIBRARIES.lucide;
            var paths = lib.icons[key] || LIBRARIES.lucide.icons[key] || LIBRARIES.lucide.icons.anon;

            var children = (Array.isArray(paths) ? paths : [paths]).map(function (d) {
                return h('path', { d: d });
            });

            return h('svg.lv-feat-icon' + (extraClass ? '.' + extraClass : ''), {
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': lib.strokeWidth || '1.75',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'aria-hidden': 'true',
                'data-icon-key': key,
            }, children);
        };

        // ── Icon circle wrapper ────────────────────────────────────────────────
        var iconCircle = function (key, deepTone) {
            return h('div.lv-icon-circle' + (deepTone ? '.lv-icon-circle--deep' : ''), {
                'data-feature-key': key
            }, [
                renderIconSvg(key, activeLib)
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

        // ── UI Library selector bar ───────────────────────────────────────────
        var libTabNodes = {};

        var makeLibTab = function (key) {
            var lib = LIBRARIES[key];
            var btn = h('button.lv-lib-pill' + (key === activeLib ? '.lv-lib-pill--active' : ''), {
                type: 'button',
                'data-lib-key': key,
                title: 'Switch to ' + lib.name + ' style'
            }, [
                h('span.lv-lib-pill-name', lib.name),
                h('span.lv-lib-pill-tag', lib.badge)
            ]);

            libTabNodes[key] = btn;

            $(btn).on('click', function () {
                if (activeLib === key) return;
                activeLib = key;

                // Update active tab styles
                Object.keys(libTabNodes).forEach(function (k) {
                    if (k === key) {
                        $(libTabNodes[k]).addClass('lv-lib-pill--active');
                    } else {
                        $(libTabNodes[k]).removeClass('lv-lib-pill--active');
                    }
                });

                // Update root dataset attribute for CSS scoping if needed
                var mainElem = document.querySelector('.lv-features-main');
                if (mainElem) {
                    mainElem.setAttribute('data-active-lib', key);
                }

                // Re-render all feature icons in place with smooth transition
                $('.lv-icon-circle').each(function () {
                    var $circle = $(this);
                    var fKey = $circle.attr('data-feature-key');
                    if (fKey) {
                        $circle.addClass('lv-icon-swapping');
                        setTimeout(function () {
                            var newSvg = renderIconSvg(fKey, activeLib);
                            $circle.empty().append(newSvg);
                            $circle.removeClass('lv-icon-swapping');
                        }, 90);
                    }
                });
            });

            return btn;
        };

        var librarySelectorBar = h('div.lv-lib-bar', [
            h('div.lv-lib-bar-header', [
                h('span.lv-lib-title', 'Icon Design Style'),
                h('span.lv-lib-sub', 'Crafted using premier open-source UI icon systems')
            ]),
            h('div.lv-lib-pills', [
                makeLibTab('lucide'),
                makeLibTab('heroicons'),
                makeLibTab('phosphor'),
                makeLibTab('tabler')
            ])
        ]);

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
            h('main.lv-features-main', { 'data-active-lib': activeLib }, [
                // Hero
                h('div.lv-hero', [
                    h('h1.lv-hero-heading', 'Features'),
                    h('p.lv-hero-sub',
                        'Everything you need, free forever \u2014 choose how much you want to store.'),
                    librarySelectorBar,
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


// SPDX-FileCopyrightText: 2023 XWiki CryptPad Team <contact@cryptpad.org> and contributors
//
// SPDX-License-Identifier: AGPL-3.0-or-later

define([
    '/api/config',
    'jquery',
    '/common/hyperscript.js',
    '/common/common-interface.js',
    '/customize/messages.js',
    '/customize/pages.js',
    '/common/common-icons.js',
], function (Config, $, h, UI, Msg, Pages, Icons) {
    return function () {
        document.title = Msg.register_header;
        var tos = $(UI.createCheckbox('accept-terms')).find('.cp-checkmark-label').append(Msg.register_acceptTerms).parent()[0];

        var ssoEnabled = (Config.sso && Config.sso.list && Config.sso.list.length) ?'': '.cp-hidden';
        var ssoEnforced = (Config.sso && Config.sso.force) ? '.cp-hidden' : '';

        var termsLink = Pages.customURLs.terms;
        $(tos).find('a').attr({
            href: termsLink,
            target: '_blank',
            tabindex: '-1',
        });

        var frame = function (content) {
            return [
                h('div#cp-main', [
                    Pages.infopageTopbar(),
                    h('div.container.cp-container', [
                        h('div.row.cp-page-title', h('h1', Msg.register_header)),
                    ].concat(content)),
                    Pages.infopageFooter(),
                ]),
            ];
        };

        var termsCheck;
        if (termsLink) {
            termsCheck = h('div.checkbox-container', tos);
        }

        var closed = Config.restrictRegistration;
        if (closed) {
            $('body').addClass('cp-register-closed');
        }

        // ── LadeVault: password-toggle helper (purely visual, type-only flip) ──
        var pwToggle = function (targetId) {
            return h('button.lv-pw-toggle', {
                type: 'button',
                'aria-label': 'Toggle password visibility',
                'data-target': targetId,
                onclick: function () {
                    // purely visual — only flips input type attribute
                    var inp = document.getElementById(targetId);
                    if (!inp) { return; }
                    inp.type = (inp.type === 'password') ? 'text' : 'password';
                    this.classList.toggle('lv-revealed');
                },
            }, [
                h('i.lv-eye-show', { 'data-lucide': 'eye', 'aria-hidden': 'true' }),
                h('i.lv-eye-hide', { 'data-lucide': 'eye-off', 'aria-hidden': 'true' }),
            ]);
        };

        return frame([
            h('div.cp-restricted-registration', [
                h('p', Msg.register_registrationIsClosed),
            ]),
            h('div.row.cp-register-det', [
                // ── Left column: important notes ──
                h('div#data.hidden.col-md-6.lv-notes-col', [
                    h('h2', Msg.register_notes_title),
                    h('div.cp-register-notes', [
                        h('ul.cp-notes-list', [
                            h('li.lv-note-item', [
                                h('span.lv-note-icon', [Icons.get('alert')]),
                                h('span.lv-note-text', [
                                    Msg.password_note1,
                                    h('span.red', Msg.password_note2)
                                ]),
                            ]),
                            h('li.lv-note-item', [
                                h('span.lv-note-icon', [Icons.get('alert')]),
                                h('span.lv-note-text', [
                                    Pages.setHTML(h('span'), Msg._getKey('computer_note', ['<span class="red">','</span>']))
                                ]),
                            ]),
                            h('li.lv-note-item', [
                                h('span.lv-note-icon', [Icons.get('alert')]),
                                h('span.lv-note-text', [Msg.import_note]),
                            ]),
                        ])
                    ])
                ]),
                h('div.col-md-3.cp-closed-filler'+ssoEnabled, h('div')),
                // ── Right column: registration form card ──
                h('div.cp-reg-form.col-md-6', [
                    h('div#userForm.form-group'+ssoEnforced, [
                        h('div.cp-register-instance', [
                            Msg._getKey('register_instance', [Pages.Instance.name]),
                            h('br'),
                            h('a', {
                                href: '/features.html'
                            }, Msg.register_whyRegister)
                        ]),
                        h('div.big-container', [
                            // Username field with icon
                            h('div.input-container.lv-input-wrap', [
                                h('label.cp-register-label', { for: 'username' }, Msg.login_username),
                                h('span.lv-field-icon', [Icons.get('user-account')]),
                                h('input.form-control#username', {
                                    type: 'text',
                                    autocomplete: 'off',
                                    autocorrect: 'off',
                                    autocapitalize: 'off',
                                    spellcheck: false,
                                    placeholder: Msg.login_username,
                                    autofocus: true,
                                }),
                            ]),
                            // Password field with icon + toggle
                            h('div.input-container.lv-input-wrap', [
                                h('label.cp-register-label', { for: 'password' }, Msg.login_password),
                                h('span.lv-field-icon', [Icons.get('lock')]),
                                h('input.form-control#password', {
                                    type: 'password',
                                    placeholder: Msg.login_password,
                                    autocomplete: 'new-password'
                                }),
                                pwToggle('password'),
                            ]),
                            // Confirm password with icon + toggle
                            h('div.input-container.lv-input-wrap', [
                                h('label.cp-register-label', { for: 'password-confirm' }, Msg.login_confirm),
                                h('span.lv-field-icon', [Icons.get('lock')]),
                                h('input.form-control#password-confirm', {
                                    type: 'password',
                                    placeholder: Msg.login_confirm,
                                    autocomplete: 'new-password'
                                }),
                                pwToggle('password-confirm'),
                            ]),
                        ]),
                        h('div.checkbox-container', [
                            UI.createCheckbox('import-recent', Msg.register_importRecent, true)
                        ]),
                        termsCheck,
                        h('button#register', Msg.login_register),
                    ]),
                    h('div#ssoForm.form-group.col-md-6'+ssoEnabled, [
                        h('div.cp-register-sso', Msg.sso_register_description)
                    ]),
                ]),
                h('div.col-md-3.cp-closed-filler'+ssoEnabled),
            ])
        ]);
    };
});

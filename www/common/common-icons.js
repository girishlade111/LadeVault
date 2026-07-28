// SPDX-FileCopyrightText: 2023 XWiki CryptPad Team <contact@cryptpad.org> and contributors
//
// SPDX-License-Identifier: AGPL-3.0-or-later

define([
    '/common/hyperscript.js',
    '/customize/lucide.js'
], function (h, Lucide) {
    const Icons = {};

    const map = {
        // Drive
        "homepage": "house",
        "drive": "hard-drive",
        "search": "search",
        "drive-shared-folder": "folder-users",
        "drive-upload-file": "file-up",
        "drive-upload-folder": "folder-up",
        "file": "file",
        "drive-recent": "clock",
        "drive-password-document": "file-lock",
        "folder": "folder",
        "folder-open": "folder-open",
        "folder-nocolor": "folder-minus",
        "folder-check": "folder-check",
        "file-template": "file-cog",
        "file-pad": "file-text",
        "grid": "layout-grid",
        "list": "list",
        "document-owner": "id-card-lanyard",
        "burn-drive": "eraser",
        // Teams
        "teams": "users-round",
        "promote": "chevrons-up",
        "downgrade": "chevrons-down",
        // CryptPad apps
        // Pad
        "pad": "file-text",
        "pad-settings": "settings",
        "expand-pad": "maximize-2",
        "shrink-pad": "minimize-2",
        "slide": "cp-file-slide",
        "poll": "file-chart-column-increasing",
        // Form
        "form": "file-chart-column-increasing",
        "form-responses": "chart-no-axes-combined",
        "form-text": "minus",
        "form-paragraph": "text",
        "form-grid-radio": "cp-form-grid-radio",
        "form-grid-check": "cp-form-grid-check",
        "form-list-check": "list-checks",
        "form-list-radio": "list",
        "form-list-ordered": "list-ordered",
        "form-poll": "cp-form-poll",
        "form-page-break": "cp-form-page-break",
        "form-conditional": "cp-form-conditional",
        "form-poll-maybe": "cp-form-poll-maybe",
        "form-poll-switch": "arrow-right-left",
        // Whiteboard
        "whiteboard": "cp-file-whiteboard",
        // Diagram
        "diagram": "cp-file-diagram",
        // Code
        "code-pad": "file-code",
        "todo": "file",
        // Kanban
        "kanban": "cp-file-kanban",
        "kanban-tags": "tags",
        "kanban-minimize": "minus",
        "kanban-maximize": "menu",
        "touch-mode": "hand",
        "kanban-add-top": "cp-kanban-add-top",
        "kanban-add-bottom": "cp-kanban-add-bottom",
        "delete-token": "x",
        // Doc
        "doc": "cp-file-oo-document",
        // Sheet
        "sheet": "cp-file-oo-sheet",
        // Presentation
        "presentation": "cp-file-oo-presentation",
        // Actions
        "add": "plus",
        "check": "check",
        "filter": "list-filter-plus",
        "share": "share-2",
        "download": "hard-drive-download",
        "destroy": "shredder",
        "donate": "hand-heart",
        "send": "send",
        "cloud-upload": "cloud-upload",
        "print": "printer",
        "play": "circle-play",
        "grip-move": "grip-horizontal",
        "grip-move-vertical": "grip-vertical",
        "refresh": "refresh-ccw",
        "select": "move",
        // General
        "trash-empty": "trash",
        "trash-full": "trash-2",
        "properties": "info",
        "documentation": "book-open-text",
        "language": "languages",
        "link": "link",
        "external-link": "external-link",
        "chevron-left": "chevron-left",
        "chevron-right": "chevron-right",
        "chevron-down": "chevron-down",
        "chevron-up": "chevron-up",
        "copy": "copy",
        "close": "x",
        "square": "square",
        "timer": "hourglass",
        "map-pin": "map-pin",
        "pin": "pin",
        "checked-box": "square-check",
        "unchecked-box": "square",
        "table": "table",
        "inbox": "inbox",
        "server": "server",
        "minus": "minus",
        "alert": "triangle-alert",
        "sort-amount-desc": "arrow-down-wide-narrow",
        "announcement": "megaphone",
        "reply": "reply",
        "comment": "message-square-text",
        "file-image": "file-image",
        "snapshot": "camera",
        "certificate": "shield-check",
        "circle-question": "circle-question-mark",
        "list-ol": "list-ordered",
        "list-todo": "list-todo",
        "ellipsis-vertical": "ellipsis-vertical",
        "ellipsis-horizontal": 'ellipsis',
        "toolbar-insert": "image-plus",
        "features": "info",
        "report": "clipboard-plus",
        "limit": "settings-2",
        "duration": "timer-reset",
        "checkup": "square-activity",
        // Login + Register
        "login": "log-in",
        "logout": "log-out",
        "logout-everywhere": "unplug",
        "register": "user-round-plus",
        // User
        "user-profile": "circle-user-round",
        "users": "users-round",
        "secret-user": "venetian-mask",
        "user-account": "user",
        // History
        "history": "history",
        "history-prev": 'arrow-left',
        "history-next": "arrow-right",
        "history-fast-next": "arrow-right-to-line",
        "history-fast-prev": "arrow-left-to-line",
        "history-timeline-position": "chevron-down",
        "history-restore": "archive-restore",
        "remove-history": "eraser",
        "history-moderation": "archive",
        "archive": "archive",
        // Calendar
        "calendar": "calendar-days",
        "calendar-inactive": "calendar",
        "calendar-add": "calendar-plus-2",
        "calendar-repeat": "calendar-sync",
        "calendar-reminder": "bell-ring",
        "calendar-add-reminder": "bell-plus",
        "calendar-location": "map-pin",
        "calendar-description": "align-justify",
        "closing-date": "calendar-x",
        // Contacts
        "contacts": "contact-round",
        "contacts-book": "book-user",
        "unfriend": "user-round-x",
        "add-friend": "user-round-plus",
        "sort-asc": "chevron-down",
        "sort-desc": "chevron-up",
        "access": "lock-open",
        "rename": "pen-line",
        "color-palette": "palette",
        "customize": "brush",
        "upload": "hard-drive-upload",
        "read-only": "pen-off",
        "preview": "eye",
        "tag": "hash",
        "password-reveal": "eye",
        "password-hide": "eye-closed",
        "password-change": "rotate-ccw-key",
        "arrow-left": "arrow-left",
        "arrow-up": "arrow-up",
        "code": "code-xml",
        "qr-code": "qr-code",
        "lock": "lock",
        "shield-alert": "shield-alert",
        "unlocked": "lock-open",
        "help": "info",
        "expand-menu": "chevron-right",
        "location": "navigation",
        "collapse": "square-minus",
        "expand": "square-plus",
        "expire": "clock-alert",
        "restricted": "ban",
        "renamed": "flag",
        "restore": "rotate-cw",
        "all": "menu",
        "chat": "message-circle-more",
        "comments": "message-square-more",
        "mail": "mail",
        "upload-avatar": "image-up",
        "edit": "pencil",
        "save": "save",
        "loading": "loader",
        "notification" : "bell",
        "notifications" : "notebook-text",
        "mute": "bell-off",
        "cursor": "text-cursor",
        "import": "upload",
        "import-template": "file-up",
        "export": "download",
        // Settings + Admin
        "settings": "settings",
        "apps-settings": "wrench",
        "administration": "monitor-cog",
        "support": "life-buoy",
        "moderation": "ambulance",
        "broadcast": "radio",
        "support-ticket": "mail",
        "user-directory": "id-card",
        "database": "database",
        "stats": "chart-line",
        "performance": "heart-pulse",
        "network": "network",
        "survey": "graduation-cap",
        // Markdown toolbar
        "undo": "undo",
        "redo": "redo",
        "type": "type",
        "clear-canvas": "brush-cleaning",
        "key": "key",
        "bold": "bold",
        "italic": "italic",
        "heading": "heading",
        "strikethrough": "strikethrough",
        "quote": "quote",
        "toc": "newspaper",
        "embed": "image-plus",
        // Badges
        "badge-admin": "star",
        "badge-moderator": "life-buoy",
        "badge-premium": "ticket-check",
        "badge-error": "circle-alert",
        // Other
        "maintenance": "construction",
        "release-notes": "notepad-text",
        "crowdfunding-donate": "hand-heart",
        "crowdfunding-snooze": "timer",
        "crowdfunding-donate2": "ticket"
    };

    const fluentSvgs = {
        pad: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="grad_pad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#71826E"/><stop offset="100%" stop-color="#556651"/></linearGradient><linearGradient id="highlight_pad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="40%" stop-color="#ffffff" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient><filter id="shadow_pad" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/></filter></defs><path d="M154,72 L356,72 Q380,72 380,96 L380,368 Q380,392 356,392 L154,392 Q130,392 130,368 L130,96 Q130,72 154,72 Z" fill="#4f5b4d" filter="url(#shadow_pad)"/><path d="M176,100 L378,100 Q402,100 402,124 L402,396 Q402,420 378,420 L176,420 Q152,420 152,396 L152,124 Q152,100 176,100 Z" fill="url(#grad_pad)" filter="url(#shadow_pad)"/><path d="M342,100 L402,160 L402,100 Z" fill="#485745"/><rect x="185" y="180" width="180" height="12" rx="6" fill="#ffffff" fill-opacity="0.25"/><rect x="185" y="210" width="180" height="12" rx="6" fill="#ffffff" fill-opacity="0.25"/><rect x="185" y="240" width="180" height="12" rx="6" fill="#ffffff" fill-opacity="0.25"/><rect x="185" y="270" width="180" height="12" rx="6" fill="#ffffff" fill-opacity="0.25"/><rect x="185" y="300" width="120" height="12" rx="6" fill="#ffffff" fill-opacity="0.25"/><path d="M176,100 L378,100 Q402,100 402,124 L402,396 Q402,420 378,420 L176,420 Q152,420 152,396 L152,124 Q152,100 176,100 Z" fill="url(#highlight_pad)"/></svg>`,
        kanban: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="grad_kanban" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#5F7A52"/><stop offset="100%" stop-color="#4A6140"/></linearGradient><linearGradient id="highlight_kanban" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="40%" stop-color="#ffffff" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient><filter id="shadow_kanban" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/></filter></defs><path d="M130,120 L190,120 Q210,120 210,140 L210,380 Q210,400 190,400 L130,400 Q110,400 110,380 L110,140 Q110,120 130,120 Z" fill="#425639" filter="url(#shadow_kanban)"/><path d="M240,90 L300,90 Q320,90 320,110 L320,380 Q320,400 300,400 L240,400 Q220,400 220,380 L220,110 Q220,90 240,90 Z" fill="url(#grad_kanban)" filter="url(#shadow_kanban)"/><path d="M350,140 L410,140 Q430,140 430,160 L430,380 Q430,400 410,400 L350,400 Q330,400 330,380 L330,160 Q330,140 350,140 Z" fill="#394b32" filter="url(#shadow_kanban)"/><rect x="238" y="130" width="64" height="10" rx="5" fill="#ffffff" fill-opacity="0.3"/><rect x="238" y="155" width="64" height="10" rx="5" fill="#ffffff" fill-opacity="0.2"/><rect x="238" y="180" width="64" height="10" rx="5" fill="#ffffff" fill-opacity="0.15"/><path d="M240,90 L300,90 Q320,90 320,110 L320,380 Q320,400 300,400 L240,400 Q220,400 220,380 L220,110 Q220,90 240,90 Z" fill="url(#highlight_kanban)"/></svg>`,
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="grad_code" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#7A8257"/><stop offset="100%" stop-color="#616B42"/></linearGradient><linearGradient id="highlight_code" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="40%" stop-color="#ffffff" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient><filter id="shadow_code" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/></filter></defs><path d="M139.64,65 L338.36,65 Q363,65 363,89.64 L363,392.36 Q363,417 338.36,417 L139.64,417 Q115,417 115,392.36 L115,89.64 Q115,65 139.64,65 Z" fill="#4f5539" filter="url(#shadow_code)"/><path d="M156.64,80 L355.36,80 Q380,80 380,104.64 L380,407.36 Q380,432 355.36,432 L156.64,432 Q132,432 132,407.36 L132,104.64 Q132,80 156.64,80 Z" fill="url(#grad_code)" filter="url(#shadow_code)"/><path d="M220,256 L180,290 L220,324" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/><path d="M292,256 L332,290 L292,324" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/><path d="M270,240 L242,340" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="14" stroke-linecap="round"/><path d="M156.64,80 L355.36,80 Q380,80 380,104.64 L380,407.36 Q380,432 355.36,432 L156.64,432 Q132,432 132,407.36 L132,104.64 Q132,80 156.64,80 Z" fill="url(#highlight_code)"/></svg>`,
        form: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="grad_form" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#5E8277"/><stop offset="100%" stop-color="#476459"/></linearGradient><linearGradient id="highlight_form" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="40%" stop-color="#ffffff" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient><filter id="shadow_form" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/></filter></defs><path d="M152,64 L344,64 Q372,64 372,92 L372,396 Q372,424 344,424 L152,424 Q124,424 124,396 L124,92 Q124,64 152,64 Z" fill="#3d554e" filter="url(#shadow_form)"/><path d="M168,80 L360,80 Q388,80 388,108 L388,412 Q388,440 360,440 L168,440 Q140,440 140,412 L140,108 Q140,80 168,80 Z" fill="url(#grad_form)" filter="url(#shadow_form)"/><rect x="172" y="170" width="28" height="28" rx="6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/><path d="M178,184 L184,190 L194,178" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="215" y="178" width="130" height="12" rx="6" fill="#ffffff" fill-opacity="0.35"/><rect x="172" y="220" width="28" height="28" rx="6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/><path d="M178,234 L184,240 L194,228" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="215" y="228" width="100" height="12" rx="6" fill="#ffffff" fill-opacity="0.35"/><rect x="172" y="270" width="28" height="28" rx="6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/><path d="M178,284 L184,290 L194,278" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><rect x="215" y="278" width="130" height="12" rx="6" fill="#ffffff" fill-opacity="0.35"/><rect x="172" y="320" width="28" height="28" rx="6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/><rect x="215" y="328" width="100" height="12" rx="6" fill="#ffffff" fill-opacity="0.2"/><rect x="172" y="370" width="28" height="28" rx="6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="4"/><rect x="215" y="378" width="130" height="12" rx="6" fill="#ffffff" fill-opacity="0.2"/><path d="M168,80 L360,80 Q388,80 388,108 L388,412 Q388,440 360,440 L168,440 Q140,440 140,412 L140,108 Q140,80 168,80 Z" fill="url(#highlight_form)"/></svg>`,
        diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="grad_diagram" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8C8564"/><stop offset="100%" stop-color="#6E6849"/></linearGradient><linearGradient id="highlight_diagram" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="40%" stop-color="#ffffff" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient><filter id="shadow_diagram" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/></filter></defs><path d="M144,64 L364,64 Q392,64 392,92 L392,396 Q392,424 364,424 L144,424 Q116,424 116,396 L116,92 Q116,64 144,64 Z" fill="#5b563f" filter="url(#shadow_diagram)"/><path d="M160,80 L380,80 Q408,80 408,108 L408,412 Q408,440 380,440 L160,440 Q132,440 132,412 L132,108 Q132,80 160,80 Z" fill="url(#grad_diagram)" filter="url(#shadow_diagram)"/><line x1="210" y1="220" x2="310" y2="180" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round"/><line x1="210" y1="220" x2="260" y2="320" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round"/><line x1="310" y1="180" x2="260" y2="320" stroke="#ffffff" stroke-opacity="0.5" stroke-width="6" stroke-linecap="round"/><path d="M298,184 L306,180 L298,176" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="210" cy="220" r="22" fill="#ffffff" fill-opacity="0.8"/><circle cx="310" cy="180" r="22" fill="#ffffff" fill-opacity="0.6"/><circle cx="260" cy="320" r="22" fill="#ffffff" fill-opacity="0.7"/><path d="M160,80 L380,80 Q408,80 408,108 L408,412 Q408,440 380,440 L160,440 Q132,440 132,412 L132,108 Q132,80 160,80 Z" fill="url(#highlight_diagram)"/></svg>`,
        slide: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><linearGradient id="grad_slide" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#66756B"/><stop offset="100%" stop-color="#4F5B53"/></linearGradient><linearGradient id="highlight_slide" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="40%" stop-color="#ffffff" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></linearGradient><filter id="shadow_slide" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="6" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/></filter></defs><path d="M142,130 L388,130 Q410,130 410,152 L410,308 Q410,330 388,330 L142,330 Q120,330 120,308 L120,152 Q120,130 142,130 Z" fill="#3d4640" filter="url(#shadow_slide)"/><path d="M162,150 L408,150 Q430,150 430,172 L430,328 Q430,350 408,350 L162,350 Q140,350 140,328 L140,172 Q140,150 162,150 Z" fill="#525e56" filter="url(#shadow_slide)"/><path d="M182,170 L428,170 Q450,170 450,192 L450,348 Q450,370 428,370 L182,370 Q160,370 160,348 L160,192 Q160,170 182,170 Z" fill="url(#grad_slide)" filter="url(#shadow_slide)"/><rect x="185" y="210" width="140" height="14" rx="7" fill="#ffffff" fill-opacity="0.35"/><rect x="185" y="240" width="100" height="10" rx="5" fill="#ffffff" fill-opacity="0.2"/><circle cx="360" cy="280" r="30" fill="#ffffff" fill-opacity="0.15"/><path d="M182,170 L428,170 Q450,170 450,192 L450,348 Q450,370 428,370 L182,370 Q160,370 160,348 L160,192 Q160,170 182,170 Z" fill="url(#highlight_slide)"/></svg>`
    };

    const appMap = {
        'pad': 'pad', 'file-text': 'pad',
        'kanban': 'kanban', 'cp-file-kanban': 'kanban',
        'code-pad': 'code', 'file-code': 'code', 'code': 'code',
        'form': 'form', 'poll': 'form', 'file-chart-column-increasing': 'form',
        'diagram': 'diagram', 'cp-file-diagram': 'diagram',
        'slide': 'slide', 'presentation': 'slide', 'cp-file-slide': 'slide', 'cp-file-oo-presentation': 'slide'
    };

    const parser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;

    Icons.add = (newIcons) => {
        Object.keys(newIcons).forEach(k => {
            map[k] = newIcons[k];
        });
    };

    Icons.get = (name, attrs = {}) => {
        const appKey = appMap[name];
        if (appKey && fluentSvgs[appKey] && parser) {
            const doc = parser.parseFromString(fluentSvgs[appKey], 'image/svg+xml');
            const svg = doc.documentElement;
            svg.setAttribute('aria-hidden', 'true');
            const baseClass = 'cp-icon cp-fluent-icon cp-fluent-icon-' + appKey;
            if (attrs['class']) {
                svg.setAttribute('class', baseClass + ' ' + attrs['class']);
            } else {
                svg.setAttribute('class', baseClass);
            }
            Object.keys(attrs).forEach(k => {
                if (k !== 'class') {
                    svg.setAttribute(k, attrs[k]);
                }
            });
            return svg;
        }

        if (!map[name]) {
            console.error("Invalid icon", name);
        }
        attrs['data-lucide'] = map[name];
        attrs['aria-hidden'] = "true";

        return h('i', attrs);
    };

    if (!window.CP_Lucide_observer) {
        window.CP_Lucide_observer = true;
        Lucide.createIcons();
        const observer = new MutationObserver((mutations) => {
            let found = mutations.some((mutation) => {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    let added = mutation.addedNodes[i];
                    if (added.tagName === "svg") { continue; }
                    if (added?.hasAttribute?.('data-lucide')) {
                        return true;
                    }
                    if (added?.querySelector?.(':not(svg)[data-lucide]')) {
                        return true;
                    }
                }
            });
            if (found) { Lucide.createIcons(); }
        });
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            characterData: false,
            subtree: true
        });
    }

    return Icons;
});


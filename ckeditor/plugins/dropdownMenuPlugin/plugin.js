CKEDITOR.plugins.add('dropdownMenuPlugin', {
    icons: 'dropdownmenu',
    init: function (editor) {
        editor.ui.add('DropdownMenu', CKEDITOR.UI_PANELBUTTON, {
            label: 'Options',
            title: 'Options',
            toolbar: 'others, 210',
            panel: {
                css: 'ckeditor/plugins/dropdownMenuPlugin/test.css',
                attributes: { role: 'dropdown', 'aria-label': 'Options' }
            },
            onBlock: function (panel, block) {
                block.element.setHtml('<ul class="cke_menu_list"></ul>');
                const menuList = block.element.getFirst();

                // Create the menus
                const menus = [
                    {
                        label: 'Change Tone',
                        items: [
                            { label: 'Direct', command: 'directTone' },
                            { label: 'Casual', command: 'casualTone' }
                        ]
                    },
                    {
                        label: 'Change Style',
                        items: [
                            { label: 'Business', command: 'businessStyle' },
                            { label: 'Legal', command: 'legalStyle' }
                        ]
                    },
                    {
                        label: 'Translate',
                        items: [
                            { label: 'English', command: 'translateEnglish' },
                            { label: 'Spanish', command: 'translateSpanish' },
                            { label: 'French', command: 'translateFrench' }
                        ]
                    }
                ];

                // Create the dropdown structure with submenus
                menus.forEach(menu => {
                    const mainItem = CKEDITOR.dom.element.createFromHtml(`<li class="cke_menu_item">${menu.label}</li>`);
                    const submenu = CKEDITOR.dom.element.createFromHtml('<ul class="cke_submenu"></ul>');

                    menu.items.forEach(subItem => {
                        const subMenuItem = CKEDITOR.dom.element.createFromHtml(`<li class="cke_menu_item">${subItem.label}</li>`);
                        submenu.append(subMenuItem);

                        // Add click event to submenu items
                        subMenuItem.on('click', () => {
                            editor.execCommand(subItem.command);
                        });
                    });

                    mainItem.append(submenu);
                    menuList.append(mainItem);
                });
            }
        });

        // Register commands for each submenu item
        editor.addCommand('directTone', {
            exec: function () { alert('Changed tone to Direct'); }
        });
        editor.addCommand('casualTone', {
            exec: function () { alert('Changed tone to Casual'); }
        });
        editor.addCommand('businessStyle', {
            exec: function () { alert('Changed style to Business'); }
        });
        editor.addCommand('legalStyle', {
            exec: function () { alert('Changed style to Legal'); }
        });
        editor.addCommand('translateEnglish', {
            exec: function () { alert('Translate to English'); }
        });
        editor.addCommand('translateSpanish', {
            exec: function () { alert('Translate to Spanish'); }
        });
        editor.addCommand('translateFrench', {
            exec: function () { alert('Translate to French'); }
        });
    }
});

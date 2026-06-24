import { App, PluginSettingTab, Setting } from 'obsidian';
import type SettingsHighlighterPlugin from './main';

const GROUPED_STYLES_ID = 'sbc-grouped-settings-styles';
const GROUPED_STYLES_CSS = [
    '.sbc-grouped .setting-item-heading { background: transparent; border: none; padding: 0 0 6px 0; margin-top: 24px; }',
    '.sbc-grouped .setting-item-heading:first-child { margin-top: 8px; }',
    '.sbc-grouped .setting-item-heading .setting-item-name { font-size: var(--font-ui-medium); font-weight: 600; }',
    '.sbc-group { background: var(--background-secondary); border-radius: 8px; overflow: hidden; margin: 0 0 8px 0; }',
    '.sbc-group .setting-item { background: transparent !important; border: none !important; padding: 14px 18px; margin: 0; }',
    '.sbc-group .setting-item + .setting-item { border-top: 1px solid var(--background-modifier-border) !important; }',
].join('\n');

function injectGroupedSettingsStyles(): void {
    if (document.getElementById(GROUPED_STYLES_ID)) return;
    const style = document.createElement('style');
    style.id = GROUPED_STYLES_ID;
    style.textContent = GROUPED_STYLES_CSS;
    document.head.appendChild(style);
}

function applyGrouping(containerEl: HTMLElement): void {
    const children = Array.from(containerEl.children) as HTMLElement[];
    let currentGroup: HTMLElement | null = null;
    for (const child of children) {
        const isHeading = child.classList.contains('setting-item-heading');
        const isSettingItem = child.classList.contains('setting-item') && !isHeading;
        if (isSettingItem) {
            if (!currentGroup) {
                currentGroup = document.createElement('div');
                currentGroup.className = 'sbc-group';
                containerEl.insertBefore(currentGroup, child);
            }
            currentGroup.appendChild(child);
        } else {
            currentGroup = null;
        }
    }
}

function accentColorHex(): string {
    const el = document.createElement('div');
    el.style.color = 'var(--color-accent)';
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '#7c3aed';
    return '#' + (m as string[]).slice(0, 3).map((n: string) => (+n).toString(16).padStart(2, '0')).join('');
}

export interface SettingsHighlighterSettings {
    customColor: string;
    enableForAll: boolean;
    collapsibleSections: boolean;
    autoCollapseSections: boolean;
    showFlaskButton: boolean;
    showCommunityRibbonButton: boolean;
    showCoreRibbonButton: boolean;
}

export const DEFAULT_SETTINGS: SettingsHighlighterSettings = {
    customColor: '',
    enableForAll: false,
    collapsibleSections: true,
    autoCollapseSections: true,
    showFlaskButton: true,
    showCommunityRibbonButton: true,
    showCoreRibbonButton: true,
};

export class SettingsHighlighterSettingTab extends PluginSettingTab {
    plugin: SettingsHighlighterPlugin;

    constructor(app: App, plugin: SettingsHighlighterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.addClass('sbc-grouped');
        injectGroupedSettingsStyles();

        new Setting(containerEl).setName('Highlight').setHeading();

        new Setting(containerEl)
            .setName('Highlight color')
            .setDesc('Border color for highlighted items. Reset to use the accent color.')
            .addColorPicker(picker => {
                const seed = this.plugin.settings.customColor || accentColorHex();
                picker.setValue(seed);
                picker.onChange(async value => {
                    this.plugin.settings.customColor = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHighlights();
                });
            })
            .addExtraButton(btn => btn
                .setIcon('reset')
                .setTooltip('Use accent color')
                .onClick(async () => {
                    this.plugin.settings.customColor = '';
                    await this.plugin.saveSettings();
                    this.plugin.refreshHighlights();
                    this.display();
                })
            );

        new Setting(containerEl)
            .setName('Enable for all pages')
            .setDesc('Extends solid outline highlighting to all settings pages, not just individual plugin pages.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableForAll)
                .onChange(async value => {
                    this.plugin.settings.enableForAll = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHighlights();
                })
            );

        new Setting(containerEl).setName('Sidebar behaviour').setHeading();

        new Setting(containerEl)
            .setName('Enable collapsible sections')
            .setDesc('Add a chevron to Core and Community plugin section headings to manually collapse or expand them.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.collapsibleSections)
                .onChange(async value => {
                    this.plugin.settings.collapsibleSections = value;
                    if (!value) this.plugin.settings.autoCollapseSections = false;
                    await this.plugin.saveSettings();
                    this.plugin.refreshHighlights();
                    this.display();
                })
            );

        if (this.plugin.settings.collapsibleSections) {
            new Setting(containerEl)
                .setName('Auto-collapse sections')
                .setDesc('When viewing a core plugin\'s settings, collapse the Community plugins section, and vice versa.')
                .addToggle(toggle => toggle
                    .setValue(this.plugin.settings.autoCollapseSections)
                    .onChange(async value => {
                        this.plugin.settings.autoCollapseSections = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshHighlights();
                    })
                );
        }

        new Setting(containerEl).setName('Ribbon buttons').setHeading();

        new Setting(containerEl)
            .setName('Show core plugins button')
            .setDesc('Show a ribbon button that opens the Core plugins settings page.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showCoreRibbonButton)
                .onChange(async value => {
                    this.plugin.settings.showCoreRibbonButton = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateRibbonVisibility();
                })
            );

        new Setting(containerEl)
            .setName('Show community plugins button')
            .setDesc('Show a ribbon button that opens the Community plugins settings page.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showCommunityRibbonButton)
                .onChange(async value => {
                    this.plugin.settings.showCommunityRibbonButton = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateRibbonVisibility();
                })
            );

        new Setting(containerEl)
            .setName('Show plugin settings button')
            .setDesc('Show a flask ribbon button that opens this plugin\'s settings page.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showFlaskButton)
                .onChange(async value => {
                    this.plugin.settings.showFlaskButton = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateRibbonVisibility();
                })
            );

        applyGrouping(containerEl);
    }
}

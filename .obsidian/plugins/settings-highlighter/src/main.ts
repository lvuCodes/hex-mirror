import { Plugin } from 'obsidian';
import { SettingsHighlighterSettings, DEFAULT_SETTINGS, SettingsHighlighterSettingTab } from './settings';

export default class SettingsHighlighterPlugin extends Plugin {
    settings: SettingsHighlighterSettings;
    private modalObserver: MutationObserver | null = null;
    private tabObserver: MutationObserver | null = null;
    private communityRibbonEl: HTMLElement | null = null;
    private coreRibbonEl: HTMLElement | null = null;
    private flaskRibbonEl: HTMLElement | null = null;

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new SettingsHighlighterSettingTab(this.app, this));
        this.injectRibbonStyles();

        this.communityRibbonEl = this.addRibbonIcon('puzzle', 'Community plugins', () => {
            (this.app as any).setting.open();
            (this.app as any).setting.openTabById('community-plugins');
        });

        this.coreRibbonEl = this.addRibbonIcon('toy-brick', 'Core plugins', () => {
            (this.app as any).setting.open();
            (this.app as any).setting.openTabById('core-plugins');
        });

        this.flaskRibbonEl = this.addRibbonIcon('flask-conical', 'Settings Highlighter settings', () => {
            (this.app as any).setting.open();
            (this.app as any).setting.openTabById('settings-highlighter');
        });

        this.updateRibbonVisibility();

        if (!this.repositionRibbonIcons()) {
            this.app.workspace.onLayoutReady(() => this.repositionRibbonIcons());
        }

        this.setupModalObserver();

        const existingModal = document.querySelector<HTMLElement>('.modal-container .mod-settings');
        if (existingModal) this.attachToModal(existingModal);
    }

    private injectRibbonStyles() {
        const id = 'sh-ribbon-styles';
        if (document.getElementById(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = '.sh-ribbon-hidden.sh-ribbon-hidden { display: none !important; }';
        document.head.appendChild(style);
        this.register(() => style.remove());
    }

    private repositionRibbonIcons(): boolean {
        const sidebarEl = this.app.workspace?.containerEl?.querySelector?.('.side-dock-actions');
        if (!sidebarEl) return false;
        const anchor = sidebarEl.lastElementChild;
        if (!anchor) return false;
        if (this.coreRibbonEl) sidebarEl.insertBefore(this.coreRibbonEl, anchor);
        if (this.communityRibbonEl) sidebarEl.insertBefore(this.communityRibbonEl, anchor);
        if (this.flaskRibbonEl) sidebarEl.insertBefore(this.flaskRibbonEl, anchor);
        return true;
    }

    onunload() {
        this.modalObserver?.disconnect();
        this.tabObserver?.disconnect();
        this.clearAllHighlights();
        const modal = document.querySelector<HTMLElement>('.modal-container .mod-settings');
        if (modal) {
            this.setHeadingCollapsed(this.findSectionHeading(modal, 'Core plugins'), false);
            this.setHeadingCollapsed(this.findSectionHeading(modal, 'Community plugins'), false);
            modal.querySelectorAll<HTMLElement>('.sh-chevron').forEach(el => el.remove());
            modal.querySelectorAll<HTMLElement>('[data-sh-init]').forEach(el => {
                el.style.removeProperty('cursor');
                delete el.dataset['shInit'];
                delete el.dataset['shLabel'];
            });
        }
    }

    updateRibbonVisibility() {
        if (this.communityRibbonEl) {
            this.communityRibbonEl.classList.toggle('sh-ribbon-hidden', !this.settings.showCommunityRibbonButton);
        }
        if (this.coreRibbonEl) {
            this.coreRibbonEl.classList.toggle('sh-ribbon-hidden', !this.settings.showCoreRibbonButton);
        }
        if (this.flaskRibbonEl) {
            this.flaskRibbonEl.classList.toggle('sh-ribbon-hidden', !this.settings.showFlaskButton);
        }
    }

    refreshHighlights() {
        const modal = document.querySelector<HTMLElement>('.modal-container .mod-settings');
        if (!modal) return;
        this.setSectionGroupsActive(modal, this.settings.collapsibleSections);
        this.highlightActiveTab(modal);
    }

    private getEffectiveColor(): string {
        return this.settings.customColor || 'var(--color-accent)';
    }

    private setupModalObserver() {
        this.modalObserver = new MutationObserver(() => {
            const modal = document.querySelector<HTMLElement>('.modal-container .mod-settings');
            if (!modal || modal.dataset['shAttached']) return;
            this.attachToModal(modal);
        });

        this.modalObserver.observe(document.body, { childList: true, subtree: false });
    }

    private attachToModal(modal: HTMLElement) {
        modal.dataset['shAttached'] = 'true';
        this.attachTabObserver(modal);
        this.setSectionGroupsActive(modal, this.settings.collapsibleSections);
        this.highlightActiveTab(modal);
    }

    private attachTabObserver(modal: HTMLElement) {
        this.tabObserver?.disconnect();

        const navContainer = modal.querySelector('.vertical-tab-header') ??
            modal.querySelector('.vertical-tab-nav');
        if (!navContainer) return;

        this.tabObserver = new MutationObserver(() => {
            this.highlightActiveTab(modal);
        });

        this.tabObserver.observe(navContainer, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true,
        });
    }

    private setSectionGroupsActive(modal: HTMLElement, active: boolean) {
        for (const label of ['Core plugins', 'Community plugins']) {
            const heading = this.findSectionHeading(modal, label);
            if (!heading) continue;

            heading.dataset['shLabel'] = label;

            if (active) {
                heading.style.cursor = 'pointer';
                if (!heading.querySelector('.sh-chevron')) {
                    const chevron = document.createElement('span');
                    chevron.className = 'sh-chevron';
                    chevron.style.cssText = 'display:inline-block;margin-left:6px;transition:transform 0.15s ease;opacity:0.5;font-size:0.9em;transform:rotate(90deg);';
                    chevron.textContent = '›';
                    heading.appendChild(chevron);
                }
                if (!heading.dataset['shInit']) {
                    heading.dataset['shInit'] = 'true';
                    heading.addEventListener('click', () => {
                        if (!this.settings.collapsibleSections) return;
                        const collapsed = this.isHeadingCollapsed(heading);
                        this.setHeadingCollapsed(heading, !collapsed);
                    });
                }
            } else {
                heading.style.removeProperty('cursor');
                heading.querySelector<HTMLElement>('.sh-chevron')?.remove();
                this.setHeadingCollapsed(heading, false);
            }
        }
    }

    private highlightActiveTab(modal: HTMLElement) {
        const color = this.getEffectiveColor();
        const radius = 'var(--radius-s)';

        this.clearHighlightsIn(modal);

        const activeItem = modal.querySelector<HTMLElement>('.vertical-tab-nav-item.is-active');
        if (!activeItem) return;

        const tabId = (this.app as any).setting?.activeTab?.id as string | undefined;
        const isCommunityPlugin = !!(tabId && (this.app as any).plugins?.plugins?.[tabId]);
        const isCorePlugin = !!(tabId && (this.app as any).internalPlugins?.plugins?.[tabId]);
        const isPlugin = isCommunityPlugin || isCorePlugin;

        if (isPlugin || this.settings.enableForAll) {
            activeItem.style.outline = `2px solid ${color}`;
            activeItem.style.outlineOffset = '-1px';
            activeItem.style.borderRadius = radius;
        }

        if (isPlugin) {
            const parentNavItem = this.findOptionsNavItem(modal, isCommunityPlugin ? 'Community plugins' : 'Core plugins');
            if (parentNavItem) {
                parentNavItem.style.outline = `2px dashed ${color}`;
                parentNavItem.style.outlineOffset = '-1px';
                parentNavItem.style.borderRadius = radius;
            }
        }

        this.updateSectionCollapse(modal, tabId, activeItem);
    }

    private updateSectionCollapse(modal: HTMLElement, tabId: string | undefined, activeItem: HTMLElement) {
        if (!this.settings.collapsibleSections) return;

        const nameEl = activeItem.querySelector('.vertical-tab-nav-item-name');
        const activeText = (nameEl?.textContent ?? activeItem.textContent ?? '').trim();

        const isCommunityPlugin = !!(tabId && (this.app as any).plugins?.plugins?.[tabId]);
        const isCorePlugin = !!(tabId && (this.app as any).internalPlugins?.plugins?.[tabId]);
        const isOnCoreList = tabId === 'core-plugins' || activeText === 'Core plugins';
        const isOnCommunityList = tabId === 'community-plugins' || activeText === 'Community plugins';

        const coreHeading = this.findSectionHeading(modal, 'Core plugins');
        const communityHeading = this.findSectionHeading(modal, 'Community plugins');

        if (isCorePlugin || isOnCoreList) {
            this.setHeadingCollapsed(coreHeading, false);
        }
        if (isCommunityPlugin || isOnCommunityList) {
            this.setHeadingCollapsed(communityHeading, false);
        }

        if (this.settings.autoCollapseSections) {
            if (isCommunityPlugin || isOnCommunityList) {
                this.setHeadingCollapsed(coreHeading, true);
            } else if (isCorePlugin || isOnCoreList) {
                this.setHeadingCollapsed(communityHeading, true);
            }
        }
    }

    private findSectionHeading(modal: HTMLElement, label: string): HTMLElement | null {
        const byAttr = modal.querySelector<HTMLElement>(`[data-sh-label="${label}"]`);
        if (byAttr) return byAttr;

        const groups = Array.from(modal.querySelectorAll<HTMLElement>('.vertical-tab-header-group'));
        for (const group of groups) {
            const title = group.querySelector<HTMLElement>('.vertical-tab-header-group-title');
            if (title?.textContent?.trim() === label) return title;
        }

        const flatHeadings = Array.from(modal.querySelectorAll<HTMLElement>('.vertical-tab-nav-item-heading'));
        for (const h of flatHeadings) {
            if (h.textContent?.trim() === label) return h;
        }

        return null;
    }

    private getSectionNavItems(heading: HTMLElement): HTMLElement[] {
        const group = heading.closest('.vertical-tab-header-group');
        if (group) {
            const wrapper = group.querySelector<HTMLElement>('.vertical-tab-header-group-items');
            if (wrapper) return Array.from(wrapper.querySelectorAll<HTMLElement>('.vertical-tab-nav-item'));
            return Array.from(group.querySelectorAll<HTMLElement>('.vertical-tab-nav-item'));
        }
        const items: HTMLElement[] = [];
        let el = heading.nextElementSibling;
        while (el) {
            if (el.classList.contains('vertical-tab-nav-item-heading')) break;
            if (el.classList.contains('vertical-tab-nav-item')) items.push(el as HTMLElement);
            el = el.nextElementSibling;
        }
        return items;
    }

    private isHeadingCollapsed(heading: HTMLElement): boolean {
        const group = heading.closest('.vertical-tab-header-group');
        if (group) {
            const wrapper = group.querySelector<HTMLElement>('.vertical-tab-header-group-items');
            if (wrapper) return wrapper.style.display === 'none';
        }
        const first = this.getSectionNavItems(heading)[0];
        return first ? first.style.display === 'none' : false;
    }

    private setHeadingCollapsed(heading: HTMLElement | null, collapsed: boolean) {
        if (!heading) return;

        const group = heading.closest('.vertical-tab-header-group');
        if (group) {
            const wrapper = group.querySelector<HTMLElement>('.vertical-tab-header-group-items');
            if (wrapper) {
                wrapper.style.display = collapsed ? 'none' : '';
            } else {
                Array.from(group.querySelectorAll<HTMLElement>('.vertical-tab-nav-item')).forEach(el => {
                    el.style.display = collapsed ? 'none' : '';
                });
            }
        } else {
            this.getSectionNavItems(heading).forEach(el => {
                el.style.display = collapsed ? 'none' : '';
            });
        }

        const chevron = heading.querySelector<HTMLElement>('.sh-chevron');
        if (chevron) {
            chevron.style.transform = collapsed ? 'rotate(0deg)' : 'rotate(90deg)';
        }
    }

    private findOptionsNavItem(modal: HTMLElement, label: string): HTMLElement | null {
        const navItems = Array.from(modal.querySelectorAll<HTMLElement>('.vertical-tab-nav-item'));
        for (const item of navItems) {
            const nameEl = item.querySelector('.vertical-tab-nav-item-name');
            const text = (nameEl?.textContent ?? item.textContent ?? '').trim();
            if (text === label) return item;
        }
        return null;
    }

    private clearHighlightsIn(modal: HTMLElement) {
        const targets = '.vertical-tab-nav-item, .vertical-tab-header-group-title, .vertical-tab-nav-item-heading';
        modal.querySelectorAll<HTMLElement>(targets).forEach(el => {
            el.style.removeProperty('border');
            el.style.removeProperty('border-radius');
            el.style.removeProperty('box-shadow');
            el.style.removeProperty('outline');
            el.style.removeProperty('outline-offset');
        });
    }

    private clearAllHighlights() {
        const modal = document.querySelector<HTMLElement>('.modal-container .mod-settings');
        if (modal) this.clearHighlightsIn(modal);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

import { App, PluginSettingTab, Setting } from "obsidian";
import AutoCollapseSidebarPlugin from "./main";

const GROUPED_STYLES_ID = "sbc-grouped-settings-styles";
const GROUPED_STYLES_CSS = [
  ".sbc-grouped .setting-item-heading { background: transparent; border: none; padding: 0 0 6px 0; margin-top: 24px; }",
  ".sbc-grouped .setting-item-heading:first-child { margin-top: 8px; }",
  ".sbc-grouped .setting-item-heading .setting-item-name { font-size: var(--font-ui-medium); font-weight: 600; }",
  ".sbc-group { background: var(--background-secondary); border-radius: 8px; overflow: hidden; margin: 0 0 8px 0; }",
  ".sbc-group .setting-item { background: transparent !important; border: none !important; padding: 14px 18px; margin: 0; }",
  ".sbc-group .setting-item + .setting-item { border-top: 1px solid var(--background-modifier-border) !important; }",
].join("\n");

function injectGroupedSettingsStyles(): void {
  if (document.getElementById(GROUPED_STYLES_ID)) return;
  const style = document.createElement("style");
  style.id = GROUPED_STYLES_ID;
  style.textContent = GROUPED_STYLES_CSS;
  document.head.appendChild(style);
}

function applyGrouping(containerEl: HTMLElement): void {
  const children = Array.from(containerEl.children) as HTMLElement[];
  let currentGroup: HTMLElement | null = null;
  for (const child of children) {
    const isHeading = child.classList.contains("setting-item-heading");
    const isSettingItem =
      child.classList.contains("setting-item") && !isHeading;
    if (isSettingItem) {
      if (!currentGroup) {
        currentGroup = document.createElement("div");
        currentGroup.className = "sbc-group";
        containerEl.insertBefore(currentGroup, child);
      }
      currentGroup.appendChild(child);
    } else {
      currentGroup = null;
    }
  }
}

export interface AutoCollapseSidebarSettings {
  enabled: boolean;
  enableInFullScreen: boolean;
  timeoutSeconds: number;
  resetOnActivity: boolean;
  showVaultSwitcher: boolean;
  showPluginSettings: boolean;
  showObsidianSettings: boolean;
  closeCurrentVaultOnSwitch: boolean;
}

export const DEFAULT_SETTINGS: AutoCollapseSidebarSettings = {
  enabled: true,
  enableInFullScreen: true,
  timeoutSeconds: 5,
  resetOnActivity: true,
  showVaultSwitcher: true,
  showPluginSettings: true,
  showObsidianSettings: true,
  closeCurrentVaultOnSwitch: false,
};

export class AutoCollapseSidebarSettingTab extends PluginSettingTab {
  plugin: AutoCollapseSidebarPlugin;

  constructor(app: App, plugin: AutoCollapseSidebarPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("sbc-grouped");
    injectGroupedSettingsStyles();

    new Setting(containerEl).setName("Sidebar behaviour").setHeading();

    new Setting(containerEl)
      .setName("Enable auto-collapse")
      .setDesc(
        "Automatically collapse the left sidebar after a period of inactivity."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enabled)
          .onChange(async (value) => {
            this.plugin.settings.enabled = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable in full screen mode")
      .setDesc(
        "Auto-collapse the sidebar when Obsidian is in full screen mode."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableInFullScreen)
          .onChange(async (value) => {
            this.plugin.settings.enableInFullScreen = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Timeout (seconds)")
      .setDesc("Number of seconds of inactivity before the sidebar collapses.")
      .addText((text) =>
        text
          .setPlaceholder("5")
          .setValue(String(this.plugin.settings.timeoutSeconds))
          .onChange(async (value) => {
            const parsed = parseInt(value, 10);
            if (!isNaN(parsed) && parsed > 0) {
              this.plugin.settings.timeoutSeconds = parsed;
              await this.plugin.saveSettings();
            }
          })
      );

    new Setting(containerEl)
      .setName("Reset timer on sidebar activity")
      .setDesc(
        "Restart the countdown when the mouse moves or clicks within the sidebar."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.resetOnActivity)
          .onChange(async (value) => {
            this.plugin.settings.resetOnActivity = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl).setName("Vault switcher").setHeading();

    new Setting(containerEl)
      .setName("Close current vault on switch")
      .setDesc(
        "When enabled, closes the current window after opening the selected vault. When disabled, the current vault stays open and the new vault opens in a separate window."
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.closeCurrentVaultOnSwitch)
          .onChange(async (value) => {
            this.plugin.settings.closeCurrentVaultOnSwitch = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl).setName("Ribbon buttons").setHeading();

    new Setting(containerEl)
      .setName("Show vault switcher")
      .setDesc("Show the vault switcher button in the ribbon.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showVaultSwitcher)
          .onChange(async (value) => {
            this.plugin.settings.showVaultSwitcher = value;
            await this.plugin.saveSettings();
            this.plugin.applyRibbonVisibility();
          })
      );

    new Setting(containerEl)
      .setName("Show plugin settings")
      .setDesc("Show the plugin settings button in the ribbon.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showPluginSettings)
          .onChange(async (value) => {
            this.plugin.settings.showPluginSettings = value;
            await this.plugin.saveSettings();
            this.plugin.applyRibbonVisibility();
          })
      );

    new Setting(containerEl)
      .setName("Show Obsidian settings")
      .setDesc("Show the Obsidian settings button in the ribbon.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showObsidianSettings)
          .onChange(async (value) => {
            this.plugin.settings.showObsidianSettings = value;
            await this.plugin.saveSettings();
            this.plugin.applyRibbonVisibility();
          })
      );

    applyGrouping(containerEl);
  }
}

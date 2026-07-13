import { App, FuzzySuggestModal, Plugin } from "obsidian";
import {
  AutoCollapseSidebarSettings,
  DEFAULT_SETTINGS,
  AutoCollapseSidebarSettingTab,
} from "./settings";

interface VaultEntry {
  id: string;
  name: string;
  path: string;
  isCurrent: boolean;
}

function obsidianConfigPath(): string {
  const os = require("os");
  const path = require("path");
  const platform = process.platform;
  if (platform === "darwin") {
    return path.join(
      os.homedir(),
      "Library",
      "Application Support",
      "obsidian",
      "obsidian.json"
    );
  }
  if (platform === "win32") {
    return path.join(process.env["APPDATA"] || "", "obsidian", "obsidian.json");
  }
  return path.join(os.homedir(), ".config", "obsidian", "obsidian.json");
}

function readVaults(currentPath: string): VaultEntry[] {
  try {
    const fs = require("fs");
    const path = require("path");
    const raw = fs.readFileSync(obsidianConfigPath(), "utf8");
    const data = JSON.parse(raw);
    const vaults = data.vaults || {};
    const norm = (p: string) => p.replace(/\/$/, "");
    const cur = norm(currentPath);
    return Object.entries(vaults)
      .map(([id, v]: [string, any]) => ({
        id,
        name: path.basename(v.path),
        path: v.path,
        isCurrent: norm(v.path) === cur,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error("sidebar-auto-collapse: failed to read obsidian.json", e);
    return [];
  }
}

function openVaultInNewWindow(vaultName: string): void {
  const uri = `obsidian://open?vault=${encodeURIComponent(vaultName)}`;
  try {
    const { shell } = require("electron");
    shell.openExternal(uri);
  } catch {
    window.open(uri);
  }
}

function closeCurrentWindow(): void {
  try {
    const electron = require("electron");
    const remote = electron.remote;
    if (remote?.getCurrentWindow) {
      remote.getCurrentWindow().close();
      return;
    }
  } catch {}
  try {
    const remote = (window as any).require?.("@electron/remote");
    if (remote?.getCurrentWindow) {
      remote.getCurrentWindow().close();
      return;
    }
  } catch {}
  window.close();
}

class VaultSwitcherModal extends FuzzySuggestModal<VaultEntry> {
  constructor(
    app: App,
    private vaults: VaultEntry[],
    private onChoose: (v: VaultEntry) => void,
    placeholder: string
  ) {
    super(app);
    this.setPlaceholder(placeholder);
  }

  getItems(): VaultEntry[] {
    return this.vaults;
  }

  getItemText(item: VaultEntry): string {
    return item.isCurrent ? `${item.name} (current)` : item.name;
  }

  onChooseItem(item: VaultEntry): void {
    if (item.isCurrent) return;
    this.onChoose(item);
  }
}

export default class AutoCollapseSidebarPlugin extends Plugin {
  settings: AutoCollapseSidebarSettings;
  vaultRibbonEl: HTMLElement | null = null;
  pluginSettingsRibbonEl: HTMLElement | null = null;
  obsidianSettingsRibbonEl: HTMLElement | null = null;
  private collapseTimer: number | null = null;
  private wasCollapsed = true;
  private observer: MutationObserver | null = null;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoCollapseSidebarSettingTab(this.app, this));
    this.injectRibbonStyles();

    this.vaultRibbonEl = this.addRibbonIcon("vault", "Switch vault", () =>
      this.openVaultSwitcher()
    );

    this.pluginSettingsRibbonEl = this.addRibbonIcon(
      "flask-conical",
      "Sidebar Auto-Collapse settings",
      () => {
        (this.app as any).setting.open();
        (this.app as any).setting.openTabById("sidebar-auto-collapse");
      }
    );

    this.obsidianSettingsRibbonEl = this.addRibbonIcon(
      "settings",
      "Open settings",
      () => {
        (this.app as any).setting.open();
      }
    );

    this.applyRibbonVisibility();

    if (!this.repositionRibbonIcons()) {
      this.app.workspace.onLayoutReady(() => this.repositionRibbonIcons());
    }

    this.app.workspace.onLayoutReady(() => {
      this.wasCollapsed = this.app.workspace.leftSplit.collapsed;
      this.setupObserver();

      const leftEl = this.app.workspace.containerEl.querySelector(
        ".mod-left-split"
      ) as HTMLElement | null;
      if (leftEl) {
        this.registerDomEvent(leftEl, "mousemove", () => {
          if (
            this.settings.enabled &&
            this.settings.resetOnActivity &&
            this.collapseTimer !== null
          ) {
            this.startTimer();
          }
        });
        this.registerDomEvent(leftEl, "click", () => {
          if (
            this.settings.enabled &&
            this.settings.resetOnActivity &&
            this.collapseTimer !== null
          ) {
            this.startTimer();
          }
        });
      }

      if (!this.wasCollapsed && this.settings.enabled) {
        this.startTimer();
      }
    });
  }

  private repositionRibbonIcons(): boolean {
    const sidebarEl =
      this.app.workspace?.containerEl?.querySelector?.(".side-dock-actions");
    if (!sidebarEl) return false;
    if (this.vaultRibbonEl) sidebarEl.appendChild(this.vaultRibbonEl);
    if (this.pluginSettingsRibbonEl)
      sidebarEl.appendChild(this.pluginSettingsRibbonEl);
    if (this.obsidianSettingsRibbonEl)
      sidebarEl.appendChild(this.obsidianSettingsRibbonEl);
    return true;
  }

  applyRibbonVisibility() {
    if (this.vaultRibbonEl)
      this.vaultRibbonEl.classList.toggle(
        "sac-ribbon-hidden",
        !this.settings.showVaultSwitcher
      );
    if (this.pluginSettingsRibbonEl)
      this.pluginSettingsRibbonEl.classList.toggle(
        "sac-ribbon-hidden",
        !this.settings.showPluginSettings
      );
    if (this.obsidianSettingsRibbonEl)
      this.obsidianSettingsRibbonEl.classList.toggle(
        "sac-ribbon-hidden",
        !this.settings.showObsidianSettings
      );
  }

  private injectRibbonStyles() {
    const id = "sac-ribbon-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      ".sac-ribbon-hidden.sac-ribbon-hidden { display: none !important; }";
    document.head.appendChild(style);
    this.register(() => style.remove());
  }

  private openVaultSwitcher() {
    const adapter = this.app.vault.adapter as any;
    const currentPath: string =
      adapter.basePath || adapter.getBasePath?.() || "";
    const vaults = readVaults(currentPath);
    if (vaults.length === 0) {
      (this.app as any).commands.executeCommandById("app:switch-vault");
      return;
    }
    const closeCurrent = this.settings.closeCurrentVaultOnSwitch;
    const placeholder = closeCurrent
      ? "Switch to vault (closes current window)"
      : "Open vault in new window";
    new VaultSwitcherModal(
      this.app,
      vaults,
      (v) => {
        openVaultInNewWindow(v.name);
        if (closeCurrent) {
          window.setTimeout(() => closeCurrentWindow(), 400);
        }
      },
      placeholder
    ).open();
  }

  private setupObserver(): void {
    this.observer = new MutationObserver(() => {
      if (!this.settings.enabled) return;

      const isFullScreen = !!(
        document.fullscreenElement ?? (document as any).webkitFullscreenElement
      );
      if (isFullScreen && !this.settings.enableInFullScreen) return;

      const isCollapsed = this.app.workspace.leftSplit.collapsed;
      if (isCollapsed === this.wasCollapsed) return;

      if (!isCollapsed) {
        this.startTimer();
      } else {
        this.clearTimer();
      }

      this.wasCollapsed = isCollapsed;
    });

    this.observer.observe(this.app.workspace.containerEl, {
      attributes: true,
      subtree: true,
      childList: false,
    });
  }

  onunload() {
    this.clearTimer();
    this.observer?.disconnect();
  }

  private startTimer(): void {
    this.clearTimer();
    this.collapseTimer = window.setTimeout(() => {
      if (!this.app.workspace.leftSplit.collapsed) {
        this.app.workspace.leftSplit.collapse();
      }
      this.collapseTimer = null;
    }, this.settings.timeoutSeconds * 1000);
  }

  private clearTimer(): void {
    if (this.collapseTimer !== null) {
      window.clearTimeout(this.collapseTimer);
      this.collapseTimer = null;
    }
  }

  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as Partial<AutoCollapseSidebarSettings>
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

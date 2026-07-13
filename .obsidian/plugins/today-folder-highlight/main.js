const { Plugin, PluginSettingTab, Setting } = require("obsidian");

const CSS_CLASS = "is-today-folder";
const STYLE_EL_ID = "today-folder-highlight-dynamic";

const DEFAULT_SETTINGS = {
  useAccentColor: true,
  customColor: "#00e5ff",
  customColorLight: "#00acc1",
};

class TodayFolderHighlightPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new TodayFolderHighlightSettingTab(this.app, this));
    this.injectStyles();
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.applyHighlight())
    );
    this.app.workspace.onLayoutReady(() => {
      this.applyHighlight();
      setTimeout(() => this.applyHighlight(), 500);
      this.scheduleMidnightRefresh();
    });
  }

  onunload() {
    document
      .querySelectorAll("." + CSS_CLASS)
      .forEach((el) => el.classList.remove(CSS_CLASS));
    if (this._midnightTimer) clearTimeout(this._midnightTimer);
    const styleEl = document.getElementById(STYLE_EL_ID);
    if (styleEl) styleEl.remove();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  injectStyles() {
    let styleEl = document.getElementById(STYLE_EL_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_EL_ID;
      document.head.appendChild(styleEl);
    }

    let darkColor, lightColor;
    if (this.settings.useAccentColor) {
      darkColor = "var(--interactive-accent)";
      lightColor = "var(--interactive-accent)";
    } else {
      darkColor = this.settings.customColor;
      lightColor = this.settings.customColorLight;
    }

    styleEl.textContent = [
      ".nav-folder-title." +
        CSS_CLASS +
        " { color: " +
        darkColor +
        " !important; font-weight: 700 !important; text-decoration: underline !important; }",
      ".theme-light .nav-folder-title." +
        CSS_CLASS +
        " { color: " +
        lightColor +
        " !important; }",
    ].join("\n");
  }

  getTodayMMDD() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return mm + "-" + dd;
  }

  applyHighlight() {
    const today = this.getTodayMMDD();
    document
      .querySelectorAll("." + CSS_CLASS)
      .forEach((el) => el.classList.remove(CSS_CLASS));
    document.querySelectorAll(".nav-folder-title").forEach((el) => {
      const name = el.querySelector(".nav-folder-title-content");
      if (name && name.textContent.trim() === today) {
        el.classList.add(CSS_CLASS);
      }
    });
  }

  scheduleMidnightRefresh() {
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilMidnight = tomorrow - now + 1000;
    this._midnightTimer = setTimeout(() => {
      this.applyHighlight();
      this.scheduleMidnightRefresh();
    }, msUntilMidnight);
  }
}

class TodayFolderHighlightSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Use accent color")
      .setDesc("Use Obsidian's accent color. Disable to pick a custom color.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useAccentColor)
          .onChange(async (value) => {
            this.plugin.settings.useAccentColor = value;
            await this.plugin.saveSettings();
            this.plugin.injectStyles();
            this.display();
          })
      );

    if (!this.plugin.settings.useAccentColor) {
      new Setting(containerEl)
        .setName("Color (dark theme)")
        .addColorPicker((picker) =>
          picker
            .setValue(this.plugin.settings.customColor)
            .onChange(async (value) => {
              this.plugin.settings.customColor = value;
              await this.plugin.saveSettings();
              this.plugin.injectStyles();
            })
        );

      new Setting(containerEl)
        .setName("Color (light theme)")
        .addColorPicker((picker) =>
          picker
            .setValue(this.plugin.settings.customColorLight)
            .onChange(async (value) => {
              this.plugin.settings.customColorLight = value;
              await this.plugin.saveSettings();
              this.plugin.injectStyles();
            })
        );
    }
  }
}

module.exports = { __esModule: true, default: TodayFolderHighlightPlugin };

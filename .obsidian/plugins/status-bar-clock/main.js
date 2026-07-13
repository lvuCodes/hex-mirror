"use strict";

var obsidian = require("obsidian");

const DEFAULT_SETTINGS = {
  clockEnabled: true,
  format: "h:mm:ss A",
  prefix: "",
  timerEnabled: true,
  timerDefaultName: "",
  timerDefaultDuration: "5m",
  timerFormatType: "clock",
  timerClockFormat: "mm:ss",
  timerDurationLeadingZeros: "children",
  timerNotificationPulse: true,
  timerNotificationNotice: true,
  timerNotificationModal: false,
  timerNotificationAudio: true,
  alarmsEnabled: true,
  alarms: [],
  alarmStatusDisplay: "next-time",
  alarmNotificationPulse: true,
  alarmNotificationNotice: true,
  alarmNotificationModal: false,
  alarmNotificationAudio: true,
  showFlaskButton: true,
  showTimerAddRibbonButton: true,
  showTimerListRibbonButton: true,
  showAlarmListRibbonButton: true,
  showAlarmAddRibbonButton: true,
  timerShowInStatusBar: true,
  alarmShowInStatusBar: true,
};

const LEGACY_KEY_MAP = {
  timerName: "timerDefaultName",
  timerAlarmPulse: "timerNotificationPulse",
  timerAlarmNotice: "timerNotificationNotice",
  timerAlarmModal: "timerNotificationModal",
  timerAlarmAudio: "timerNotificationAudio",
  alarmIndicatorPulse: "alarmNotificationPulse",
  alarmIndicatorNotice: "alarmNotificationNotice",
  alarmIndicatorModal: "alarmNotificationModal",
  alarmIndicatorAudio: "alarmNotificationAudio",
  showTimerRibbonButton: "showTimerAddRibbonButton",
};

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const DEFAULT_ALARM_DAYS = [true, true, true, true, true, false, false];

function makeAlarmId() {
  return "a_" + Math.random().toString(36).slice(2, 10);
}
function makeTimerId() {
  return "t_" + Math.random().toString(36).slice(2, 10);
}

function makeDefaultAlarm() {
  return {
    id: makeAlarmId(),
    name: "",
    time: "08:00",
    days: DEFAULT_ALARM_DAYS.slice(),
    enabled: true,
  };
}

function monFirstDayIndex(date) {
  return (date.getDay() + 6) % 7;
}

function nextAlarmOccurrence(now, alarm) {
  if (!alarm.enabled) return null;
  if (!alarm.days.some((d) => d)) return null;
  const parts = (alarm.time || "").split(":");
  if (parts.length !== 2) return null;
  const hh = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  if (isNaN(hh) || isNaN(mm)) return null;
  const todayIdx = monFirstDayIndex(now);
  for (let offset = 0; offset < 8; offset++) {
    const idx = (todayIdx + offset) % 7;
    if (!alarm.days[idx]) continue;
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + offset);
    candidate.setHours(hh, mm, 0, 0);
    if (candidate > now) return candidate;
  }
  return null;
}

function pickNextAlarm(now, alarms) {
  let best = null;
  for (const a of alarms) {
    const t = nextAlarmOccurrence(now, a);
    if (!t) continue;
    if (!best || t < best.time) best = { alarm: a, time: t };
  }
  return best;
}

const CLOCK_TOKENS = [
  { token: "HH", fn: (d) => String(d.getHours()).padStart(2, "0") },
  { token: "H", fn: (d) => String(d.getHours()) },
  {
    token: "hh",
    fn: (d) => {
      const h = d.getHours() % 12 || 12;
      return String(h).padStart(2, "0");
    },
  },
  { token: "h", fn: (d) => String(d.getHours() % 12 || 12) },
  { token: "mm", fn: (d) => String(d.getMinutes()).padStart(2, "0") },
  { token: "ss", fn: (d) => String(d.getSeconds()).padStart(2, "0") },
  { token: "A", fn: (d) => (d.getHours() >= 12 ? "PM" : "AM") },
  { token: "a", fn: (d) => (d.getHours() >= 12 ? "pm" : "am") },
];

function formatTime(format, date) {
  let result = format;
  for (const { token, fn } of CLOCK_TOKENS) {
    result = result.replace(token, fn(date));
  }
  return result;
}

const TIMER_TOKENS = [
  { token: "HH", fn: (s) => String(Math.floor(s / 3600)).padStart(2, "0") },
  { token: "H", fn: (s) => String(Math.floor(s / 3600)) },
  {
    token: "mm",
    fn: (s) => String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
  },
  { token: "M", fn: (s) => String(Math.floor(s / 60)) },
  { token: "m", fn: (s) => String(Math.floor((s % 3600) / 60)) },
  { token: "ss", fn: (s) => String(s % 60).padStart(2, "0") },
  { token: "s", fn: (s) => String(s % 60) },
];

function formatTimerClock(format, totalSeconds) {
  let result = format;
  for (const { token, fn } of TIMER_TOKENS) {
    result = result.replace(token, fn(totalSeconds));
  }
  return result;
}

function formatTimerDuration(totalSeconds, leadingZeros, initialSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const scopeSeconds = Math.max(initialSeconds, totalSeconds);
  const showHours = scopeSeconds >= 3600;
  const showMinutes = scopeSeconds >= 60;
  const pad2 = (n) => String(n).padStart(2, "0");
  if (leadingZeros === "all") {
    if (showHours) return `${pad2(h)}h${pad2(m)}m${pad2(s)}s`;
    if (showMinutes) return `${pad2(m)}m${pad2(s)}s`;
    return `${pad2(s)}s`;
  }
  if (leadingZeros === "children") {
    if (showHours) return `${h}h${pad2(m)}m${pad2(s)}s`;
    if (showMinutes) return `${m}m${pad2(s)}s`;
    return `${s}s`;
  }
  if (showHours) return `${h}h${m}m${s}s`;
  if (showMinutes) return `${m}m${s}s`;
  return `${s}s`;
}

function parseDuration(input) {
  if (!input) return null;
  const trimmed = input.trim().toLowerCase();
  const letterRe = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
  const letterMatch = trimmed.match(letterRe);
  if (letterMatch && (letterMatch[1] || letterMatch[2] || letterMatch[3])) {
    const h = parseInt(letterMatch[1] || "0", 10);
    const m = parseInt(letterMatch[2] || "0", 10);
    const s = parseInt(letterMatch[3] || "0", 10);
    return h * 3600 + m * 60 + s;
  }
  const parts = trimmed.split(":");
  if (
    parts.length >= 1 &&
    parts.length <= 3 &&
    parts.every((p) => /^\d+$/.test(p))
  ) {
    const nums = parts.map((p) => parseInt(p, 10));
    if (nums.length === 3) return nums[0] * 3600 + nums[1] * 60 + nums[2];
    if (nums.length === 2) return nums[0] * 60 + nums[1];
    if (nums.length === 1) return nums[0] * 60;
  }
  return null;
}

function secondsToCanonical(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0) parts.push(`${s}s`);
  return parts.join("") || "0s";
}

function renderDurationSteppers(parentEl, initialSeconds, options) {
  const opts = options || {};
  const initH = Math.floor(initialSeconds / 3600);
  const initM = Math.floor((initialSeconds % 3600) / 60);
  const initS = initialSeconds % 60;

  const row = parentEl.createEl("div");
  row.style.display = "flex";
  row.style.gap = "14px";
  row.style.alignItems = "flex-end";
  row.style.justifyContent = "center";
  if (opts.marginTop) row.style.marginTop = opts.marginTop;

  const makeField = (label, value, max) => {
    const col = row.createEl("div");
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
    const input = col.createEl("input", { type: "number" });
    input.min = "0";
    if (max != null) input.max = String(max);
    input.value = String(value);
    input.style.width = "4.5em";
    input.style.textAlign = "center";
    const lbl = col.createEl("span", { text: label });
    lbl.style.fontSize = "var(--font-ui-smaller)";
    lbl.style.color = "var(--text-muted)";
    lbl.style.marginTop = "4px";
    return input;
  };

  const hourInput = makeField("hours", initH, null);
  const minInput = makeField("minutes", initM, 59);
  const secInput = makeField("seconds", initS, 59);

  const read = () => {
    const h = Math.max(0, parseInt(hourInput.value, 10) || 0);
    const m = Math.max(0, parseInt(minInput.value, 10) || 0);
    const s = Math.max(0, parseInt(secInput.value, 10) || 0);
    return h * 3600 + m * 60 + s;
  };

  if (typeof opts.onChange === "function") {
    [hourInput, minInput, secInput].forEach((inp) => {
      inp.addEventListener("input", () => opts.onChange(read()));
    });
  }

  return {
    row,
    hourInput,
    minInput,
    secInput,
    getSeconds: read,
    initH,
    initM,
    initS,
  };
}

function renderDaysSelector(parentEl, days, onChange) {
  const row = parentEl.createEl("div");
  row.style.display = "inline-flex";
  row.style.gap = "4px";
  const buttons = [];
  DAY_LABELS.forEach((label, idx) => {
    const btn = row.createEl("button", { text: label });
    btn.type = "button";
    btn.style.width = "2.2em";
    btn.style.padding = "2px 0";
    btn.style.fontSize = "var(--font-ui-smaller)";
    const paint = () => {
      if (days[idx]) {
        btn.classList.add("mod-cta");
        btn.style.opacity = "1";
      } else {
        btn.classList.remove("mod-cta");
        btn.style.opacity = "0.55";
      }
    };
    btn.addEventListener("click", () => {
      days[idx] = !days[idx];
      paint();
      if (onChange) onChange(days);
    });
    paint();
    buttons.push(btn);
  });
  return { row, buttons };
}

function applyModalFit(modal) {
  modal.modalEl.style.width = "fit-content";
  modal.modalEl.style.minWidth = "min(420px, 90vw)";
  modal.modalEl.style.maxWidth = "90vw";
}

function addLabeledToggles(setting, items) {
  setting.controlEl.style.display = "flex";
  setting.controlEl.style.flexWrap = "wrap";
  setting.controlEl.style.gap = "16px";
  setting.controlEl.style.alignItems = "center";
  for (const item of items) {
    const wrap = setting.controlEl.createEl("div");
    wrap.style.display = "inline-flex";
    wrap.style.alignItems = "center";
    wrap.style.gap = "6px";
    const lbl = wrap.createEl("span", { text: item.label });
    lbl.style.color = "var(--text-muted)";
    lbl.style.fontSize = "var(--font-ui-smaller)";
    const tog = new obsidian.ToggleComponent(wrap);
    tog.setValue(item.value);
    tog.onChange(item.onChange);
  }
}

function applyGrouping(containerEl) {
  const children = Array.from(containerEl.children);
  let currentGroup = null;
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

class DurationModal extends obsidian.Modal {
  constructor(app, defaultDuration, onSubmit, defaultName) {
    super(app);
    this.defaultDuration = defaultDuration;
    this.onSubmit = onSubmit;
    this.defaultName = defaultName || "";
  }
  onOpen() {
    applyModalFit(this);
    const { contentEl } = this;
    const heading = contentEl.createEl("h3", { text: "Add timer" });
    heading.style.textAlign = "center";
    heading.style.marginBottom = "12px";

    const nameRow = contentEl.createEl("div");
    nameRow.style.display = "flex";
    nameRow.style.gap = "8px";
    nameRow.style.alignItems = "center";
    nameRow.style.justifyContent = "center";
    nameRow.style.marginBottom = "12px";
    const nameLabel = nameRow.createEl("label", { text: "Name" });
    nameLabel.style.color = "var(--text-muted)";
    nameLabel.style.fontSize = "var(--font-ui-smaller)";
    const nameInput = nameRow.createEl("input", { type: "text" });
    nameInput.placeholder = this.defaultName || "Timer";
    nameInput.style.width = "14em";

    const initialSeconds = parseDuration(this.defaultDuration) || 0;
    const stepper = renderDurationSteppers(contentEl, initialSeconds);

    const submit = () => {
      const total = stepper.getSeconds();
      if (total <= 0) {
        new obsidian.Notice("Duration must be greater than zero.");
        return;
      }
      const name = (nameInput.value || "").trim() || this.defaultName || "";
      this.onSubmit(total, secondsToCanonical(total), name);
      this.close();
    };

    [nameInput, stepper.hourInput, stepper.minInput, stepper.secInput].forEach(
      (inp) => {
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        });
      }
    );

    const row = contentEl.createEl("div");
    row.style.marginTop = "16px";
    row.style.display = "flex";
    row.style.justifyContent = "flex-end";
    row.style.gap = "8px";
    const cancel = row.createEl("button", { text: "Cancel" });
    const ok = row.createEl("button", { text: "Start", cls: "mod-cta" });
    cancel.addEventListener("click", () => this.close());
    ok.addEventListener("click", submit);

    window.setTimeout(() => {
      const target =
        stepper.initH > 0
          ? stepper.hourInput
          : stepper.initM > 0
            ? stepper.minInput
            : stepper.secInput;
      target.focus();
      target.select();
    }, 0);
  }
  onClose() {
    this.contentEl.empty();
  }
}

class NotificationModal extends obsidian.Modal {
  constructor(app, onDismiss, label, icon) {
    super(app);
    this.onDismiss = onDismiss;
    this.label = label || "Timer finished";
    this.icon = icon || "⏱";
  }
  onOpen() {
    applyModalFit(this);
    const { contentEl } = this;
    const heading = contentEl.createEl("h3", {
      text: `${this.icon} ${this.label}`,
    });
    heading.style.textAlign = "center";
    const row = contentEl.createEl("div");
    row.style.marginTop = "12px";
    row.style.display = "flex";
    row.style.justifyContent = "flex-end";
    const ok = row.createEl("button", { text: "Dismiss", cls: "mod-cta" });
    ok.addEventListener("click", () => this.close());
    window.setTimeout(() => ok.focus(), 0);
  }
  onClose() {
    this.contentEl.empty();
    if (this.onDismiss) this.onDismiss();
  }
}

class AddAlarmModal extends obsidian.Modal {
  constructor(app, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
    this.alarm = makeDefaultAlarm();
  }
  onOpen() {
    applyModalFit(this);
    const { contentEl } = this;
    const heading = contentEl.createEl("h3", { text: "Add alarm" });
    heading.style.textAlign = "center";

    const grid = contentEl.createEl("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "max-content 1fr";
    grid.style.columnGap = "12px";
    grid.style.rowGap = "10px";
    grid.style.alignItems = "center";
    grid.style.marginTop = "8px";

    const addRow = (labelText, controlBuilder) => {
      const label = grid.createEl("label", { text: labelText });
      label.style.color = "var(--text-muted)";
      const cell = grid.createEl("div");
      controlBuilder(cell);
    };

    let nameInput, timeInput;
    addRow("Name", (cell) => {
      nameInput = cell.createEl("input", { type: "text" });
      nameInput.placeholder = "Wake, Lunch, …";
      nameInput.style.width = "100%";
    });
    addRow("Time", (cell) => {
      timeInput = cell.createEl("input", { type: "time" });
      timeInput.value = this.alarm.time;
    });
    addRow("Days", (cell) => {
      renderDaysSelector(cell, this.alarm.days);
    });

    const buttonRow = contentEl.createEl("div");
    buttonRow.style.marginTop = "16px";
    buttonRow.style.display = "flex";
    buttonRow.style.justifyContent = "flex-end";
    buttonRow.style.gap = "8px";
    const cancel = buttonRow.createEl("button", { text: "Cancel" });
    const ok = buttonRow.createEl("button", { text: "Add", cls: "mod-cta" });
    const submit = () => {
      const time = (timeInput.value || "").trim();
      if (!/^\d{2}:\d{2}$/.test(time)) {
        new obsidian.Notice("Pick a valid time.");
        return;
      }
      if (!this.alarm.days.some((d) => d)) {
        new obsidian.Notice("Select at least one day.");
        return;
      }
      this.alarm.name = (nameInput.value || "").trim();
      this.alarm.time = time;
      this.onSubmit(this.alarm);
      this.close();
    };
    cancel.addEventListener("click", () => this.close());
    ok.addEventListener("click", submit);
    [nameInput, timeInput].forEach((inp) => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
    });
    window.setTimeout(() => nameInput.focus(), 0);
  }
  onClose() {
    this.contentEl.empty();
  }
}

class TimersListModal extends obsidian.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
  }
  onOpen() {
    applyModalFit(this);
    this.renderContent();
    this.refreshInterval = window.setInterval(() => this.renderContent(), 500);
    this.plugin.listModal = this;
  }
  onClose() {
    window.clearInterval(this.refreshInterval);
    if (this.plugin.listModal === this) this.plugin.listModal = null;
    this.contentEl.empty();
  }
  refresh() {
    this.renderContent();
  }
  renderContent() {
    const { contentEl } = this;
    contentEl.empty();
    const heading = contentEl.createEl("h3", { text: "Active timers" });
    heading.style.textAlign = "center";

    const addBtn = contentEl.createEl("button", {
      text: "＋ Add timer",
      cls: "mod-cta",
    });
    addBtn.style.display = "block";
    addBtn.style.margin = "0 auto 12px auto";
    addBtn.addEventListener("click", () => {
      this.close();
      this.plugin.promptAndStart();
    });

    if (this.plugin.timers.length === 0) {
      const empty = contentEl.createEl("div", { text: "No active timers." });
      empty.style.color = "var(--text-muted)";
      empty.style.textAlign = "center";
      empty.style.padding = "8px 0";
      return;
    }

    const list = contentEl.createEl("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "8px";

    const order = { alarming: 0, running: 1, paused: 2 };
    const sorted = this.plugin.timers.slice().sort((a, b) => {
      const cmp = (order[a.mode] || 9) - (order[b.mode] || 9);
      if (cmp !== 0) return cmp;
      return a.remainingMs - b.remainingMs;
    });

    for (const t of sorted) {
      const row = list.createEl("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "10px";
      row.style.padding = "8px 12px";
      row.style.background = "var(--background-secondary)";
      row.style.borderRadius = "8px";

      const seconds = Math.max(0, Math.ceil(t.remainingMs / 1000));
      const formatted = this.plugin.formatTimerValue(seconds, t.initialSeconds);
      const name = (t.name || "").trim() || "Timer";

      const label = row.createEl("div");
      label.style.flex = "1";
      label.style.fontVariantNumeric = "tabular-nums";
      const nameSpan = label.createEl("span", { text: name });
      nameSpan.style.fontWeight = "500";
      label.createEl("span", { text: "  " + formatted });
      if (t.mode === "paused") {
        const tag = label.createEl("span", { text: "  (paused)" });
        tag.style.color = "var(--text-muted)";
      } else if (t.mode === "alarming") {
        const tag = label.createEl("span", { text: "  (finished)" });
        tag.style.color = "var(--text-error)";
      }

      const pauseLabel =
        t.mode === "paused" ? "▶" : t.mode === "alarming" ? "✓" : "⏸";
      const pauseTitle =
        t.mode === "paused"
          ? "Resume"
          : t.mode === "alarming"
            ? "Dismiss"
            : "Pause";
      const pauseBtn = row.createEl("button", { text: pauseLabel });
      pauseBtn.title = pauseTitle;
      pauseBtn.style.padding = "2px 10px";
      pauseBtn.addEventListener("click", () => {
        if (t.mode === "paused") this.plugin.resumeTimerById(t.id);
        else if (t.mode === "running") this.plugin.pauseTimerById(t.id);
        else if (t.mode === "alarming") this.plugin.dismissTimerById(t.id);
      });

      const del = row.createEl("button", { text: "×" });
      del.title = "Remove timer";
      del.style.padding = "2px 10px";
      del.addEventListener("click", () => this.plugin.removeTimerById(t.id));
    }
  }
}

class StatusBarClockSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("sbc-grouped");
    const s = this.plugin.settings;

    new obsidian.Setting(containerEl).setName("Clock").setHeading();

    new obsidian.Setting(containerEl)
      .setName("Enable clock")
      .setDesc("Show the clock status-bar item.")
      .addToggle((toggle) =>
        toggle.setValue(s.clockEnabled).onChange(async (value) => {
          s.clockEnabled = value;
          await this.plugin.saveSettings();
          this.plugin.applyClockVisibility();
          this.plugin.updateClock();
          this.display();
        })
      );

    if (s.clockEnabled) {
      new obsidian.Setting(containerEl)
        .setName("Time format")
        .setDesc(
          "Tokens: H (hour), HH (padded 24h), h (12h), hh (padded 12h), mm (minutes), ss (seconds), A (AM/PM), a (am/pm). Example: h:mm:ss A"
        )
        .addText((text) =>
          text
            .setPlaceholder("h:mm:ss A")
            .setValue(s.format)
            .onChange(async (value) => {
              s.format = value;
              await this.plugin.saveSettings();
              this.plugin.updateClock();
            })
        );

      new obsidian.Setting(containerEl)
        .setName("Prefix")
        .setDesc("Text or symbol before the time. Leave blank for none.")
        .addText((text) =>
          text
            .setPlaceholder("e.g. | ")
            .setValue(s.prefix)
            .onChange(async (value) => {
              s.prefix = value;
              await this.plugin.saveSettings();
              this.plugin.updateClock();
            })
        );
    }

    new obsidian.Setting(containerEl).setName("Alarms").setHeading();

    new obsidian.Setting(containerEl)
      .setName("Enable alarms")
      .setDesc(
        "Show the alarm status-bar item and fire scheduled alarms. Disabling silences all alarms but keeps definitions."
      )
      .addToggle((toggle) =>
        toggle.setValue(s.alarmsEnabled).onChange(async (value) => {
          s.alarmsEnabled = value;
          await this.plugin.saveSettings();
          this.plugin.applyAlarmVisibility();
          this.plugin.renderAlarmStatus();
          this.plugin.updateRibbonVisibility();
          this.display();
        })
      );

    if (s.alarmsEnabled) {
      new obsidian.Setting(containerEl)
        .setName("Show in status bar")
        .setDesc(
          "Show the alarm status-bar item. Disabling hides the item but keeps alarms firing."
        )
        .addToggle((toggle) =>
          toggle.setValue(s.alarmShowInStatusBar).onChange(async (value) => {
            s.alarmShowInStatusBar = value;
            await this.plugin.saveSettings();
            this.plugin.applyAlarmVisibility();
          })
        );

      const alarmRibbonSetting = new obsidian.Setting(containerEl)
        .setName("Ribbon buttons")
        .setDesc("Show alarm-related buttons in the left ribbon.");
      addLabeledToggles(alarmRibbonSetting, [
        {
          label: "Alarm list",
          value: s.showAlarmListRibbonButton,
          onChange: async (v) => {
            s.showAlarmListRibbonButton = v;
            await this.plugin.saveSettings();
            this.plugin.updateRibbonVisibility();
          },
        },
        {
          label: "Add alarm",
          value: s.showAlarmAddRibbonButton,
          onChange: async (v) => {
            s.showAlarmAddRibbonButton = v;
            await this.plugin.saveSettings();
            this.plugin.updateRibbonVisibility();
          },
        },
      ]);

      const addAlarmRow = containerEl.createEl("div");
      addAlarmRow.addClass("sbc-add-alarm-row");
      const addAlarmBtn = addAlarmRow.createEl("button", {
        text: "＋ Add alarm",
        cls: "mod-cta",
      });
      addAlarmBtn.addEventListener("click", () =>
        this.plugin.openAddAlarmModal(() => this.display())
      );

      const alarmsListEl = containerEl.createEl("div");
      alarmsListEl.addClass("sbc-alarm-list");
      if (s.alarms.length === 0) {
        const empty = alarmsListEl.createEl("div", { text: "No alarms yet." });
        empty.style.color = "var(--text-muted)";
        empty.style.fontSize = "var(--font-ui-smaller)";
        empty.style.padding = "6px 14px";
      }
      for (const alarm of s.alarms) {
        this.renderAlarmRow(alarmsListEl, alarm);
      }

      new obsidian.Setting(containerEl)
        .setName("Status bar display")
        .setDesc("What the alarm status-bar item shows.")
        .addDropdown((dd) =>
          dd
            .addOption("icon-only", "Icon only")
            .addOption("next-time", "Icon + next time")
            .addOption("next-time-name", "Icon + next time + name")
            .setValue(s.alarmStatusDisplay)
            .onChange(async (value) => {
              s.alarmStatusDisplay = value;
              await this.plugin.saveSettings();
              this.plugin.renderAlarmStatus();
            })
        );

      new obsidian.Setting(containerEl)
        .setName("Alarm notifications")
        .setHeading();

      new obsidian.Setting(containerEl)
        .setName("Pulse status bar")
        .setDesc(
          "Gentle 2-second opacity pulse on the alarm item when an alarm fires."
        )
        .addToggle((toggle) =>
          toggle.setValue(s.alarmNotificationPulse).onChange(async (value) => {
            s.alarmNotificationPulse = value;
            await this.plugin.saveSettings();
          })
        );

      const alarmPopupSetting = new obsidian.Setting(containerEl)
        .setName("Pop-up alerts")
        .setDesc(
          "Notice = sticky toast. Modal = blocking dialog that must be dismissed."
        );
      addLabeledToggles(alarmPopupSetting, [
        {
          label: "Notice",
          value: s.alarmNotificationNotice,
          onChange: async (v) => {
            s.alarmNotificationNotice = v;
            await this.plugin.saveSettings();
          },
        },
        {
          label: "Modal",
          value: s.alarmNotificationModal,
          onChange: async (v) => {
            s.alarmNotificationModal = v;
            await this.plugin.saveSettings();
          },
        },
      ]);

      new obsidian.Setting(containerEl)
        .setName("Audio alarm")
        .setDesc("Three soft beeps when an alarm fires.")
        .addButton((btn) =>
          btn
            .setIcon("play")
            .setTooltip("Play sample")
            .onClick(() => this.plugin.startAudio())
        )
        .addToggle((toggle) =>
          toggle.setValue(s.alarmNotificationAudio).onChange(async (value) => {
            s.alarmNotificationAudio = value;
            await this.plugin.saveSettings();
          })
        );
    }

    new obsidian.Setting(containerEl).setName("Timer").setHeading();

    new obsidian.Setting(containerEl)
      .setName("Enable timer")
      .setDesc(
        "Show the timer status-bar item and allow timer commands. Disabling clears all active timers."
      )
      .addToggle((toggle) =>
        toggle.setValue(s.timerEnabled).onChange(async (value) => {
          s.timerEnabled = value;
          await this.plugin.saveSettings();
          if (!value) this.plugin.clearAllTimers();
          this.plugin.applyTimerVisibility();
          this.plugin.updateRibbonVisibility();
          this.display();
        })
      );

    if (s.timerEnabled) {
      new obsidian.Setting(containerEl)
        .setName("Show in status bar")
        .setDesc(
          "Show the timer status-bar item. Disabling hides the item but keeps timer commands and ribbon buttons working."
        )
        .addToggle((toggle) =>
          toggle.setValue(s.timerShowInStatusBar).onChange(async (value) => {
            s.timerShowInStatusBar = value;
            await this.plugin.saveSettings();
            this.plugin.applyTimerVisibility();
          })
        );

      const timerRibbonSetting = new obsidian.Setting(containerEl)
        .setName("Ribbon buttons")
        .setDesc("Show timer-related buttons in the left ribbon.");
      addLabeledToggles(timerRibbonSetting, [
        {
          label: "Add timer",
          value: s.showTimerAddRibbonButton,
          onChange: async (v) => {
            s.showTimerAddRibbonButton = v;
            await this.plugin.saveSettings();
            this.plugin.updateRibbonVisibility();
          },
        },
        {
          label: "Timer list",
          value: s.showTimerListRibbonButton,
          onChange: async (v) => {
            s.showTimerListRibbonButton = v;
            await this.plugin.saveSettings();
            this.plugin.updateRibbonVisibility();
          },
        },
      ]);

      new obsidian.Setting(containerEl)
        .setName("Default timer name")
        .setDesc(
          'Pre-filled placeholder when adding a new timer (e.g. "Pomodoro").'
        )
        .addText((text) =>
          text
            .setPlaceholder("Pomodoro")
            .setValue(s.timerDefaultName)
            .onChange(async (value) => {
              s.timerDefaultName = value;
              await this.plugin.saveSettings();
              this.plugin.renderTimer();
            })
        );

      const defaultDurationSetting = new obsidian.Setting(containerEl)
        .setName("Default duration")
        .setDesc(
          "Pre-filled into the duration prompt when adding a new timer."
        );
      const initialDefaultSeconds = parseDuration(s.timerDefaultDuration) || 0;
      renderDurationSteppers(
        defaultDurationSetting.controlEl,
        initialDefaultSeconds,
        {
          onChange: async (total) => {
            s.timerDefaultDuration = secondsToCanonical(total);
            await this.plugin.saveSettings();
          },
        }
      );

      new obsidian.Setting(containerEl)
        .setName("Format type")
        .setDesc(
          "Clock: colon-separated tokens (mm:ss, hh:mm:ss). Duration: letter-suffixed units (1h05m08s)."
        )
        .addDropdown((dd) =>
          dd
            .addOption("clock", "Clock")
            .addOption("duration", "Duration")
            .setValue(s.timerFormatType)
            .onChange(async (value) => {
              s.timerFormatType = value;
              await this.plugin.saveSettings();
              this.plugin.renderTimer();
              this.display();
            })
        );

      if (s.timerFormatType === "clock") {
        new obsidian.Setting(containerEl)
          .setName("Clock format")
          .setDesc(
            "Tokens: H/HH (hours), m/mm (minutes 0–59), M (total minutes), s/ss (seconds 0–59). Example: mm:ss"
          )
          .addText((text) =>
            text
              .setPlaceholder("mm:ss")
              .setValue(s.timerClockFormat)
              .onChange(async (value) => {
                s.timerClockFormat = value;
                await this.plugin.saveSettings();
                this.plugin.renderTimer();
              })
          );
      } else {
        new obsidian.Setting(containerEl)
          .setName("Duration leading zeros")
          .setDesc("all → 01h05m08s · children → 1h05m08s · none → 1h5m8s")
          .addDropdown((dd) =>
            dd
              .addOption("all", "all")
              .addOption("children", "children")
              .addOption("none", "none")
              .setValue(s.timerDurationLeadingZeros)
              .onChange(async (value) => {
                s.timerDurationLeadingZeros = value;
                await this.plugin.saveSettings();
                this.plugin.renderTimer();
              })
          );
      }

      new obsidian.Setting(containerEl)
        .setName("Timer notifications")
        .setHeading();

      new obsidian.Setting(containerEl)
        .setName("Pulse status bar")
        .setDesc(
          "Gentle 2-second opacity pulse on the timer item when finished. Subtle to avoid photosensitivity issues."
        )
        .addToggle((toggle) =>
          toggle.setValue(s.timerNotificationPulse).onChange(async (value) => {
            s.timerNotificationPulse = value;
            await this.plugin.saveSettings();
            this.plugin.renderTimer();
          })
        );

      const timerPopupSetting = new obsidian.Setting(containerEl)
        .setName("Pop-up alerts")
        .setDesc(
          "Notice = sticky toast. Modal = blocking dialog that must be dismissed."
        );
      addLabeledToggles(timerPopupSetting, [
        {
          label: "Notice",
          value: s.timerNotificationNotice,
          onChange: async (v) => {
            s.timerNotificationNotice = v;
            await this.plugin.saveSettings();
          },
        },
        {
          label: "Modal",
          value: s.timerNotificationModal,
          onChange: async (v) => {
            s.timerNotificationModal = v;
            await this.plugin.saveSettings();
          },
        },
      ]);

      new obsidian.Setting(containerEl)
        .setName("Audio alarm")
        .setDesc("Three soft beeps when the timer finishes.")
        .addButton((btn) =>
          btn
            .setIcon("play")
            .setTooltip("Play sample")
            .onClick(() => this.plugin.startAudio())
        )
        .addToggle((toggle) =>
          toggle.setValue(s.timerNotificationAudio).onChange(async (value) => {
            s.timerNotificationAudio = value;
            await this.plugin.saveSettings();
          })
        );
    }

    new obsidian.Setting(containerEl).setName("Ribbon buttons").setHeading();

    new obsidian.Setting(containerEl)
      .setName("Show plugin settings button")
      .setDesc(
        "Show a flask ribbon button that opens this plugin's settings page."
      )
      .addToggle((toggle) =>
        toggle.setValue(s.showFlaskButton).onChange(async (value) => {
          s.showFlaskButton = value;
          await this.plugin.saveSettings();
          this.plugin.updateRibbonVisibility();
        })
      );

    applyGrouping(containerEl);
  }

  renderAlarmRow(parentEl, alarm) {
    const row = parentEl.createEl("div");
    row.addClass("sbc-alarm-row");

    const nameInput = row.createEl("input", { type: "text" });
    nameInput.placeholder = "Name";
    nameInput.value = alarm.name;
    nameInput.style.flex = "1 1 8em";
    nameInput.style.minWidth = "6em";
    nameInput.addEventListener("input", async () => {
      alarm.name = nameInput.value;
      await this.plugin.saveSettings();
      this.plugin.renderAlarmStatus();
    });

    const timeInput = row.createEl("input", { type: "time" });
    timeInput.value = alarm.time;
    timeInput.addEventListener("input", async () => {
      const v = timeInput.value;
      if (/^\d{2}:\d{2}$/.test(v)) {
        alarm.time = v;
        await this.plugin.saveSettings();
        this.plugin.renderAlarmStatus();
      }
    });

    renderDaysSelector(row, alarm.days, async () => {
      await this.plugin.saveSettings();
      this.plugin.renderAlarmStatus();
    });

    const enableLabel = row.createEl("label", { text: "on" });
    enableLabel.style.display = "inline-flex";
    enableLabel.style.alignItems = "center";
    enableLabel.style.gap = "4px";
    enableLabel.style.color = "var(--text-muted)";
    const enableInput = enableLabel.createEl("input", { type: "checkbox" });
    enableInput.checked = !!alarm.enabled;
    enableInput.addEventListener("change", async () => {
      alarm.enabled = enableInput.checked;
      await this.plugin.saveSettings();
      this.plugin.renderAlarmStatus();
    });

    const del = row.createEl("button", { text: "×" });
    del.title = "Delete alarm";
    del.style.padding = "2px 8px";
    del.addEventListener("click", async () => {
      this.plugin.settings.alarms = this.plugin.settings.alarms.filter(
        (a) => a.id !== alarm.id
      );
      await this.plugin.saveSettings();
      this.plugin.renderAlarmStatus();
      this.display();
    });
  }
}

class StatusBarClockPlugin extends obsidian.Plugin {
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new StatusBarClockSettingTab(this.app, this));
    this.injectStyles();

    this.timers = [];
    this.listModal = null;
    this.activeTimerNotices = new Map();

    this.timerAddRibbonEl = this.addRibbonIcon("clock-plus", "Add timer", () =>
      this.promptAndStart()
    );
    this.timerListRibbonEl = this.addRibbonIcon(
      "clock-alert",
      "View active timers",
      () => this.openTimersListModal()
    );
    this.alarmListRibbonEl = this.addRibbonIcon(
      "alarm-clock",
      "View alarms",
      () => {
        this.app.setting.open();
        this.app.setting.openTabById("status-bar-clock");
      }
    );
    this.alarmAddRibbonEl = this.addRibbonIcon(
      "alarm-clock-plus",
      "Add alarm",
      () => this.openAddAlarmModal()
    );
    this.flaskRibbonEl = this.addRibbonIcon(
      "flask-conical",
      "Status Bar Clock settings",
      () => {
        this.app.setting.open();
        this.app.setting.openTabById("status-bar-clock");
      }
    );
    this.updateRibbonVisibility();
    if (!this.repositionRibbonIcons()) {
      this.app.workspace.onLayoutReady(() => this.repositionRibbonIcons());
    }

    this.timerEl = this.addStatusBarItem();
    this.timerEl.addClass("status-bar-timer");
    this.timerEl.style.cursor = "pointer";
    this.timerEl.addEventListener("click", () => this.handleTimerClick());
    this.timerEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.promptAndStart();
    });
    this.timerInterval = window.setInterval(() => this.tickTimer(), 250);
    this.renderTimer();
    this.applyTimerVisibility();

    this.alarmEl = this.addStatusBarItem();
    this.alarmEl.addClass("status-bar-alarm");
    this.alarmEl.style.cursor = "pointer";
    this.alarmEl.addEventListener("click", () => {
      this.app.setting.open();
      this.app.setting.openTabById("status-bar-clock");
    });
    this.alarmFiredMinuteKeys = new Set();
    this.lastAlarmMinute = "";
    this.activeAlarmNotices = [];
    this.renderAlarmStatus();
    this.applyAlarmVisibility();
    this.alarmTickInterval = window.setInterval(() => this.tickAlarms(), 1000);
    this.alarmDisplayInterval = window.setInterval(
      () => this.renderAlarmStatus(),
      30000
    );

    this.statusBarItem = this.addStatusBarItem();
    this.statusBarItem.addClass("status-bar-clock");
    this.updateClock();
    this.applyClockVisibility();
    this.clockInterval = window.setInterval(() => this.updateClock(), 1000);

    this.addCommand({
      id: "timer-add",
      name: "Add timer",
      callback: () => this.promptAndStart(),
    });
    this.addCommand({
      id: "timer-list",
      name: "View active timers",
      callback: () => this.openTimersListModal(),
    });
    this.addCommand({
      id: "timer-pause-resume",
      name: "Pause / resume primary timer",
      callback: () => this.toggleSimplePauseResume(),
    });
    this.addCommand({
      id: "timer-reset",
      name: "Clear all timers",
      callback: () => this.clearAllTimers(),
    });
    this.addCommand({
      id: "alarm-add",
      name: "Add alarm",
      callback: () => this.openAddAlarmModal(),
    });
  }

  onunload() {
    window.clearInterval(this.clockInterval);
    window.clearInterval(this.timerInterval);
    window.clearInterval(this.alarmTickInterval);
    window.clearInterval(this.alarmDisplayInterval);
    this.stopAudio();
    this.styleEl?.remove();
  }

  injectStyles() {
    const id = "sbc-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = [
      ".status-bar-timer.is-paused { opacity: 0.55; }",
      ".status-bar-timer.is-alarming { color: var(--text-error); }",
      ".status-bar-timer.is-alarming.is-pulsing { animation: sbc-pulse 2s ease-in-out infinite; }",
      ".status-bar-alarm.is-alarming { color: var(--text-error); }",
      ".status-bar-alarm.is-alarming.is-pulsing { animation: sbc-pulse 2s ease-in-out infinite; }",
      "@keyframes sbc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.65; } }",
      ".sbc-ribbon-hidden.sbc-ribbon-hidden { display: none !important; }",
      ".sbc-timer-hidden.sbc-timer-hidden { display: none !important; }",
      ".sbc-alarm-hidden.sbc-alarm-hidden { display: none !important; }",
      ".sbc-clock-hidden.sbc-clock-hidden { display: none !important; }",
      ".sbc-grouped .setting-item-heading { background: transparent; border: none; padding: 0 0 6px 0; margin-top: 24px; }",
      ".sbc-grouped .setting-item-heading:first-child { margin-top: 8px; }",
      ".sbc-grouped .setting-item-heading .setting-item-name { font-size: var(--font-ui-medium); font-weight: 600; }",
      ".sbc-group { background: var(--background-secondary); border-radius: 8px; overflow: hidden; margin: 0 0 8px 0; }",
      ".sbc-group .setting-item { background: transparent !important; border: none !important; padding: 14px 18px; margin: 0; }",
      ".sbc-group .setting-item + .setting-item { border-top: 1px solid var(--background-modifier-border) !important; }",
      ".sbc-add-alarm-row { display: flex; justify-content: center; margin: 8px 0 12px 0; }",
      ".sbc-alarm-list { display: flex; flex-direction: column; gap: 8px; margin: 0 0 16px 0; }",
      ".sbc-alarm-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; padding: 10px 14px; background: var(--background-secondary); border-radius: 8px; }",
    ].join("\n");
    document.head.appendChild(style);
    this.styleEl = style;
  }

  updateRibbonVisibility() {
    const s = this.settings;
    const timerAddVisible = s.timerEnabled && s.showTimerAddRibbonButton;
    const timerListVisible = s.timerEnabled && s.showTimerListRibbonButton;
    const alarmListVisible = s.alarmsEnabled && s.showAlarmListRibbonButton;
    const alarmAddVisible = s.alarmsEnabled && s.showAlarmAddRibbonButton;
    if (this.flaskRibbonEl)
      this.flaskRibbonEl.classList.toggle(
        "sbc-ribbon-hidden",
        !s.showFlaskButton
      );
    if (this.timerAddRibbonEl)
      this.timerAddRibbonEl.classList.toggle(
        "sbc-ribbon-hidden",
        !timerAddVisible
      );
    if (this.timerListRibbonEl)
      this.timerListRibbonEl.classList.toggle(
        "sbc-ribbon-hidden",
        !timerListVisible
      );
    if (this.alarmListRibbonEl)
      this.alarmListRibbonEl.classList.toggle(
        "sbc-ribbon-hidden",
        !alarmListVisible
      );
    if (this.alarmAddRibbonEl)
      this.alarmAddRibbonEl.classList.toggle(
        "sbc-ribbon-hidden",
        !alarmAddVisible
      );
  }

  applyTimerVisibility() {
    if (this.timerEl) {
      const hidden =
        !this.settings.timerEnabled || !this.settings.timerShowInStatusBar;
      this.timerEl.classList.toggle("sbc-timer-hidden", hidden);
    }
  }

  applyClockVisibility() {
    if (this.statusBarItem)
      this.statusBarItem.classList.toggle(
        "sbc-clock-hidden",
        !this.settings.clockEnabled
      );
  }

  applyAlarmVisibility() {
    if (!this.alarmEl) return;
    const hidden =
      !this.settings.alarmsEnabled || !this.settings.alarmShowInStatusBar;
    this.alarmEl.classList.toggle("sbc-alarm-hidden", hidden);
  }

  repositionRibbonIcons() {
    const sidebarEl =
      this.app.workspace?.containerEl?.querySelector?.(".side-dock-actions");
    if (!sidebarEl) return false;
    const anchor = sidebarEl.lastElementChild;
    if (!anchor) return false;
    if (this.timerAddRibbonEl)
      sidebarEl.insertBefore(this.timerAddRibbonEl, anchor);
    if (this.timerListRibbonEl)
      sidebarEl.insertBefore(this.timerListRibbonEl, anchor);
    if (this.alarmListRibbonEl)
      sidebarEl.insertBefore(this.alarmListRibbonEl, anchor);
    if (this.alarmAddRibbonEl)
      sidebarEl.insertBefore(this.alarmAddRibbonEl, anchor);
    if (this.flaskRibbonEl) sidebarEl.insertBefore(this.flaskRibbonEl, anchor);
    return true;
  }

  updateClock() {
    const { format, prefix } = this.settings;
    const time = formatTime(format, new Date());
    this.statusBarItem.setText(`${prefix}${time}`);
  }

  formatTimerValue(seconds, initialSeconds) {
    if (this.settings.timerFormatType === "duration") {
      return formatTimerDuration(
        seconds,
        this.settings.timerDurationLeadingZeros,
        initialSeconds || seconds
      );
    }
    return formatTimerClock(this.settings.timerClockFormat || "mm:ss", seconds);
  }

  primaryTimer() {
    const ts = this.timers;
    if (ts.length === 0) return null;
    const alarming = ts.find((t) => t.mode === "alarming");
    if (alarming) return alarming;
    const running = ts
      .filter((t) => t.mode === "running")
      .sort((a, b) => a.remainingMs - b.remainingMs)[0];
    if (running) return running;
    return (
      ts
        .filter((t) => t.mode === "paused")
        .sort((a, b) => a.remainingMs - b.remainingMs)[0] || null
    );
  }

  renderTimer() {
    if (!this.timerEl) return;
    const primary = this.primaryTimer();
    const defaultName = (this.settings.timerDefaultName || "").trim();
    if (!primary) {
      this.timerEl.toggleClass("is-paused", false);
      this.timerEl.toggleClass("is-alarming", false);
      this.timerEl.toggleClass("is-pulsing", false);
      this.timerEl.setText(defaultName ? `⏱ ${defaultName}` : "⏱");
      this.timerEl.setAttr("aria-label", "Click to add a timer");
      return;
    }
    const seconds = Math.max(0, Math.ceil(primary.remainingMs / 1000));
    const formatted = this.formatTimerValue(seconds, primary.initialSeconds);
    const name = (primary.name || "").trim();
    const count = this.timers.length;
    const suffix = count > 1 ? ` +${count - 1}` : "";
    this.timerEl.setText(
      name ? `⏱ ${name} ${formatted}${suffix}` : `⏱ ${formatted}${suffix}`
    );
    this.timerEl.toggleClass("is-paused", primary.mode === "paused");
    this.timerEl.toggleClass("is-alarming", primary.mode === "alarming");
    this.timerEl.toggleClass(
      "is-pulsing",
      primary.mode === "alarming" && !!this.settings.timerNotificationPulse
    );
    this.timerEl.setAttr(
      "aria-label",
      `${count} active timer${count > 1 ? "s" : ""} · click to manage`
    );
  }

  tickTimer() {
    if (this.timers.length === 0) return;
    const now = Date.now();
    let mutated = false;
    for (const t of this.timers) {
      if (t.mode !== "running") continue;
      const elapsed = now - t.lastTickAt;
      t.lastTickAt = now;
      t.remainingMs -= elapsed;
      if (t.remainingMs <= 0) {
        t.remainingMs = 0;
        t.mode = "alarming";
        this.fireTimerExpiry(t);
      }
      mutated = true;
    }
    if (mutated) {
      this.renderTimer();
      this.listModal?.refresh?.();
    }
  }

  handleTimerClick() {
    if (!this.settings.timerEnabled) {
      new obsidian.Notice("Timer is disabled in settings.");
      return;
    }
    if (this.timers.length === 0) this.promptAndStart();
    else this.openTimersListModal();
  }

  openTimersListModal() {
    if (!this.settings.timerEnabled) {
      new obsidian.Notice("Timer is disabled in settings.");
      return;
    }
    new TimersListModal(this.app, this).open();
  }

  promptAndStart() {
    if (!this.settings.timerEnabled) {
      new obsidian.Notice("Timer is disabled in settings.");
      return;
    }
    const defaultDuration = this.settings.timerDefaultDuration || "5m";
    const defaultName = (this.settings.timerDefaultName || "").trim();
    new DurationModal(
      this.app,
      defaultDuration,
      async (seconds, rawValue, name) => {
        this.settings.timerDefaultDuration = rawValue;
        await this.saveSettings();
        this.addTimer(seconds, name);
      },
      defaultName
    ).open();
  }

  addTimer(seconds, name) {
    this.timers.push({
      id: makeTimerId(),
      name: name || "",
      initialSeconds: seconds,
      remainingMs: seconds * 1000,
      mode: "running",
      lastTickAt: Date.now(),
    });
    this.renderTimer();
    this.listModal?.refresh?.();
  }

  pauseTimerById(id) {
    const t = this.timers.find((x) => x.id === id);
    if (!t || t.mode !== "running") return;
    t.mode = "paused";
    this.renderTimer();
    this.listModal?.refresh?.();
  }

  resumeTimerById(id) {
    const t = this.timers.find((x) => x.id === id);
    if (!t || t.mode !== "paused") return;
    t.mode = "running";
    t.lastTickAt = Date.now();
    this.renderTimer();
    this.listModal?.refresh?.();
  }

  dismissTimerById(id) {
    const t = this.timers.find((x) => x.id === id);
    if (!t) return;
    const notice = this.activeTimerNotices.get(id);
    if (notice) {
      try {
        notice.hide();
      } catch {}
      this.activeTimerNotices.delete(id);
    }
    this.timers = this.timers.filter((x) => x.id !== id);
    if (!this.timers.some((x) => x.mode === "alarming")) this.stopAudio();
    this.renderTimer();
    this.listModal?.refresh?.();
  }

  removeTimerById(id) {
    this.dismissTimerById(id);
  }

  toggleSimplePauseResume() {
    const primary = this.primaryTimer();
    if (!primary) return;
    if (primary.mode === "running") this.pauseTimerById(primary.id);
    else if (primary.mode === "paused") this.resumeTimerById(primary.id);
  }

  clearAllTimers() {
    for (const n of this.activeTimerNotices.values()) {
      try {
        n.hide();
      } catch {}
    }
    this.activeTimerNotices.clear();
    this.timers = [];
    this.stopAudio();
    this.renderTimer();
    this.listModal?.refresh?.();
  }

  fireTimerExpiry(timer) {
    const name = (timer.name || "").trim();
    const label = name ? `${name} finished` : "Timer finished";
    if (this.settings.timerNotificationAudio) this.startAudio();
    if (this.settings.timerNotificationNotice) {
      const notice = new obsidian.Notice(`⏱ ${label}`, 0);
      this.activeTimerNotices.set(timer.id, notice);
    }
    if (this.settings.timerNotificationModal) {
      new NotificationModal(
        this.app,
        () => this.dismissTimerById(timer.id),
        label,
        "⏱"
      ).open();
    }
  }

  openAddAlarmModal(onSaved) {
    new AddAlarmModal(this.app, async (alarm) => {
      this.settings.alarms.push(alarm);
      await this.saveSettings();
      this.renderAlarmStatus();
      if (onSaved) onSaved();
    }).open();
  }

  renderAlarmStatus() {
    if (!this.alarmEl) return;
    const mode = this.settings.alarmStatusDisplay;
    const now = new Date();
    const next = pickNextAlarm(now, this.settings.alarms);
    let text = "⏰";
    if (next) {
      const t = next.time;
      const timeStr = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`;
      const name = (next.alarm.name || "").trim();
      if (mode === "next-time") text = `⏰ ${timeStr}`;
      else if (mode === "next-time-name")
        text = name ? `⏰ ${name} ${timeStr}` : `⏰ ${timeStr}`;
    }
    this.alarmEl.setText(text);
    const summary = next
      ? `Next alarm: ${next.alarm.name || "unnamed"} at ${String(next.time.getHours()).padStart(2, "0")}:${String(next.time.getMinutes()).padStart(2, "0")}`
      : "No upcoming alarms";
    this.alarmEl.setAttr("aria-label", summary);
  }

  tickAlarms() {
    if (!this.settings.alarmsEnabled) return;
    const now = new Date();
    const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
    if (minuteKey !== this.lastAlarmMinute) {
      this.lastAlarmMinute = minuteKey;
      this.alarmFiredMinuteKeys = new Set();
      this.renderAlarmStatus();
    }
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const todayIdx = monFirstDayIndex(now);
    for (const alarm of this.settings.alarms) {
      if (!alarm.enabled) continue;
      if (!alarm.days[todayIdx]) continue;
      if (alarm.time !== timeStr) continue;
      const firedKey = `${alarm.id}:${minuteKey}`;
      if (this.alarmFiredMinuteKeys.has(firedKey)) continue;
      this.alarmFiredMinuteKeys.add(firedKey);
      this.fireAlarm(alarm);
    }
  }

  fireAlarm(alarm) {
    const label = (alarm.name || "").trim() || `Alarm ${alarm.time}`;
    if (this.settings.alarmNotificationAudio) this.startAudio();
    if (this.settings.alarmNotificationNotice) {
      const notice = new obsidian.Notice(`⏰ ${label}`, 0);
      this.activeAlarmNotices.push(notice);
    }
    if (this.settings.alarmNotificationModal) {
      new NotificationModal(
        this.app,
        () => this.clearAlarmFiringState(),
        label,
        "⏰"
      ).open();
    }
    if (this.alarmEl && this.settings.alarmNotificationPulse) {
      this.alarmEl.classList.add("is-alarming", "is-pulsing");
      window.setTimeout(() => this.clearAlarmFiringState(), 60000);
    }
  }

  clearAlarmFiringState() {
    if (this.alarmEl)
      this.alarmEl.classList.remove("is-alarming", "is-pulsing");
    for (const n of this.activeAlarmNotices) {
      try {
        n.hide();
      } catch {}
    }
    this.activeAlarmNotices = [];
    if (this.timers.every((t) => t.mode !== "alarming")) this.stopAudio();
  }

  startAudio() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      this.audioCtx = ctx;
      const beep = (delaySec, durationSec, freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const t0 = ctx.currentTime + delaySec;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
        gain.gain.linearRampToValueAtTime(0, t0 + durationSec);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + durationSec + 0.05);
      };
      beep(0.0, 0.18, 880);
      beep(0.3, 0.18, 880);
      beep(0.6, 0.18, 880);
    } catch (e) {
      console.error("status-bar-clock: audio failed", e);
    }
  }

  stopAudio() {
    try {
      this.audioCtx?.close();
    } catch {}
    this.audioCtx = null;
  }

  async loadSettings() {
    const raw = (await this.loadData()) || {};
    for (const [oldKey, newKey] of Object.entries(LEGACY_KEY_MAP)) {
      if (raw[oldKey] !== undefined && raw[newKey] === undefined) {
        raw[newKey] = raw[oldKey];
      }
      delete raw[oldKey];
    }
    this.settings = Object.assign({}, DEFAULT_SETTINGS, raw);
    if (this.settings.alarmStatusDisplay === "hidden") {
      this.settings.alarmStatusDisplay = "next-time";
      this.settings.alarmShowInStatusBar = false;
    }
    if (!Array.isArray(this.settings.alarms)) this.settings.alarms = [];
    this.settings.alarms = this.settings.alarms.map((a) => ({
      id: a && typeof a.id === "string" ? a.id : makeAlarmId(),
      name: a && typeof a.name === "string" ? a.name : "",
      time: a && typeof a.time === "string" ? a.time : "08:00",
      days:
        a && Array.isArray(a.days) && a.days.length === 7
          ? a.days.map((d) => !!d)
          : DEFAULT_ALARM_DAYS.slice(),
      enabled: !(a && a.enabled === false),
    }));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

module.exports = StatusBarClockPlugin;

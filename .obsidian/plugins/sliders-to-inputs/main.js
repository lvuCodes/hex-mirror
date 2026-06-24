const { Plugin, Setting } = require("obsidian");

class NumberInputComponent {
    constructor(containerEl) {
        this.sliderEl = containerEl.createEl("input");
        this.sliderEl.type = "number";
        this.sliderEl.style.width = "65px";
        this.sliderEl.style.textAlign = "right";
    }

    getValue() {
        return parseFloat(this.sliderEl.value) || 0;
    }

    setValue(value) {
        this.sliderEl.value = String(value);
        return this;
    }

    setLimits(min, max, step) {
        this.sliderEl.min = String(min);
        this.sliderEl.max = String(max);
        this.sliderEl.step = step === "any" ? "any" : String(step);
        return this;
    }

    setDynamicTooltip() {
        return this;
    }

    onChange(callback) {
        this.sliderEl.addEventListener("change", () => {
            let val = parseFloat(this.sliderEl.value);
            const min = parseFloat(this.sliderEl.min);
            const max = parseFloat(this.sliderEl.max);
            if (!isNaN(min)) val = Math.max(min, val);
            if (!isNaN(max)) val = Math.min(max, val);
            this.sliderEl.value = String(val);
            callback(val);
        });
        return this;
    }

    then(cb) {
        cb(this);
        return this;
    }
}

module.exports = class SlidersToInputsPlugin extends Plugin {
    onload() {
        this._origAddSlider = Setting.prototype.addSlider;
        Setting.prototype.addSlider = function (cb) {
            const component = new NumberInputComponent(this.controlEl);
            cb(component);
            return this;
        };
    }

    onunload() {
        Setting.prototype.addSlider = this._origAddSlider;
    }
};

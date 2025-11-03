import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { assert } from "superstruct";
import { LovelaceCardEditor, fireEvent } from "../../ha";
import setupCustomlocalize from "../../localize";
import { computeActionsFormSchema } from "../../shared/config/actions-config";
import { APPEARANCE_FORM_SCHEMA } from "../../shared/config/appearance-config";
import { MushroomBaseElement } from "../../utils/base-element";
import { GENERIC_LABELS } from "../../utils/form/generic-fields";
import { HaFormSchema } from "../../utils/form/ha-form";
import { loadHaComponents } from "../../utils/loader";
import { LIGHT_CARD_EDITOR_NAME, LIGHT_ENTITY_DOMAINS } from "./const";
import { LightCardConfig, lightCardConfigStruct } from "./light-card-config";

export const LIGHT_LABELS = [
  "show_brightness_control",
  "use_light_color",
  "show_color_temp_control",
  "show_color_control",
  "show_preset_control",
  "brightness_step_size",
  "color_temp_step_size",
  "brightness_control_icon",
  "preset_control_icon",
  "preset_button_1_icon",
  "preset_button_1_entity",
  "preset_button_2_icon", 
  "preset_button_2_entity",
  "preset_button_3_icon",
  "preset_button_3_entity",
];

const SCHEMA: HaFormSchema[] = [
  { name: "entity", selector: { entity: { domain: LIGHT_ENTITY_DOMAINS } } },
  { name: "name", selector: { text: {} } },
  {
    type: "grid",
    name: "",
    schema: [
      {
        name: "icon",
        selector: { icon: {} },
        context: { icon_entity: "entity" },
      },
      { name: "icon_color", selector: { mush_color: {} } },
    ],
  },
  ...APPEARANCE_FORM_SCHEMA,
  {
    type: "grid",
    name: "",
    schema: [
      { name: "use_light_color", selector: { boolean: {} } },
      { name: "show_brightness_control", selector: { boolean: {} } },
      { name: "show_color_temp_control", selector: { boolean: {} } },
      { name: "show_color_control", selector: { boolean: {} } },
      { name: "show_preset_control", selector: { boolean: {} } },
      { name: "collapsible_controls", selector: { boolean: {} } },
    ],
  },
  { name: "brightness_step_size", selector: { number: { min: 1, max: 100, mode: "box" } } },
  { name: "color_temp_step_size", selector: { number: { min: 1, max: 100, mode: "box" } } },
  { name: "brightness_control_icon", selector: { icon: {} } },
  { name: "preset_control_icon", selector: { icon: {} } },
  { name: "preset_button_1_icon", selector: { icon: {} } },
  { name: "preset_button_1_entity", selector: { entity: { domain: "switch" } } },
  { name: "preset_button_2_icon", selector: { icon: {} } },
  { name: "preset_button_2_entity", selector: { entity: { domain: "switch" } } },
  { name: "preset_button_3_icon", selector: { icon: {} } },
  { name: "preset_button_3_entity", selector: { entity: { domain: "switch" } } },
  ...computeActionsFormSchema(),
];

@customElement(LIGHT_CARD_EDITOR_NAME)
export class LightCardEditor
  extends MushroomBaseElement
  implements LovelaceCardEditor
{
  @state() private _config?: LightCardConfig;

  connectedCallback() {
    super.connectedCallback();
    void loadHaComponents();
  }

  public setConfig(config: LightCardConfig): void {
    assert(config, lightCardConfigStruct);
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    const customLocalize = setupCustomlocalize(this.hass!);

    if (GENERIC_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.generic.${schema.name}`);
    }
    if (LIGHT_LABELS.includes(schema.name)) {
      return customLocalize(`editor.card.light.${schema.name}`);
    }
    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }
}

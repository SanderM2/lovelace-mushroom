import { assign, boolean, number, object, optional, string } from "superstruct";
import { ActionConfig, actionConfigStruct, LovelaceCardConfig } from "../../ha";
import {
  ActionsSharedConfig,
  actionsSharedConfigStruct,
} from "../../shared/config/actions-config";
import {
  AppearanceSharedConfig,
  appearanceSharedConfigStruct,
} from "../../shared/config/appearance-config";
import {
  EntitySharedConfig,
  entitySharedConfigStruct,
} from "../../shared/config/entity-config";
import { lovelaceCardConfigStruct } from "../../shared/config/lovelace-card-config";

export type LightCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    icon_tap_action?: ActionConfig;
    icon_hold_action?: ActionConfig;
    icon_double_tap_action?: ActionConfig;
    icon_color?: string;
    show_brightness_control?: boolean;
    show_color_temp_control?: boolean;
    show_color_control?: boolean;
    show_preset_control?: boolean;
    collapsible_controls?: boolean;
    use_light_color?: boolean;
    brightness_step_size?: number;
    color_temp_step_size?: number;
    brightness_control_icon?: string;
    preset_control_icon?: string;
    preset_button_1_icon?: string;
    preset_button_1_entity?: string;
    preset_button_2_icon?: string;
    preset_button_2_entity?: string;
    preset_button_3_icon?: string;
    preset_button_3_entity?: string;
  };

export const lightCardConfigStruct = assign(
  lovelaceCardConfigStruct,
  assign(
    entitySharedConfigStruct,
    appearanceSharedConfigStruct,
    actionsSharedConfigStruct
  ),
  object({
    icon_tap_action: optional(actionConfigStruct),
    icon_hold_action: optional(actionConfigStruct),
    icon_double_tap_action: optional(actionConfigStruct),
    icon_color: optional(string()),
    show_brightness_control: optional(boolean()),
    show_color_temp_control: optional(boolean()),
    show_color_control: optional(boolean()),
    show_preset_control: optional(boolean()),
    collapsible_controls: optional(boolean()),
    use_light_color: optional(boolean()),
    brightness_step_size: optional(number()),
    color_temp_step_size: optional(number()),
    brightness_control_icon: optional(string()),
    preset_control_icon: optional(string()),
    preset_button_1_icon: optional(string()),
    preset_button_1_entity: optional(string()),
    preset_button_2_icon: optional(string()),
    preset_button_2_entity: optional(string()),
    preset_button_3_icon: optional(string()),
    preset_button_3_entity: optional(string()),
  })
);

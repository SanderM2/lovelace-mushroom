import { assign, boolean, number, object, optional, string } from "superstruct";
import {
  actionsSharedConfigStruct,
  ActionsSharedConfig,
} from "../../shared/config/actions-config";
import {
  appearanceSharedConfigStruct,
  AppearanceSharedConfig,
} from "../../shared/config/appearance-config";
import {
  entitySharedConfigStruct,
  EntitySharedConfig,
} from "../../shared/config/entity-config";
import { lovelaceCardConfigStruct } from "../../shared/config/lovelace-card-config";
import { LovelaceCardConfig } from "../../ha";

export type CoverCardConfig = LovelaceCardConfig &
  EntitySharedConfig &
  AppearanceSharedConfig &
  ActionsSharedConfig & {
    show_buttons_control?: false;
    show_position_control?: false;
    show_tilt_position_control?: false;
    show_tilt_preset_control?: false;
    invert_position_slider?: boolean;
    position_step_size?: number;
    tilt_step_size?: number;
    tilt_preset_button_1_icon?: string;
    tilt_preset_button_1_entity?: string;
    tilt_preset_button_2_icon?: string;
    tilt_preset_button_2_entity?: string;
    tilt_preset_button_3_icon?: string;
    tilt_preset_button_3_entity?: string;
  };

export const coverCardConfigStruct = assign(
  lovelaceCardConfigStruct,
  assign(
    entitySharedConfigStruct,
    appearanceSharedConfigStruct,
    actionsSharedConfigStruct
  ),
  object({
    show_buttons_control: optional(boolean()),
    show_position_control: optional(boolean()),
    show_tilt_position_control: optional(boolean()),
    show_tilt_preset_control: optional(boolean()),
    invert_position_slider: optional(boolean()),
    position_step_size: optional(number()),
    tilt_step_size: optional(number()),
    tilt_preset_button_1_icon: optional(string()),
    tilt_preset_button_1_entity: optional(string()),
    tilt_preset_button_2_icon: optional(string()),
    tilt_preset_button_2_entity: optional(string()),
    tilt_preset_button_3_icon: optional(string()),
    tilt_preset_button_3_entity: optional(string()),
  })
);

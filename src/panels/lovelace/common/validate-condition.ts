import { HomeAssistant } from "../../../types";

export interface Condition {
  entity: string;
  state?: string;
  state_not?: string;
}

export function checkConditionsMet(
  conditions: Condition[],
  hass: HomeAssistant
): boolean {
  return conditions.every((c) => {
    if (!(c.entity in hass.states)) {
      return false;
    }
    if (c.state) {
      return hass.states[c.entity].state === c.state;
    }

    if (c.attribute || c.attribute_not) {
      return Object.entries(c.attribute || c.attribute_not).every(([attribute, value]) => {
        const attributeValue = hass.states[c.entity].attributes[attribute]
        if (c.attribute) return value === attributeValue
        if (c.attribute_not) return value !== attributeValue
      })
    }

    return hass!.states[c.entity].state !== c.state_not;
  });
}

export function validateConditionalConfig(conditions: Condition[]): boolean {
  return conditions.every(
    (c) => ((c.entity && (c.state || c.state_not)) as unknown) as boolean
  );
}

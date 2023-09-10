<template>
  <div
    ref="shop"
    hidden
    :data-config-load-css="false"
    id="snipcart"
    :data-api-key="props.snipcartKey"
    data-config-modal-style="side"
  ></div>
  <link ref="style" type="text/css" rel="stylesheet" :href="styleSrc" />
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { usePointer } from "@vueuse/core";
const shop = ref(null);
const scripLoaded = ref(false);
const pointer = usePointer();
const styleSrc = ref("");
const count = ref(0);

const props = defineProps({
  snipcartKey: String,
});

const stop = watchEffect(() => {
  count.value++;

  if (
    (count.value > 1 && pointer.y.value) ||
    pointer.x.value ||
    pointer.isInside.value ||
    pointer.pointerType.value ||
    pointer.pressure.value ||
    pointer.tiltX.value ||
    pointer.twist.value ||
    pointer.width.value ||
    pointer.pointerId.value ||
    pointer.tiltY.value
  ) {
    LoadJS();
    loadCSS();
    scripLoaded.value = true;
    stop();
  }
});

function LoadJS() {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://cdn.snipcart.com/themes/v3.7.1/default/snipcart.js";
  if (!scripLoaded.value) {
    document.head.appendChild(script);
  }
}

function loadCSS() {
  if (!scripLoaded.value) {
    styleSrc.value = "/snipcart.css";
  }
}

onMounted(() => {
  if (!window.Snipcart) {
    setTimeout(() => {
      LoadJS();
      loadCSS();
      scripLoaded.value = true;
    }, 2500);
  }
});
</script>

<style is:global>
#snipcart {
  /* ----------------- 
        Colors
    ----------------- */
  --color-default: theme(colors.dark);
  --color-alt: theme(colors.gray.400);
  --color-icon: theme(colors.primary);
  --color-success: theme(colors.success);
  --color-error: theme(colors.danger);

  --color-link: theme(colors.primary);
  --color-link-hover: theme(colors.accent);
  --color-link-active: var(--color-link);
  --color-link-focus: var(--color-link);

  --color-input: var(--color-default);
  --color-input-hover: var(--color-input);
  --color-input-focus: var(--color-input);
  --color-input-checked: var(--color-input);
  --color-input-disabled: var(--color-alt);
  --color-input-error: var(--color-error);
  --color-inputLabel: var(--color-default);
  --color-inputLabel-hover: var(--color-inputLabel);
  --color-inputLabel-focus: var(--color-inputLabel);
  --color-inputIcon: var(--color-alt);
  --color-inputIcon-hover: var(--color-default);
  --color-inputIcon-focus: var(--color-inputIcon);
  --color-inputIcon-checked: var(--color-default);
  --color-inputIcon-error: var(--color-error);
  --color-inputPlaceholder: var(--color-alt);

  --color-buttonPrimary: theme(colors.light);
  --color-buttonPrimary-hover: var(--color-primary);
  --color-buttonPrimary-active: var(--color-buttonPrimary);
  --color-buttonPrimary-focus: var(--color-buttonPrimary);
  --color-buttonPrimary-disabled: var(--color-alt);
  --color-buttonPrimary-success: var(--color-buttonPrimary);
  --color-buttonPrimary-error: var(--color-buttonPrimary);

  --color-buttonSecondary: theme(colors.primary);
  --color-buttonSecondary-hover: theme(colors.white);
  --color-buttonSecondary-active: var(--color-buttonSecondary);
  --color-buttonSecondary-focus: var(--color-buttonSecondary);
  --color-buttonSecondary-disabled: theme(colors.gray.500);
  --color-buttonSecondary-success: var(--color-success);
  --color-buttonSecondary-error: var(--color-error);

  --color-buttonDanger: var(--color-error);
  --color-buttonDanger-hover: theme(colors.white);
  --color-buttonDanger-active: var(--color-buttonDanger);
  --color-buttonDanger-focus: var(--color-buttonDanger);
  --color-buttonDanger-disabled: hsl(210, 10%, 25%);
  --color-buttonDanger-success: var(--color-default);
  --color-buttonDanger-error: var(--color-default);

  --color-badge: theme(colors.white);
  --color-badge-active: theme(colors.white);
  --color-badge-disabled: theme(colors.gray.300);

  /* ----------------- 
        Border colors
    ----------------- */
  --borderColor-default: hsla(0, 0%, 100%, 10%);
  --borderColor-error: theme(colors.danger) --borderColor-link: currentColor;
  --borderColor-link-hover: currentColor;
  --borderColor-link-active: currentColor;
  --borderColor-link-focus: currentColor;

  --borderColor-input: hsla(0, 0%, 100%, 10%);
  --borderColor-input-hover: hsl(200, 90%, 40%);
  --borderColor-input-focus: var(--borderColor-input-hover);
  --borderColor-input-checked: var(--borderColor-input-hover);
  --borderColor-input-disabled: hsl(210, 10%, 20%);
  --borderColor-input-error: var(--borderColor-error);

  --borderColor-buttonPrimary: transparent;
  --borderColor-buttonPrimary-hover: transparent;
  --borderColor-buttonPrimary-focus: transparent;
  --borderColor-buttonPrimary-disabled: transparent;
  --borderColor-buttonPrimary-success: transparent;
  --borderColor-buttonPrimary-error: transparent;

  --borderColor-buttonSecondary: transparent;
  --borderColor-buttonSecondary-hover: transparent;
  --borderColor-buttonSecondary-focus: transparent;
  --borderColor-buttonSecondary-disabled: transparent;
  --borderColor-buttonSecondary-success: transparent;
  --borderColor-buttonSecondary-error: transparent;

  --borderColor-badge: transparent;
  --borderColor-badge-active: transparent;
  --borderColor-badge-disabled: transparent;

  /* ----------------- 
        Background colors
    ----------------- */
  --bgColor-default: theme(colors.white);
  --bgColor-alt: theme(colors.light);
  --bgColor-success: theme(colors.gray.200);
  --bgColor-error: theme(colors.gray.200);
  --bgColor-info: theme(colors.gray.200);

  --bgColor-modal: theme(colors.light);
  --bgColor-modalVeil: hsla(210, 10%, 7%, 0.25);

  --bgColor-link: none;
  --bgColor-link-hover: none;
  --bgColor-link-active: none;
  --bgColor-link-focus: hsl(209, 69%, 49%);

  --bgColor-input: theme(colors.light);
  --bgColor-input-hover: var(--bgColor-input);
  --bgColor-input-focus: var(--bgColor-input);
  --bgColor-input-checked: var(--borderColor-input-hover);
  --bgColor-input-disabled: theme(colors.gray.200);
  --bgColor-input-error: var(--bgColor-input);
  --bgColor-input-autofill: theme(colors.light);

  --bgColor-buttonPrimary: theme(colors.primary);
  --bgColor-buttonPrimary-hover: theme(colors.white);
  --bgColor-buttonPrimary-active: var(--bgColor-buttonPrimary);
  --bgColor-buttonPrimary-focus: var(--bgColor-buttonPrimary);
  --bgColor-buttonPrimary-disabled: theme(colors.gray.400);
  --bgColor-buttonPrimary-success: theme(colors.success);
  --bgColor-buttonPrimary-error: theme(colors.danger);

  --bgColor-buttonSecondary: theme(colors.white);
  --bgColor-buttonSecondary-hover: theme(colors.primary);
  --bgColor-buttonSecondary-active: var(--bgColor-buttonSecondary);
  --bgColor-buttonSecondary-focus: var(--bgColor-buttonSecondary);
  --bgColor-buttonSecondary-disabled: theme(colors.gray.300);
  --bgColor-buttonSecondary-success: var(--bgColor-success);
  --bgColor-buttonSecondary-error: var(--bgColor-error);

  --bgColor-buttonDanger: var(--bgColor-error);
  --bgColor-buttonDanger-hover: var(--color-error);
  --bgColor-buttonDanger-active: var(--bgColor-buttonDanger);
  --bgColor-buttonDanger-focus: var(--bgColor-buttonDanger);
  --bgColor-buttonDanger-disabled: hsl(210, 10%, 9%);
  --bgColor-buttonDanger-success: hsl(144, 66%, 30%);
  --bgColor-buttonDanger-error: hsl(6, 60%, 35%);

  --bgColor-badge: theme(colors.accent);
  --bgColor-badge-active: theme(colors.secondary);
  --bgColor-badge-disabled: theme(colors.accent);

  /* ----------------- 
        Shadows
    ----------------- */

  --shadow-default: 0px 20px 24px -20px hsla(0, 0%, 0%, 0.5);
  --shadow-tooltip: 0px 8px 16px hsla(220, 70%, 22%, 0.5);

  --shadow-link-focus: 0px 6px 4px -3px hsla(200, 90%, 40%, 0.5);

  --shadow-input-hover: none;
  --shadow-input-focus: 0px 5px 10px -3px hsla(200, 90%, 40%, 0.3);
  --shadow-input-checked: none;

  --shadow-buttonPrimary-hover: 0px 10px 4px -8px hsla(0, 0%, 0%, 0.5);
  --shadow-buttonPrimary-active: none;
  --shadow-buttonPrimary-focus: 0px 0px 6px 2px hsl(200, 90%, 40%);

  --shadow-buttonSecondary-hover: 0px 10px 4px -8px hsla(0, 0%, 0%, 0.2);
  --shadow-buttonSecondary-active: none;
  --shadow-buttonSecondary-focus: 0px 0px 6px 2px hsla(200, 90%, 40%, 0.8);

  --shadow-buttonDanger-hover: 0px 10px 4px -8px hsla(0, 0%, 0%, 0.25);
  --shadow-buttonDanger-active: none;
  --shadow-buttonDanger-focus: 0px 0px 6px 2px hsla(6, 55%, 60%);

  z-index: 9999;
  position: absolute;
}
</style>

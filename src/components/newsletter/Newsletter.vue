<template>
  <form
    name="newsletter-subscribes"
    class="relative inline-flex items-center gap-4 py-4"
    @submit.prevent="submit"
  >
    <input
      type="email"
      :placeholder="t('email')"
      v-model="form.email"
      class="relative block overflow-hidden rounded-full bg-dark px-5 py-2"
      :class="errorFields?.email?.length ? 'text-warning' : 'text-light'"
    />
    <button
      type="submit"
      :disabled="!canSubmit"
      class="btn"
      :class="canSubmit ? 'surface-primary' : 'surface-base opacity-50'"
    >
      {{ t("subscribe") }}
    </button>
    <Loading :loading="loading" />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { t } from "@util/translate";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import Loading from "@components/common/Loading.vue";
import { toast } from "vue3-toastify";
import { actions } from "astro:actions";

onMounted(async () => {
  if (document.getElementById("toastify-css")) return;
  const cssUrl = (await import("vue3-toastify/dist/index.css?url")).default;
  const link = document.createElement("link");
  link.id = "toastify-css";
  link.rel = "stylesheet";
  link.href = cssUrl;
  document.head.appendChild(link);
});

const props = withDefaults(
  defineProps<{
    type?: string;
    list_id?: string;
  }>(),
  {
    type: "mailchimp",
  },
);
const loading = ref(false);
const form = reactive({ email: "" });
const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
};
const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);
const canSubmit = computed(() => {
  return !loading.value && isFinished.value && pass.value;
});

const submit = async () => {
  if (props.type !== "mailchimp" || !canSubmit.value) return;

  loading.value = true;
  try {
    const { data, error } = await actions.subscribe({
      email: form.email,
      provider: "mailchimp",
    });

    if (error) {
      console.error("subscribe action error", error);
      toast.error(error.message || t("newsletter_error"));
      return;
    }

    if (data?.status === "exists") {
      toast.info(t("newsletter_already_subscribed"));
    } else {
      toast.success(t("newsletter_thanks"));
    }
    form.email = "";
  } catch (e) {
    console.error("subscribe action error", e);
    toast.error(t("newsletter_error"));
  } finally {
    loading.value = false;
  }
};
</script>

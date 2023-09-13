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

<script setup>
import { ref, computed, reactive } from "vue";
import { t } from "@util/translate";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import Loading from "@components/common/Loading.vue";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "mailchimp",
  },
  list_id: String,
});
const loading = ref(false);
const message = ref(null);
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

const submit = () => {
  if (props.type === "mailchimp") {
    loading.value = true;
    fetch("/api/subscribe-mailchimp", {
      method: "POST",
      body: JSON.stringify({ email: form.email }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "pending") {
          toast.success(t("newsletter_thanks"));
          form.email = "";
        } else if (data.status === "Member Exists") {
          toast.info(t("newsletter_already_subscribed"));
          form.email = "";
        } else {
          toast.error(t("newsletter_error"));
        }
      })
      .catch((e) => {
        message.value = t("newsletter_error");
        toast.error(t("newsletter_error"));
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <Transition name="fade">
    <div
      v-show="$show"
      class="dialog pointer-events-auto fixed inset-0 z-[1000] grid w-full cursor-pointer place-items-center bg-dark/50 backdrop-blur-sm"
      @click="hide()"
    >
      <div @click.stop class="container-md relative">
        <div
          class="surface-base dialog__inner relative grid grid-cols-1 overflow-hidden rounded-2xl shadow-xl md:grid-cols-[4fr_5fr]"
        >
          <div class="dialog__media hidden overflow-hidden md:block md:h-full">
            <slot name="image" />
          </div>
          <div
            class="hide-scrollbar dialog__content relative overflow-hidden p-8 md:p-14"
          >
            <form @submit.prevent="submit" class="grid gap-8">
              <div class="grid gap-4 pb-8">
                <h2 class="title-sm">{{ contact?.title }}</h2>

                <slot name="content" />
              </div>
              <div
                class="input-group z-20 w-full"
                v-if="contact.topics.length > 1"
              >
                <label for="contact-topic">{{ t("topic") }} *</label>
                <Popper
                  placement="bottom-start"
                  offsetDistance="1"
                  :show="showPopper"
                  class="w-full"
                >
                  <button
                    id="contact-topic"
                    type="button"
                    @click="showPopper = !showPopper"
                    class="select surface-overlay w-full text-left"
                  >
                    {{ !!topic ? topic : "Select" }}
                  </button>

                  <template #content>
                    <ul>
                      <li
                        v-for="(item, index) in contact.topics"
                        :key="index"
                        :class="
                          topic == item.label ? 'bg-dark/10' : ''
                        "
                      >
                        <button
                          type="button"
                          class="w-full p-2 text-left hover:bg-dark hover:bg-dark/10"
                          @click="
                            setTopic(item);
                            showPopper = false;
                          "
                        >
                          {{ item.label }}
                        </button>
                      </li>
                    </ul>
                  </template>
                </Popper>
              </div>
              <div class="input-group">
                <label for="contact-name">{{ t("name") }} *</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  class="surface-overlay"
                  v-model="form.name"
                />
              </div>

              <div class="input-group">
                <label for="contact-email">{{ t("email") }} *</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  class="surface-overlay"
                  v-model="form.email"
                />
              </div>
              <div class="input-group">
                <label for="contact-phone">{{ t("phone") }}</label>
                <input
                  id="contact-phone"
                  type="text"
                  name="phone"
                  class="surface-overlay"
                  v-model="form.phone"
                />
              </div>
              <div class="input-group">
                <label for="contact-message">{{ t("message") }} *</label>
                <textarea
                  id="contact-message"
                  class="surface-overlay"
                  name="message"
                  cols="30"
                  rows="3"
                  ref="textarea"
                  v-model="input"
                ></textarea>
              </div>
              <div
                class="pointer-events-none right-5 mb-14 flex translate-y-10 justify-end md:sticky md:bottom-0"
              >
                <button
                  class="btn surface-primary pointer-events-auto"
                  type="submit"
                  :disabled="!canSubmit"
                >
                  {{ t("submit") }}
                </button>
              </div>
              <Loading :loading="loading" />
            </form>
          </div>
        </div>
        <button
          class="btn btn-icon surface-dark btn-absolute -right-3 -top-3 z-10"
          @click="hide()"
        >
          <slot />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, reactive, computed } from "vue";
import { t } from "@util/translate";
import { useStore } from "@nanostores/vue";
import { showContact } from "@src/store";
import { useAsyncValidator } from "@vueuse/integrations/useAsyncValidator";
import { useTextareaAutosize } from "@vueuse/core";
import Loading from "@components/common/Loading.vue";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { actions } from "astro:actions";

const props = defineProps({
  contact: {
    type: Object,
  },
});

const $show = useStore(showContact);
const form = reactive({ email: "", name: "", message: "", phone: "" });
const { textarea, input } = useTextareaAutosize();

const rules = {
  email: [
    {
      type: "email",
      required: true,
    },
  ],
  name: [
    {
      type: "string",
      required: true,
    },
  ],
  message: [
    {
      type: "string",
      min: 10,
      required: true,
    },
  ],
};
const { pass, isFinished, errorFields } = useAsyncValidator(form, rules);

onMounted(() => {});

const topic = ref(null);
const showPopper = ref(false);
const loading = ref(false);
const topicChannel = ref(null);
const topicEmail = ref(null);

const hide = () => {
  showContact.set(false);
};

const setTopic = (data) => {
  topic.value = data.label;
  topicEmail.value = data.email;
  topicChannel.value = data.slack_id;
};

if (props.contact.topics.length === 1) {
  setTopic(props.contact.topics[0]);
}

const canSubmit = computed(() => {
  return !loading.value && isFinished.value && pass.value && !!topic.value;
});

const submit = async () => {
  if (!props.contact.provider || !canSubmit.value) return;

  loading.value = true;
  try {
    const { error } = await actions.contact({
      provider: props.contact.provider,
      email: form.email,
      name: form.name,
      phone: form.phone || "",
      message: form.message,
      topic: topic.value,
      topicEmail: topicEmail.value || "",
      topicChannel: topicChannel.value || "",
    });

    if (error) {
      toast.error(t("contact_error"));
      return;
    }

    toast.success(t("contact_thanks"));
    form.email = "";
    form.name = "";
    form.phone = "";
    form.message = "";
    input.value = "";
    hide();
  } catch (e) {
    console.error("contact action error", e);
    toast.error(t("contact_error"));
  } finally {
    loading.value = false;
  }
};

watch(
  $show,

  (val) => {
    const root = document.documentElement;
    if (val) {
      root.dataset.scrollY = String(window.scrollY);
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      const y = Number(root.dataset.scrollY || 0);
      root.style.overflow = "";
      document.body.style.overflow = "";
      delete root.dataset.scrollY;
      window.scrollTo(0, y);
    }
  },
  { immediate: false },
);

watch(
  input,

  (val) => {
    form.message = val;
  },
  { immediate: false },
);
</script>

<style>
/* Nested form control chrome — kept as CSS (not practical as scattered utilities) */
.dialog {
  --popper-theme-padding: 0;
}
.dialog__inner {
  max-height: calc(100vh - 2rem);
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog__media :deep(picture),
.dialog__media :deep(img) {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
@media (width >= 48rem) {
  .dialog__inner {
    height: min(100vh - 2rem, 40rem);
  }
  .dialog__content {
    max-height: calc(100vh - 2rem);
    height: min(100vh - 2rem, 40rem);
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.input-group {
  display: grid;
  gap: 0.375rem;
}
.input-group input,
.input-group textarea,
.input-group .select {
  display: block;
  width: 100%;
  border-radius: 1rem;
  padding: 0.625rem 0.75rem;
  line-height: 1.5;
}
.input-group textarea {
  /* 3 rows of text + vertical padding */
  min-height: calc(3lh + 1.25rem);
  resize: vertical;
}
.input-group label {
  font-size: 0.875rem;
}
</style>

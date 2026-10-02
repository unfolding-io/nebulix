<template>
  <Transition name="fade">
    <div
      v-show="$show"
      class="bg-dark-blur z-1000 dialog pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click="hide()"
    >
      <div @click.stop class="container-md relative">
        <div
          class="surface-base dialog__inner dialog-grid relative overflow-hidden rounded-2xl shadow-xl"
        >
          <div class="overflow-hidden md:block">
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
                <Popper
                  placement="bottom-start"
                  offsetDistance="1"
                  :show="showPopper"
                  class="w-full"
                >
                  <button
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

                <label
                  class="peer-placeholder-shown:left-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary"
                  >{{ t("topic") }} *</label
                >
              </div>
              <div class="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  class="surface-overlay peer"
                  v-model="form.name"
                />
                <label
                  class="peer-placeholder-shown:left-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary"
                  >{{ t("name") }} *</label
                >
              </div>

              <div class="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  class="surface-overlay peer"
                  v-model="form.email"
                />
                <label
                  class="peer-placeholder-shown:left-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary"
                  >{{ t("email") }} *</label
                >
              </div>
              <div class="input-group">
                <input
                  type="text"
                  name="phone"
                  placeholder=" "
                  class="surface-overlay peer"
                  v-model="form.phone"
                />
                <label
                  class="peer-placeholder-shown:left-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary"
                  >{{ t("phone") }}</label
                >
              </div>
              <div class="input-group">
                <textarea
                  class="surface-overlay peer"
                  name="message"
                  id=""
                  placeholder=" "
                  cols="30"
                  rows="2"
                  ref="textarea"
                  v-model="input"
                ></textarea>
                <label
                  class="peer-placeholder-shown:left-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-9 peer-focus:scale-75 peer-focus:text-primary"
                  >Message *</label
                >
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

import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import Popper from "vue3-popper";

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

const mailData = computed(() => {
  return {
    email: form.email,
    name: form.name,
    topicChannel: topicChannel.value,
    topicEmail: topicEmail.value,
    message: `
Topic:  ${topic.value}\r\n
Name: ${form.name}\r\n
Phone: ${form.phone}\r\n
Email: ${form.email}\r\n
Message: \r\n${form.message}\r\n           `,
  };
});

const submit = () => {
  loading.value = true; 
  if (!!props.contact.provider) {
    fetch(`/api/contact-${props.contact.provider}`, {
      method: "POST",
      body: JSON.stringify(mailData.value),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ok") {
          toast.success(t("contact_thanks"));
          form.email = "";
          form.name = "";
          form.phone = "";
          form.message = "";
          input.value = "";
          hide();
        } else {
          toast.error(t("contact_error"));
        }
      })
      .catch((e) => {
        console.log("error", e);
        toast.error(t("contact_error"));
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

watch(
  $show,

  (val) => {
    if (val) { 
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
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
.z-1000 {
  z-index: 1000;
}
.dialog-grid {
  display: grid;
  grid-template-columns: 1fr;
}
@media (width >= 48rem) {
  .dialog-grid {
    grid-template-columns: 4fr 5fr;
  }
}

.bg-dark-blur {
  background-color: color-mix(in oklab, var(--color-dark, #191c26) 50%, transparent);
  backdrop-filter: blur(4px);
}

.dialog {
  --popper-theme-padding: 0;
}
.dialog__inner {
  max-height: calc(100vh - 2rem);
  overflow-x: hidden;
  overflow-y: auto;
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
  position: relative;
  isolation: isolate;
}
.input-group input,
.input-group textarea,
.input-group .select {
  display: block;
  width: 100%;
  border-radius: 1rem;
  padding: 0.625rem 0.75rem;
}
.input-group label {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0.75rem;
  z-index: 10;
  transform-origin: 0;
  transform: translateY(-2.25rem) scale(0.75);
  font-size: 0.875rem;
  transition-duration: 300ms;
}
</style>

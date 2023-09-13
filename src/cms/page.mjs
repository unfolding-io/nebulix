import { toolbarButtons, blocks, buttons, style } from "./common.mjs";

import { t } from "@util/translate";
export const page = {
  name: "page",
  identifier_field: "name",
  folder: "src/content/page",
  label: "Pages",
  format: "frontmatter",
  extension: "mdx",
  icon: "page",
  create: true,
  editor: {
    preview: false,
    frame: false,
  },
  fields: [
    {
      label: t("title"),
      name: "title",
      widget: "string",
      pattern: [".{5,}", "Must have at least 20 characters"],
    },
    {
      label: t("description_seo"),
      name: "description",
      widget: "text",
      pattern: [".{10,}", "Must have at least 10 characters"],
    },

    {
      label: t("hero_intro"),
      name: "intro",
      widget: "text",
      required: false,
    },

    {
      label: t("body"),
      name: "body",
      widget: "markdown",
      required: false,
      comment: "This is a multiline\\ncomment",
      toolbar_buttons: toolbarButtons,
      show_raw: true,
    },
    {
      name: "hero_buttons",
      label: t("hero_buttons"),
      label_singular: "Button",
      widget: "list",
      collapsed: true,
      summary: "{{fields.label}} | {{fields.href}}",
      fields: buttons.fields,
      required: false,
    },

    blocks,
    {
      name: "style",
      label: t("page_style"),
      widget: "object",
      summary: "{{fields.template}} ",
      collapsed: true,
      fields: [
        {
          name: "template",
          label: t("template"),
          widget: "select",
          options: ["full", "split"],
          default: "split",
        },
        {
          name: "hero_template",
          label: t("hero_template"),
          widget: "select",
          options: ["plain", "image"],
          default: "image",
          condition: {
            field: "style.template",
            value: "full",
          },
        },

        {
          name: "hero_surface",
          label: t("hero_surface"),
          multiple: false,
          widget: "relation",
          collection: "config",
          file: "style",
          search_fields: ["surface.*.name"],
          display_fields: ["surface.*.name"],
          value_field: "surface.*.class",
          options_length: 50,
          required: false,
        },
        {
          name: "hero_image_opacity",
          label: t("hero_image_opacity"),
          widget: "select",
          options: [
            "0.1",
            "0.2",
            "0.3",
            "0.4",
            "0.5",
            "0.6",
            "0.7",
            "0.8",
            "0.9",
            "1",
          ],
          default: "80",
          required: false,
        },

        {
          name: "container",
          label: t("container_size"),
          widget: "select",
          options: ["sm", "md", "lg", "xl", "full", "none"],
          default: "md",
          condition: {
            field: "style.template",
            value: "full",
          },
        },
        {
          label: t("page_class"),
          name: "page_class",
          widget: "string",
          required: false,
        },

        {
          label: t("content_class"),
          name: "content_class",
          widget: "string",
          required: false,
        },

        {
          label: t("block_class"),
          name: "block_class",
          widget: "string",
          required: false,
        },
        {
          label: t("hero_class"),
          name: "hero_class",
          widget: "string",
          required: false,
          condition: {
            field: "style.template",
            value: "full",
          },
        },
      ],
    },
    {
      label: t("featured_image"),
      name: "thumbnail",
      widget: "image",
      required: true,
    },
    {
      label: t("og_image"),
      name: "og_image",
      widget: "image",
      required: false,
      hint: t("label_og_image"),
    },
  ],
};

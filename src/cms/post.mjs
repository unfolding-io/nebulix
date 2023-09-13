import { toolbarButtons, style, buttons, blocks } from "./common.mjs";
import { t } from "@util/translate";
export const post = {
  name: "posts",
  identifier_field: "name",
  folder: "src/content/blog",
  label: t("blog"),
  format: "frontmatter",
  extension: "mdx",
  icon: "news",
  create: true,
  editor: {
    preview: false,
    frame: false,
  },
  fields: [
    {
      name: "tag",
      label: t("tags"),
      multiple: true,
      widget: "relation",
      collection: "config",
      max: 5,
      required: false,
      file: "blog",
      search_fields: ["blog_tags.*.name"],
      display_fields: ["blog_tags.*.name"],
      value_field: "blog_tags.*.name",
    },
    {
      label: t("title"),
      name: "title",
      widget: "string",
      pattern: [".{5,}", "Must have at least 5 characters"],
    },
    {
      label: t("description_seo"),
      name: "description",
      widget: "text",
      pattern: [".{0,}", "Must have at least 10 characters"],
    },

    {
      label: t("intro"),
      name: "intro",
      widget: "text",
      required: false,
    },

    {
      label: t("body"),
      name: "body",
      widget: "markdown",
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
    style,
    {
      label: t("pub_date"),
      name: "pubDate",
      widget: "datetime",
      time_format: false,
      format: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      default: new Date().toISOString(),
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

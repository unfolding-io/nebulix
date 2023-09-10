import { t } from "@util/translate";
import { toolbarButtons } from "./common.mjs";

export const menu = {
  name: "menu",
  identifier_field: "name",
  folder: "src/content/menu",
  label: t("menu"),
  format: "frontmatter",
  extension: "mdx",
  create: true,
  icon: "menu",
  editor: {
    preview: false,
    frame: false,
  },
  fields: [
    {
      label: t("title"),
      name: "title",
      widget: "string",
    },
    {
      label: t("description_seo"),
      name: "description",
      widget: "text",
    },

    {
      label: t("intro"),
      name: "intro",
      widget: "text",
      required: false,
    },

    {
      name: "categories",
      label: t("categories"),
      widget: "list",
      collapsed: true,
      summary: "{{fields.title}} ",
      fields: [
        {
          name: "title",
          label: t("title"),
          widget: "string",
        },
        {
          name: "intro",
          label: t("intro"),
          widget: "text",
          required: false,
        },
        {
          name: "menu_items",
          label: t("menu_items"),
          label_singular: t("menu_item"),
          widget: "list",
          summary: "{{fields.title}} ",
          collapsed: true,
          fields: [
            {
              name: "title",
              label: t("title"),
              widget: "string",
            },
            {
              name: "intro",
              label: t("intro"),
              widget: "text",

              required: false,
            },
            {
              name: "price",
              label: t("prices"),
              label_singular: t("price"),
              widget: "list",
              summary: "{{fields.price}} ",
              collapsed: true,
              required: false,
              fields: [
                {
                  name: "label",
                  label: t("label"),
                  widget: "string",
                  required: false,
                },
                {
                  name: "price",
                  label: t("price"),
                  widget: "number",
                  value_type: "float",
                  min: 0,
                  required: false,
                },
              ],
            },
            {
              name: "details",
              label: t("details"),
              widget: "object",
              collapsed: true,
              fields: [
                {
                  name: "allergens",
                  label: t("allergens"),
                  widget: "select",
                  required: false,
                  multiple: true,
                  min: 0,
                  options: [
                    {
                      label: t("celery"),
                      value: "celery",
                    },
                    {
                      label: t("gluten"),
                      value: "gluten",
                    },
                    {
                      label: t("crustaceans"),
                      value: "crustaceans",
                    },
                    {
                      label: t("eggs"),
                      value: "eggs",
                    },
                    {
                      label: t("fish"),
                      value: "fish",
                    },
                    {
                      label: t("lupin"),
                      value: "lupin",
                    },
                    {
                      label: t("milk"),
                      value: "milk",
                    },
                    {
                      label: t("molluscs"),
                      value: "molluscs",
                    },
                    {
                      label: t("mustard"),
                      value: "mustard",
                    },
                    {
                      label: t("peanuts"),
                      value: "peanuts",
                    },
                    {
                      label: t("sesame"),
                      value: "sesame",
                    },
                    {
                      label: t("soybeans"),
                      value: "soybeans",
                    },
                    {
                      label: t("sulphur"),
                      value: "sulphur",
                    },
                    {
                      label: t("tree_nuts"),
                      value: "treenuts",
                    },
                  ],
                },
                {
                  name: "labels",
                  label: "Labels",
                  widget: "select",
                  multiple: true,
                  required: false,
                  min: 0,
                  options: [
                    {
                      label: t("local"),
                      value: "local",
                    },
                    {
                      label: t("bio"),
                      value: "bio",
                    },
                    {
                      label: t("eco"),
                      value: "eco",
                    },
                    {
                      label: t("vegan"),
                      value: "vegan",
                    },
                    {
                      label: t("vegetarian"),
                      value: "vegetarian",
                    },
                    {
                      label: t("halal"),
                      value: "halal",
                    },
                    {
                      label: t("kosher"),
                      value: "kosher",
                    },
                    {
                      label: t("raw"),
                      value: "raw",
                    },
                    {
                      label: t("healthy"),
                      value: "healthy",
                    },
                    {
                      label: t("offer"),
                      value: "offer",
                    },
                  ],
                },
              ],
            },
            {
              name: "thumbnail",
              label: t("image"),
              widget: "image",
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "style",
      label: t("page_style"),
      widget: "object",
      summary: "{{fields.hero_template}} ",
      collapsed: true,
      fields: [
        {
          name: "hero_template",
          label: t("hero_template"),
          widget: "select",
          options: ["plain", "image"],
          default: "image",
        },

        {
          name: "container",
          label: t("container_size"),
          widget: "select",
          options: ["sm", "md", "lg", "xl", "full", "none"],
          default: "md",
        },
        {
          label: t("content_class"),
          name: "content_class",
          widget: "string",
          required: false,
        },
        {
          label: t("page_class"),
          name: "page_class",
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
      label: t("body"),
      name: "body",
      widget: "markdown",
      comment: "This is a multiline\\ncomment",
      toolbar_buttons: toolbarButtons,
      required: false,
      show_raw: true,
    },

    {
      label: t("featured_image"),
      name: "thumbnail",
      widget: "image",
      required: true,
    },
    {
      label: t("pub_date"),
      name: "date",
      widget: "datetime",
      time_format: false,
      format: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      default: new Date().toISOString(),
    },
  ],
};

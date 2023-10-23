import { toolbarButtons, blocks } from "./common.mjs";
import { t } from "@util/translate";
export const product = {
  name: "product",
  identifier_field: "name",
  folder: "src/content/product",
  label: t("product"),
  format: "frontmatter",
  extension: "mdx",
  icon: "shop",
  create: true,
  summary: "{{title}} | {{price}} ",
  editor: {
    preview: false,
    frame: false,
  },
  sortable_fields: {
    fields: ["title", "date", "price", "offer_price", "commit_date"],
    default: {
      field: "date",
      direction: "Descending",
    },
  },
  view_filters: [
    {
      label: t("is_digital"),
      field: "is_digital",
      pattern: true,
    },
    {
      label: t("out_of_stock"),
      field: "in_stock",
      pattern: false,
    },
    {
      label: t("in_stock"),
      field: "in_stock",
      pattern: true,
    },
    {
      label: t("offer"),
      field: "offer_price",
      pattern: "^(0*[1-9][0-9]*(.[0-9]+)?|0+.[0-9]*[1-9][0-9]*)$",
    },
  ],
  fields: [
    {
      name: "in_stock",
      label: t("in_stock"),
      widget: "boolean",
      default: true,
    },
    {
      name: "category",
      label: t("categories"),
      multiple: true,
      widget: "relation",
      collection: "config",
      max: 5,
      required: true,
      file: "shop",
      search_fields: ["product_categories.*.name"],
      display_fields: ["product_categories.*.name"],
      value_field: "product_categories.*.name",
    },
    {
      name: "price",
      label: t("price"),
      widget: "number",
      value_type: "float",
      min: 0,
    },

    {
      name: "offer_price",
      label: t("offer_price"),
      widget: "number",
      value_type: "float",
      min: 0,
      required: false,
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

      toolbar_buttons: toolbarButtons,
      required: false,
      show_raw: true,
    },
    {
      name: "min",
      label: t("min_quantity"),
      widget: "number",
      value_type: "float",
      min: 1,
      required: false,
    },
    {
      name: "max",
      label: t("max_quantity"),
      widget: "number",
      value_type: "float",
      min: 1,
      required: false,
    },

    {
      name: "tax_included",
      label: t("tax_included"),
      widget: "boolean",
      default: false,
    },
    {
      name: "taxable",
      label: t("taxable"),
      widget: "boolean",
      default: true,
    },

    {
      name: "is_digital",
      label: t("is_digital"),
      widget: "boolean",
      default: false,
    },

    {
      label: t("snipcart_file_id"),
      name: "guid",
      widget: "string",
      condition: {
        field: "is_digital",
        value: "true",
      },
    },

    {
      name: "shipping",
      label: t("shipping"),
      widget: "object",
      summary: "{{fields.name}}: {{fields.birthdate}}",
      condition: {
        field: "is_digital",
        value: "false",
      },
      fields: [
        {
          name: "weight",
          label: t("weight_in_grams"),
          widget: "number",
          value_type: "float",
          min: 0,
        },
        {
          name: "width",
          label: t("width_in_cm"),
          widget: "number",
          value_type: "float",
          min: 0,
          required: false,
        },
        {
          name: "height",
          label: t("height_in_cm"),
          widget: "number",
          value_type: "float",
          min: 0,
          required: false,
        },
        {
          name: "length",
          label: t("length_in_cm"),
          widget: "number",
          value_type: "float",
          min: 0,
          required: false,
        },
      ],
    },
    {
      name: "variations",
      label: t("product_variations"),
      label_singular: t("product_variation"),
      widget: "list",
      summary: "{{fields.name}} ",
      collapsed: true,
      required: false,
      fields: [
        {
          name: "name",
          label: t("option_name"),
          widget: "string",
          required: false,
        },
        {
          name: "show_images",
          label: t("show_images"),
          widget: "boolean",
        },
        {
          name: "id",
          label: t("id"),
          widget: "uuid",
          allow_regenerate: false,
        },
        {
          name: "options",
          label: t("options"),
          label_singular: t("product_option"),
          widget: "list",
          summary: "{{fields.label}} {{fields.price}} ",
          collapsed: true,
          required: false,
          fields: [
            {
              name: "label",
              label: t("label"),
              widget: "string",
            },
            {
              name: "price",
              label: t("more_price"),
              widget: "number",
              value_type: "float",
              min: 0.0,
              required: false,
            },
            {
              label: t("image"),
              name: "thumbnail",
              widget: "image",
              required: false,
            },

            {
              name: "id",
              label: t("id"),
              widget: "uuid",
              allow_regenerate: false,
            },
          ],
        },
      ],
    },

    {
      name: "features",
      label: t("product_features"),
      label_singular: "feature",
      widget: "list",
      collapsed: true,
      summary: "{{fields.name}} | {{fields.value}}",
      required: false,
      fields: [
        {
          label: t("name"),
          name: "name",
          widget: "string",
        },
        {
          label: t("value"),
          name: "value",
          widget: "string",
        },
      ],
    },
    {
      name: "style",
      label: t("page_style"),
      widget: "object",
      summary: "template: {{fields.template}} | hero:{{fields.hero_template}} ",
      collapsed: true,
      fields: [
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
      ],
    },

    blocks,
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
    {
      label: t("pub_date"),
      name: "date",
      widget: "datetime",
      time_format: false,
      format: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      default: new Date().toISOString(),
    },
    {
      label: t("product_id"),
      name: "id",
      allow_regenerate: false,
      widget: "uuid",
    },
  ],
};

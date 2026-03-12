<!-- Support rich text display -->
<template>
  <div class="gfr-content" v-html="sanitizedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ContentProps {
  context: string
}

const props = defineProps<ContentProps>()

// XSS defense: remove all script tags
const sanitizedContent = computed(() => {
  return props.context.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
})
</script>
<style lang="scss">
.gfr-content {
  line-height: normal;
  color: var(--dark);
  & > *:first-child {
    margin-top: 0;
  }
  *:last-child {
    margin-bottom: 0;
  }
  *,
  ::before,
  ::after {
    font-family: inherit !important;
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: currentColor;
  }

  hr {
    height: 0;
    color: inherit;
    border-top-width: 1px;
    border-top-color: #3b3b3b;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  b,
  strong {
    font-weight: 700;
  }

  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -4px;
  }
  sup {
    top: -8px;
  }
  table {
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: inherit;
    color: inherit;
    margin: 0;
    padding: 0;
  }
  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }
  fieldset {
    margin: 0;
    padding: 0;
  }
  legend {
    padding: 0;
  }
  ol,
  ul,
  menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    a {
      text-decoration: none;
      color: inherit;
    }
  }
  h1 {
    font-size: 36px;
    font-weight: var(--font-bold);
    margin: 16px 0;
  }
  h2 {
    font-size: 32px;
    font-weight: var(--font-bold);
    margin-top: 16px;
  }
  h3 {
    font-size: 28px;
    font-weight: var(--font-bold);
    margin-top: 16px;
  }
  h4 {
    font-size: 24px;
    font-weight: var(--font-bold);
    margin-top: 16px;
  }
  h5 {
    font-size: 20px;
    font-weight: var(--font-bold);
    margin-top: 16px;
  }
  h6 {
    font-size: 16px;
    font-weight: var(--font-bold);
    margin-top: 16px;
  }

  p {
    margin-top: 16px;
  }
  img {
    max-width: 100% !important;
    height: auto;
    margin-top: 16px;
    zoom: inherit !important;
  }
  a {
    text-decoration: underline;
  }
  ul,
  ol {
    font-size: 22px;
    margin-top: 16px;
    padding-left: 32px;
    ul,
    ol {
      padding-left: 32px;
    }
  }
  ul > li {
    list-style-type: disc;
    margin-top: 16px;
    &::marker {
      display: inline-block;
      font-size: 1em;
      line-height: 1em;
    }
  }
  ol > li {
    list-style-type: decimal;
    margin-top: 16px;
    &::marker {
      display: inline-block;
      font-size: 1em;
      line-height: 1em;
    }
  }
  hr {
    width: 100%;
    border-top: 1px solid var(--dark);
  }
  blockquote {
    max-width: 80%;
    position: relative;
    margin-top: 16px;
    margin-left: 8px;
    margin-right: 8px;
    padding: 16px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background-color: var(--dark);
    }
  }
  strong {
    font-weight: 700;
  }
  em,
  i {
    font-style: italic;
  }
  code {
    &::-webkit-scrollbar {
      display: none;
    }
  }
  pre {
    position: relative;
    code {
      font-size: 12px;
      margin-top: 16px;
      &.hljs {
        background-color: #363a41;
        padding: 16px;
        direction: ltr;
      }
    }
    .hljs-tag {
      display: none;
    }
  }
  table {
    display: table;
    border-collapse: collapse;
    width: 100%;
    margin-top: 16px;
  }
  table thead {
    border: 1px solid #999;
  }
  table tr th {
    font-weight: normal;
    text-align: left;
    padding: 16px;
    height: 32px;
    color: inherit;
    font-weight: var(--font-bold);
    border-right: 1px solid #999;
    border-left: 1px solid #999;
    background-color: transparent;
  }
  table tbody {
    border: 1px solid #999;
    border-top: 0;
  }
  table tbody tr {
    border-bottom: 1px solid #999;
    &:last-child {
      border-bottom: 0;
    }
  }
  table tr td {
    padding: 16px;
    border-right: 1px solid #999;
    border-left: 1px solid #999;
    &:first-child {
      border-left: 0;
    }
    &:last-child {
      border-right: 0;
    }
  }
  iframe {
    width: 700px;
    height: 394px;
    display: block;
    margin-top: 16px;
  }
  video {
    width: 100%;
    margin-top: 16px;
  }
}
</style>

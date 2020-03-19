<template>
  <component :is="template" :tree="component" />
</template>

<script lang="ts">
import DynamicLoader from '@/components/DynamicLoader.vue';
import ListView from '@/views/ListView.vue';
import NotFound from '@/views/NotFound.vue';
import {Component, Mixins} from 'vue-property-decorator';
// import {TemplateTypes} from '../api';

/**
 * Dynamic view loader/wrapper for the Design System.
 */
@Component
export default class DesignLanguage extends Mixins(DynamicLoader) {
  notFoundTemplate = NotFound;
  defaultTemplate = ListView;
  templateType = 'detail';
}
</script>

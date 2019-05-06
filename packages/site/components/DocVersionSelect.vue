<template>
  <div>
    <label>Select an API version</label>
    <select @change="versionChanged">
      <option
        v-for="version in versionHistory"
        :value="version.name.includes('latest') ? 'latest' : version.version"
        :key="version.version"
        :selected="version.version === currentVersion"
      >
        {{version.name}}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import versionHistory from '@/data/diez-versions.json';
import {Component, Prop, Vue} from 'nuxt-property-decorator';

@Component
export default class DocVersionSelect extends Vue {
  versionHistory = versionHistory;

  get currentVersion () {
    if (this.$route && this.$route.params && this.$route.params.version) {
      return this.$route.params.version;
    }

    return '';
  }

  versionChanged (event: any) {
    this.$router.push(`/docs/${event.target.value}/`);
  }
}
</script>

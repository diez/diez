<template>
  <div class="version-select">
    <select @change="versionChanged">
      <option
        v-for="version in versionHistory"
        :value="version.name.includes('latest') ? 'latest' : version.version"
        :key="version.version"
        :selected="version.version === currentVersion()"
      >
        {{version.name}}
      </option>
    </select>
  </div>
</template>

<script>
import versionHistory from '@theme/data/diez-versions.json';

export default {
  data () {
    return {
      versionHistory
    };
  },

  methods: {
    currentVersion () {
      if (this.$route && this.$route.params && this.$route.params.version) {
        return this.$route.params.version;
      }
      return '';
    },

    versionChanged (event) {
      this.$router.push(`/docs/${event.target.value}/index.html`);
    }
  }

};
</script>

<style lang="scss" scoped>
.version-select {
  margin: 80px 0 0 18px;
}
</style>

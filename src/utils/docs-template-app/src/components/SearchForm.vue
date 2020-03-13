<template>
  <form :action="`/${routeName}`" @submit.prevent="updateResults">
    <div class="text-input">
      <input type="search" name="name" v-model="searchQuery" autofocus="" ref="searchInput">
      <span class="icon">
        <span v-if="searchQuery" @click="clearQuery"><cross size="12" /></span>
        <magnifier v-else size="18" />
      </span>
    </div>

    <custom-select :options="types" defaultOption="All" :selected="typeQuery" @change="updateTypeQuery" :showActiveStatus="true" />
  </form>
</template>

<script lang="ts">
import Cross from '@/assets/icons/Cross.vue';
import Magnifier from '@/assets/icons/Magnifier.vue';
import CustomSelect from '@/components/CustomSelect.vue';
import {findAvailableTypes} from '@/utils/component';
import {Component, Vue, Watch} from 'vue-property-decorator';

/**
 * Search form.
 */
@Component({
  components: {
    CustomSelect,
    Magnifier,
    Cross,
  },
})
export default class SearchForm extends Vue {
  private searchQuery: string | null = null;
  private typeQuery: string | null = null;
  private routeName = 'search';
  protected types = new Set<string>();

  mounted () {
    if (this.$route.query.type) {
      this.typeQuery = this.$route.query.type as string;
    }

    if (this.$route.query.name) {
      this.searchQuery = this.$route.query.name as string;
    }

    this.types = findAvailableTypes(this.$treeRoot);

    window.addEventListener('keypress', (event) => {
      const searchInput = this.$refs.searchInput as HTMLInputElement;
      if (document.activeElement !== searchInput && String.fromCharCode(event.keyCode) === '/') {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }

  @Watch('$route.fullPath')
  cleanQuery () {
    if (this.$route.path !== `/${this.routeName}`) {
      this.searchQuery = null;
      this.typeQuery = null;
    }
  }

  clearQuery () {
    this.searchQuery = null;
    this.types = findAvailableTypes(this.$treeRoot);
    this.updateTypeQuery('');
  }

  updateTypeQuery (type: string) {
    this.typeQuery = type;
    this.updateResults();
  }

  @Watch('searchQuery')
  async updateResults () {
    if (this.searchQuery === null && this.typeQuery === null) {
      return;
    }

    try {
      await this.$router.push({
        name: this.routeName,
        query: {
          name: this.searchQuery,
          type: this.typeQuery,
        },
      });
    } catch (error) {
      if (error.name === 'NavigationDuplicated') {
        // noop, this error is expected to happen when changing the query string programatically.
        return;
      }

      throw error;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@diez/styles.scss";

form {
  display: flex;
  position: sticky;
  width: calc(100% + 20px);
  background-color: white;
  padding: 20px 10px 10px;
  margin: 0 -20px 10px;
  top: 0;
  left: -10px;
  z-index: 5;
}

.text-input {
  position: relative;
  display: inline-block;
  width: 75%;
  margin-right: 20px;

  svg {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 8px;
  }
}

input[type="search"] {
  @include search-panel();
  @include search-size();

  font-weight: 700;
  border: 1px solid $palette-primary-border;
  padding: 5px 35px 8px 5px;
  width: 100%;
  border-radius: $corner-radii-base;

  &:hover {
    border: 1px solid $palette-primary-border-accent;
  }

  &:focus {
    outline: none;
    border: 1px solid $palette-electric-violet;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
}

.icon span {
  position: absolute;
  top: 4px;
  right: 2px;
}
</style>

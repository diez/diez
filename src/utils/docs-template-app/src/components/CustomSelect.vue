<template>
  <div :class="{select: true, active}">
    <select name="type" id="search-by-type" @change="updateOption" ref="select" :class="{active}">
      <option v-if="defaultOption" value="" :selected="!selected">
        {{defaultOption}}
      </option>
      <option :value="option" v-for="option in options" :key="option" :selected="selected && option.toLowerCase() === selected.toLowerCase()">
        {{option}}
      </option>
    </select>
    <span class="icon">
      <cross v-if="active" />
      <arrow v-else />
    </span>
  </div>
</template>

<script lang="ts">
import Arrow from '@/assets/icons/Arrow.vue';
import Cross from '@/assets/icons/Cross.vue';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * Styled <select> element
 */
@Component({
  components: {
    Arrow,
    Cross,
  },
})
export default class CustomSelect extends Vue {
  @Prop({default: []}) readonly options!: string[];
  @Prop() readonly defaultOption!: string;
  @Prop() readonly selected!: string;
  @Prop({default: false}) readonly showActiveStatus!: boolean;

  protected isActive = false;

  get active () {
    return this.showActiveStatus && this.isActive;
  }

  get selectRef () {
    return this.$refs.select as HTMLSelectElement;
  }

  @Watch('selected')
  protected onSelectedChange () {
    this.isActive = Boolean(this.selected);
  }

  protected updateOption (event: Event) {
    this.$emit('change', this.selectRef.value);
    this.isActive = Boolean(this.selectRef.value);
  }
}
</script>


<style lang="scss" scoped>
@import "@diez/styles.scss";

.select {
  @include select-panel();
  @include select-size();
  border: 1px solid $palette-primary-border;
  position: relative;
  display: inline-block;
  width: 25%;

  &:hover {
    border: 1px solid $palette-primary-border-accent;
  }

  &.active {
    pointer-events: all;
    border-color: $palette-electric-violet;

    select {
      color: $palette-electric-violet;

      &:-moz-focusring {
        text-shadow: 0 0 0 $palette-electric-violet;
      }
    }

    .icon {
      top: 8px;
    }
  }

  select {
    @include select-typograph();
    -webkit-appearance: none;
    outline: none;
    border: none;
    background: transparent;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 9px 10px;
    letter-spacing: 1.4px;

    &:-moz-focusing {
      color: transparent;
      text-shadow: 0 0 0 $palette-secondary-text;
    }
  }

  .icon {
    position: absolute;
    right: 12px;
    top: 8px;
    transform: rotate(90deg) scale(0.8);
    pointer-events: none;
  }
}
</style>

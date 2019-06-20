<template>
  <ul>
    <li v-for="title in titles" @click="handleClick(title)" :class="{active: title === currentActive}">
      {{title}}
    </li>
  </ul>
</template>

<script>
export default {
  props: ['titles'],
  data () {
    return {
      currentActive: this.$props.titles && this.$props.titles[0]
    };
  },
  methods: {
    handleClick (title) {
      this.$emit('tabChanged', title);
      this.$data.currentActive = title;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../styles/_utils.scss';

ul {
  display: flex;
  padding: 0;
  margin: 0 0 -35px 0;
}

li {
  margin: 0;
  list-style: none;
  padding: 0 $spacingLG $spacingXS;
  color: $gray900;
  background: fade-out($gray700, .36);
  margin-right: 8px;
  border-radius: 4px 4px 0px 0;
  cursor: pointer;
  border-top: 5px solid transparent;
  transition: background 140ms ease;

  &:hover {
    background: fade-out($gray700, .2);
  }

  &.active {
    background: $cardColor;
    color: $black;
    border-color: $purple;
  }
}
</style>

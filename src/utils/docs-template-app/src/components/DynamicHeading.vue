<script lang="ts">
import {CreateElement} from 'vue';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * Renders a dynamic heading element based on a `level` prop.
 */
@Component
export default class DynamicHeading extends Vue {
  @Prop() readonly level!: number|string;

  render (h: CreateElement) {
    return h(`h${this.level}`, this.$slots.default);
  }
}
</script>

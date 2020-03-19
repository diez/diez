<script lang="ts">
import {findComponentFromPath} from '@/utils/component';
import {Component as VueComponent, CreateElement} from 'vue';
import {Component, Vue, Watch} from 'vue-property-decorator';
type DocsTargetSpec = import('@diez/targets').DocsTargetSpec;

@Component
class VoidComponent extends Vue {
  render (h: CreateElement) {
    return h('span');
  }
}

/**
 * Abstract Vue component that implements logic to dynamically load components from bindings.
 */
@Component
export default class DynamicLoader extends Vue {
  protected component!: DocsTargetSpec | undefined;
  protected notFoundTemplate: VueComponent = VoidComponent;
  protected defaultTemplate: VueComponent = VoidComponent;
  protected templateType!: string;

  protected template: () => VueComponent | Promise<VueComponent> = () => this.notFoundTemplate;

  @Watch('$route.fullPath', {immediate: true})
  protected updateStatus () {
    this.component = this.getComponent();
    this.template = this.getTemplate(this.component);
    this.onUpdateStatus();
  }

  protected onUpdateStatus () {
    // noop, this is here so components using this as a mixing can implement this method.
  }

  protected getTemplate (component?: DocsTargetSpec) {
    return async () => {
      if (!component || !this.templateType) {
        return this.notFoundTemplate;
      }

      if (component.isPrimitive) {
        return this.getPrimitiveTemplate(component);
      }

      // @ts-ignore
      if (component.binding && component.binding.templates && component.binding.templates[this.templateType]) {
        // TODO: be smarter and allow third party modules.
        // const template =
        //   await import(`@diez/stdlib/sources/docs/templates/${component.binding.templates[this.templateType]}`);

        // if (template) {
        //   return template as VueComponent;
        // }
      }

      return this.defaultTemplate;
    };
  }

  protected getComponent (componentPath = this.$route.fullPath) {
    const pathArray = componentPath.replace(/#.*/g, '').split('/').filter(Boolean);
    return this.findComponent(pathArray);
  }

  protected getComponentOrPrimitive (path = this.$route.fullPath) {
    const pathArray = path.replace(/#/g, '/').split('/').filter(Boolean);
    return this.findComponent(pathArray);
  }

  private findComponent (pathArray: string[]) {
    return findComponentFromPath(pathArray, this.$treeRoot);
  }

  protected getPrimitiveTemplate (primitive: DocsTargetSpec) {
    // noop, this is here so components using this as a mixing can implement this method.
    return this.defaultTemplate;
  }

}
</script>
